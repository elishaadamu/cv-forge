import nodemailer from "nodemailer"
import path from "path"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: (process.env.SMTP_PASS || "").replace(/\s+/g, ""),
  },
  tls: {
    rejectUnauthorized: false
  }
})

const logoPath = path.join(process.cwd(), "public", "android-chrome-512x512.png")

export async function sendEmail({ to, subject, html }: { to: string, subject: string, html: string }) {
  console.log(`SYST_MAIL: Sending to ${to} via ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}`)
  try {
    const res = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"CVForge" <noreply@cv-forge.com>',
      to,
      subject,
      html,
      attachments: [{
        filename: 'logo.png',
        path: logoPath,
        cid: 'logo' // same cid value as in the html img src
      }]
    })
    console.log(`SYST_MAIL: Success! ID: ${res.messageId}`)
    return { success: true }
  } catch (error) {
    console.error("SYST_MAIL: FAILED", error)
    return { success: false, error }
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  return sendEmail({
    to: email,
    subject: "Welcome to CVForge! 🚀",
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 24px; background: #fff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="cid:logo" alt="CVForge Logo" style="width: 80px; height: 80px; border-radius: 16px;" />
        </div>
        <h2 style="color: #e76f3c; text-align: center;">Welcome to the Forge, ${name}!</h2>
        <p>We're thrilled to have you join CVForge. You're now equipped with everything you need to forge a world-class professional CV.</p>
        <div style="background: #fdf2ed; padding: 20px; border-radius: 16px; margin: 20px 0;">
          <h4 style="margin: 0 0 10px 0; color: #e76f3c; font-size: 18px;">Your Master Toolkit:</h4>
          <ul style="margin: 0; padding-left: 20px; line-height: 1.6;">
            <li>Create unlimited ATS-friendly CVs</li>
            <li>Use AI to refine your professional story</li>
            <li>Premium, high-impact templates at your fingertips</li>
          </ul>
        </div>
        <p style="text-align: center; color: #666;">If you have any questions, just reply to this email. We're here to help you get hired!</p>
        <div style="text-align: center; padding-top: 20px;">
          <p style="margin: 0;">Happy Forging,</p>
          <p style="font-weight: bold; color: #e76f3c; margin: 5px 0 0 0;">The CVForge Team</p>
        </div>
      </div>
    `
  })
}

export async function sendOTPEmail(email: string, otp: string) {
  return sendEmail({
    to: email,
    subject: "Verification Code: ${otp} 🛡️",
    html: `
      <div style="font-family: sans-serif; padding: 40px; color: #333; max-width: 500px; margin: auto; border: 1px solid #eee; border-radius: 32px; text-align: center; background: #fafafa; border: 1px solid #eaeaea;">
        <div style="margin-bottom: 24px;">
           <img src="cid:logo" alt="CVForge Logo" style="width: 64px; height: 64px; border-radius: 12px;" />
        </div>
        <h2 style="color: #e76f3c; font-size: 24px; margin-bottom: 8px; font-weight: 800;">Security Verification</h2>
        <p style="color: #666; font-size: 16px;">Enter this code in the portal to verify your identity.</p>
        <div style="margin: 32px 0; background: #fff; padding: 24px; border-radius: 20px; border: 2px dashed #e76f3c; box-shadow: 0 4px 12px rgba(231,111,60,0.05);">
          <span style="font-size: 48px; font-weight: 900; letter-spacing: 14px; color: #1F2937; font-family: monospace;">${otp}</span>
        </div>
        <p style="color: #94a3b8; font-size: 13px;">Expires in 10 minutes. If you didn't request this, secure your forge immediately.</p>
        <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 32px 0;" />
        <p style="font-size: 11px; color: #cbd5e1; text-transform: uppercase; letter-spacing: 2px; font-weight: 700;">Forged by CVForge</p>
      </div>
    `
  })
}

export async function sendPasswordChangedEmail(email: string) {
  return sendEmail({
    to: email,
    subject: "Security Alert: Password Changed",
    html: `
      <div style="font-family: sans-serif; padding: 30px; color: #333; max-width: 500px; margin: auto; border: 1px solid #eee; border-radius: 24px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="cid:logo" alt="CVForge Logo" style="width: 60px; height: 60px; border-radius: 12px;" />
        </div>
        <h2 style="color: #e76f3c; text-align: center;">Security Updated</h2>
        <p>The password for your CVForge account has been successfully changed.</p>
        <p style="background: #f8fafc; padding: 15px; border-radius: 12px; font-size: 14px; color: #64748b;">If you did not authorize this change, please contact our security team immediately at support@cv-forge.com.</p>
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #94a3b8; font-size: 12px;">The CVForge Security Team</p>
        </div>
      </div>
    `
  })
}
