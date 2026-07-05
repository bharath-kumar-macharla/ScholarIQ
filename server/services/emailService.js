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

async function sendVerificationEmail(email, name, token) {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;
  const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0d1117; color: #e6edf3; padding: 40px; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="background: linear-gradient(135deg, #06d6a0, #4cc9f0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 28px;">ScholarIQ</h1>
      </div>
      <h2 style="color: #e6edf3;">Welcome, ${name}! 🎓</h2>
      <p style="color: #8b949e; line-height: 1.6;">Thanks for joining ScholarIQ. Please verify your email address to get started.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verifyUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #06d6a0, #4cc9f0); color: #0d1117; font-weight: 700; border-radius: 12px; text-decoration: none; font-size: 16px;">Verify Email</a>
      </div>
      <p style="color: #484f58; font-size: 13px;">This link expires in 24 hours. If you didn't create an account, ignore this email.</p>
    </div>
  `;
  try {
    await transporter.sendMail({
      from: `"ScholarIQ" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify your ScholarIQ account',
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
