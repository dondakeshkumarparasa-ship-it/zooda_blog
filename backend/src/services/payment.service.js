// Payment service integration stub
const createPaymentIntent = async (amount, currency = "INR") => {
  console.log(`[Payment Service] Simulating creation of payment intent for ${amount} ${currency}`);
  return { success: true, clientSecret: "mock_client_secret_" + Date.now() };
};

module.exports = {
  createPaymentIntent
};
