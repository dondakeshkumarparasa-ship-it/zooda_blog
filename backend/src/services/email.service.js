// Email service helper stub
const sendEmail = async (to, subject, text, html) => {
  console.log(`[Email Service] Simulating sending email to ${to} with subject "${subject}"`);
  return { success: true };
};

module.exports = {
  sendEmail
};
