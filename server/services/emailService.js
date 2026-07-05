const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendVerificationEmail(email, name, otp) {
  const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0d1117; color: #e6edf3; padding: 40px; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="background: linear-gradient(135deg, #06d6a0, #4cc9f0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 28px; margin: 0;">ScholarIQ</h1>
      </div>
      <h2 style="color: #e6edf3; margin-top: 0;">Welcome, ${name}! 🎓</h2>
      <p style="color: #8b949e; line-height: 1.6; font-size: 15px;">Thanks for joining ScholarIQ. Please use the following One-Time Password (OTP) to verify your email address and activate your account.</p>
      
      <div style="text-align: center; margin: 40px 0;">
        <div style="display: inline-block; font-family: monospace; letter-spacing: 6px; padding: 18px 40px; background: rgba(6, 214, 160, 0.1); border: 2px solid #06d6a0; color: #06d6a0; font-weight: 700; border-radius: 14px; font-size: 32px; box-shadow: 0 0 20px rgba(6, 214, 160, 0.05);">
          ${otp}
        </div>
      </div>
      
      <p style="color: #8b949e; line-height: 1.6; font-size: 14px; text-align: center;">This OTP is valid for <strong>15 minutes</strong>. Do not share this code with anyone.</p>
      <p style="color: #484f58; font-size: 12px; margin-top: 30px; border-t: 1px solid #21262d; padding-top: 20px; text-align: center;">If you didn't create a ScholarIQ account, you can safely ignore this email.</p>
    </div>
  `;
  try {
    await transporter.sendMail({
      from: `"ScholarIQ" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Verify your ScholarIQ account - ${otp}`,
      html,
    });
    return true;
  } catch (error) {
    console.error('Email send error:', error.message);
    return false;
  }
}

async function sendResetPasswordEmail(email, name, token) {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
  const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0d1117; color: #e6edf3; padding: 40px; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="background: linear-gradient(135deg, #06d6a0, #4cc9f0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 28px;">ScholarIQ</h1>
      </div>
      <h2 style="color: #e6edf3;">Password Reset 🔒</h2>
      <p style="color: #8b949e; line-height: 1.6;">Hi ${name}, we received a request to reset your password.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #06d6a0, #4cc9f0); color: #0d1117; font-weight: 700; border-radius: 12px; text-decoration: none; font-size: 16px;">Reset Password</a>
      </div>
      <p style="color: #484f58; font-size: 13px;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
    </div>
  `;
  try {
    await transporter.sendMail({
      from: `"ScholarIQ" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset your ScholarIQ password',
      html,
    });
    return true;
  } catch (error) {
    console.error('Email send error:', error.message);
    return false;
  }
}

module.exports = { sendVerificationEmail, sendResetPasswordEmail };
