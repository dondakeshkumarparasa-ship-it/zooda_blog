const Page = require('./page.model');

const getPage = async (req, res) => {
  try {
    const { slug } = req.params;
    let page = await Page.findOne({ slug });
    
    if (!page) {
      let defaultTitle = '';
      let defaultContent = '';
      let defaultMetadata = {};
      
      if (slug === 'about') {
        defaultTitle = 'About Us';
        defaultContent = `<h2>Welcome to Zooda.in</h2>
<p>Zooda.in is India's growing digital platform dedicated to helping business owners showcase their online presence and reach the right audience.</p>
<p>We created Zooda.in with a simple vision — to build a centralized, transparent, and engagement-driven marketplace where businesses with websites can stand out, connect with customers, and grow faster.</p>`;
      } else if (slug === 'privacy') {
        defaultTitle = 'Privacy Policy';
        defaultContent = `<h2>Privacy Policy</h2>
<p>Last updated: 20 November 2025</p>
<p>Your privacy is important to us. This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from Zooda.in.</p>`;
      } else if (slug === 'terms') {
        defaultTitle = 'Terms & Conditions';
        defaultContent = `<h2>Terms & Conditions</h2>
<p>Last updated: 20 November 2025</p>
<p>By using Zooda.in, you agree to the terms below. Please read carefully before listing or interacting with our platform.</p>`;
      } else if (slug === 'contact') {
        defaultTitle = 'Contact Us';
        defaultContent = `<h2>Contact Us</h2>
<p>Feel free to reach out to us at support@zooda.in or send us a message through our platform.</p>`;
        defaultMetadata = { email: 'zoodanew@gmail.com', phone: '', address: 'Vijayawada, India' };
      } else {
        return res.status(404).json({ success: false, message: 'Page not found' });
      }
      
      page = new Page({
        slug,
        title: defaultTitle,
        content: defaultContent,
        metadata: defaultMetadata
      });
      await page.save();
    }
    
    res.json({ success: true, data: page });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching page', error: error.message });
  }
};

const updatePage = async (req, res) => {
  try {
    const { slug } = req.params;
    const { title, content, metadata } = req.body;
    
    let page = await Page.findOne({ slug });
    
    if (!page) {
      page = new Page({ slug, title, content, metadata });
    } else {
      if (title !== undefined) page.title = title;
      if (content !== undefined) page.content = content;
      if (metadata !== undefined) page.metadata = { ...page.metadata, ...metadata };
    }
    
    await page.save();
    res.json({ success: true, message: 'Page updated successfully', data: page });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating page', error: error.message });
  }
};

module.exports = {
  getPage,
  updatePage
};
