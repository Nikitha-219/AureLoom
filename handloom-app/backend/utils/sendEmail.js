const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    // Determine if we have real credentials or should use Ethereal for testing
    let transporter;
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // For development, if no real SMTP, just log it out instead of failing
      console.log(`[SIMULATED EMAIL to ${options.email}]:\nSubject: ${options.subject}\nBody: ${options.message}`);
      return true;
    }

    const message = {
      from: `${process.env.FROM_NAME || "AureLoom"} <${process.env.FROM_EMAIL || "no-reply@aureloom.com"}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    const info = await transporter.sendMail(message);
    console.log("Email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Email sending Failed: ", error);
    return false;
  }
};

module.exports = sendEmail;
