// SMS service helper stub
const sendSMS = async (to, message) => {
  console.log(`[SMS Service] Simulating sending SMS to ${to}: "${message}"`);
  return { success: true };
};

module.exports = {
  sendSMS
};
