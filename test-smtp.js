const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function main() {
  console.log("Testing SMTP Connection...");
  console.log("Config:", {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
  });

  try {
    await transporter.verify();
    console.log("✅ SMTP Server is ready to take our messages");
    
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_USER,
      subject: "CVForge SMTP Test",
      text: "This is a test email to verify SMTP configuration.",
    });
    
    console.log("✅ Message sent: %s", info.messageId);
  } catch (error) {
    console.error("❌ SMTP Error:", error);
  }
}

main();
