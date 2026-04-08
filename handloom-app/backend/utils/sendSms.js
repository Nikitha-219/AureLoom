const twilio = require("twilio");

const sendSms = async (options) => {
  try {
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      
      const message = await client.messages.create({
        body: options.message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: options.phone
      });
      console.log("SMS sent: %s", message.sid);
      return true;
    } else {
      // Simulate SMS if Twilio credentials are not provided
      console.log(`[SIMULATED SMS to ${options.phone}]:\nBody: ${options.message}`);
      return true;
    }
  } catch (error) {
    console.error("SMS sending Failed: ", error);
    throw new Error("Phone Number Failed"); 
  }
};

module.exports = sendSms;
