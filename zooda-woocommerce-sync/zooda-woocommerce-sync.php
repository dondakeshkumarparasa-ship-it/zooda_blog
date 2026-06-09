<?php
/**
 * Plugin Name: Zooda WooCommerce Sync
 * Plugin URI: https://zooda.in
 * Description: Dynamically syncs WooCommerce products with Zooda Business Hub to train your AI chatbots.
 * Version: 1.2.0
 * Author: Zooda Team
 * Author URI: https://zooda.in
 * License: GPL2
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

add_action('admin_menu', 'zooda_sync_menu');

function zooda_sync_menu() {
    add_menu_page(
        'Zooda Sync', 
        'Zooda Sync', 
        'manage_options', 
        'zooda-sync-settings', 
        'zooda_sync_settings_page',
        'dashicons-update'
    );
}

function zooda_sync_all_products() {
    $api_key = get_option('zooda_api_key');
    $api_url = get_option('zooda_api_url', 'https://api.zooda.in');
    if (empty($api_key)) {
        update_option('zooda_sync_last_status', 'failed');
        update_option('zooda_sync_last_error', 'API Key is missing or empty.');
        return false;
    }
    
    $args = array(
        'limit' => -1,
        'status' => 'publish',
        'return' => 'ids',
    );
    $products = wc_get_products($args);
    $payload_products = array();

    foreach ($products as $product_id) {
        $product = wc_get_product($product_id);
        if (!$product) continue;
        
        $image_id = $product->get_image_id();
        $image_url = $image_id ? wp_get_attachment_url($image_id) : '';
        
        // Strip HTML tags from description and short description for AI friendliness
        $desc = wp_strip_all_tags($product->get_description());
        if (empty($desc)) {
            $desc = wp_strip_all_tags($product->get_short_description());
        }
        
        // Ensure SKU is never empty. Fallback to product_id if empty
        $sku = $product->get_sku();
        if (empty($sku)) {
            $sku = 'product_' . $product_id;
        }
        
        $payload_products[] = array(
            'title' => $product->get_name(),
            'description' => $desc,
            'price' => $product->get_price(),
            'status' => $product->is_in_stock() ? 'In Stock' : 'Out of Stock',
            'imageUrl' => $image_url,
            'category' => implode(', ', wp_get_post_terms($product_id, 'product_cat', array('fields' => 'names'))),
            'sku' => $sku,
            'date' => date('Y-m-d H:i:s')
        );
    }

    if (empty($payload_products)) {
        update_option('zooda_sync_last_status', 'success');
        update_option('zooda_sync_last_error', '');
        update_option('zooda_sync_last_time', current_time('mysql'));
        return true;
    }

    $api_endpoint = rtrim($api_url, '/') . '/api/client/sync-wordpress-products-bulk';
    
    $response = wp_remote_post($api_endpoint, array(
        'method' => 'POST',
        'headers' => array(
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . $api_key
        ),
        'body' => wp_json_encode(array('products' => $payload_products)),
        'timeout' => 45,
        'blocking' => true,
        'sslverify' => false // Bypass SSL checks for local environments/shared host cURL limits
    ));

    if (is_wp_error($response)) {
        $error_msg = $response->get_error_message();
        update_option('zooda_sync_last_status', 'failed');
        update_option('zooda_sync_last_error', 'Connection error: ' . $error_msg);
        return false;
    }

    $code = wp_remote_retrieve_response_code($response);
    $body = wp_remote_retrieve_body($response);
    
    if ($code < 200 || $code >= 300) {
        $data = json_decode($body, true);
        $server_err = isset($data['message']) ? $data['message'] : 'Server returned HTTP ' . $code;
        update_option('zooda_sync_last_status', 'failed');
        update_option('zooda_sync_last_error', $server_err);
        return false;
    }

    $data = json_decode($body, true);
    if (empty($data) || !$data['success']) {
        $server_err = isset($data['message']) ? $data['message'] : 'Invalid response payload.';
        update_option('zooda_sync_last_status', 'failed');
        update_option('zooda_sync_last_error', $server_err);
        return false;
    }

    update_option('zooda_sync_last_status', 'success');
    update_option('zooda_sync_last_error', '');
    update_option('zooda_sync_last_time', current_time('mysql'));
    return true;
}

function zooda_sync_settings_page() {
    if (isset($_POST['zooda_save_settings'])) {
        update_option('zooda_api_key', sanitize_text_field($_POST['zooda_api_key']));
        update_option('zooda_api_url', esc_url_raw($_POST['zooda_api_url']));
        zooda_sync_all_products();
    }

    if (isset($_POST['zooda_sync_now'])) {
        zooda_sync_all_products();
    }

    $api_key = get_option('zooda_api_key', '');
    $api_url = get_option('zooda_api_url', 'https://api.zooda.in');
    
    $last_status = get_option('zooda_sync_last_status', '');
    $last_error = get_option('zooda_sync_last_error', '');
    $last_time = get_option('zooda_sync_last_time', '');
    
    ?>
    <div class="wrap">
        <h1>Zooda WooCommerce Sync Settings</h1>
        
        <?php if (!empty($last_status)) : ?>
            <?php if ($last_status === 'success') : ?>
                <div class="notice notice-success inline" style="margin: 15px 0; padding: 10px 15px;">
                    <p style="margin: 0; font-size: 14px;">
                        <strong>✓ Sync Completed Successfully!</strong><br>
                        Last catalog sync completed at: <code><?php echo esc_html($last_time); ?></code>
                    </p>
                </div>
            <?php else : ?>
                <div class="notice notice-error inline" style="margin: 15px 0; padding: 10px 15px; border-left-color: #d63638;">
                    <p style="margin: 0; font-size: 14px;">
                        <strong>❌ Sync Connection Failed!</strong><br>
                        <strong>Error Message:</strong> <code style="color: #c92a2a;"><?php echo esc_html($last_error); ?></code><br>
                        <span style="font-size: 12px; color: #666;">Please verify your connection API key, ensure the API Base URL is reachable, and that your server allows outbound requests.</span>
                    </p>
                </div>
            <?php endif; ?>
        <?php endif; ?>

        <form method="post" action="">
            <table class="form-table">
                <tr valign="top">
                <th scope="row">Zooda Connection API Key</th>
                <td>
                    <input type="text" name="zooda_api_key" value="<?php echo esc_attr($api_key); ?>" style="width: 450px;" class="regular-text" />
                    <p class="description">Enter your unique API connection key from your Zooda Client Dashboard.</p>
                </td>
                </tr>
                
                <tr valign="top">
                <th scope="row">Zooda API Base URL</th>
                <td>
                    <input type="text" name="zooda_api_url" value="<?php echo esc_attr($api_url); ?>" style="width: 450px;" class="regular-text" />
                    <p class="description">Configure the endpoint server URL of your Zooda Hub instance.</p>
                </td>
                </tr>
            </table>
            
            <p class="submit" style="display: flex; gap: 10px;">
                <input type="submit" name="zooda_save_settings" class="button button-primary" value="Save & Sync Now" />
                <input type="submit" name="zooda_sync_now" class="button button-secondary" value="Force Sync Catalog" />
            </p>
        </form>
    </div>
    <?php
}

// Hook WooCommerce product modifications
add_action('woocommerce_update_product', 'zooda_sync_product_to_hub', 10, 1);
add_action('woocommerce_new_product', 'zooda_sync_product_to_hub', 10, 1);

function zooda_sync_product_to_hub($product_id) {
    $api_key = get_option('zooda_api_key');
    $api_url = get_option('zooda_api_url', 'https://api.zooda.in');
    
    if (empty($api_key)) {
        return;
    }
    
    $product = wc_get_product($product_id);
    if (!$product || $product->get_status() !== 'publish') {
        return;
    }
    
    $image_id = $product->get_image_id();
    $image_url = $image_id ? wp_get_attachment_url($image_id) : '';
    
    $desc = wp_strip_all_tags($product->get_description());
    if (empty($desc)) {
        $desc = wp_strip_all_tags($product->get_short_description());
    }
    
    $sku = $product->get_sku();
    if (empty($sku)) {
        $sku = 'product_' . $product_id;
    }
    
    $payload = array(
        'title' => $product->get_name(),
        'description' => $desc,
        'price' => $product->get_price(),
        'status' => $product->is_in_stock() ? 'In Stock' : 'Out of Stock',
        'imageUrl' => $image_url,
        'category' => implode(', ', wp_get_post_terms($product_id, 'product_cat', array('fields' => 'names'))),
        'sku' => $sku,
        'date' => date('Y-m-d H:i:s')
    );
    
    wp_remote_post(rtrim($api_url, '/') . '/api/client/sync-wordpress-product', array(
        'method' => 'POST',
        'headers' => array(
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . $api_key
        ),
        'body' => wp_json_encode($payload),
        'timeout' => 15,
        'blocking' => false,
        'sslverify' => false // Bypass SSL check
    ));
}

// Hook WooCommerce product deletions
add_action('woocommerce_trash_product', 'zooda_delete_product_from_hub', 10, 1);
add_action('woocommerce_delete_product', 'zooda_delete_product_from_hub', 10, 1);

function zooda_delete_product_from_hub($product_id) {
    $api_key = get_option('zooda_api_key');
    $api_url = get_option('zooda_api_url', 'https://api.zooda.in');
    
    if (empty($api_key)) {
        return;
    }
    
    $product = wc_get_product($product_id);
    if (!$product) {
        return;
    }
    
    $sku = $product->get_sku();
    if (empty($sku)) {
        $sku = 'product_' . $product_id;
    }
    
    $payload = array(
        'sku' => $sku,
        'title' => $product->get_name()
    );
    
    wp_remote_post(rtrim($api_url, '/') . '/api/client/sync-product-delete', array(
        'method' => 'POST',
        'headers' => array(
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . $api_key
        ),
        'body' => wp_json_encode($payload),
        'timeout' => 15,
        'blocking' => false,
        'sslverify' => false // Bypass SSL check
    ));
}
