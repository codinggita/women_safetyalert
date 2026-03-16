const nodemailer = require('nodemailer');

let transporter = null;

const initTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('⚠️ Email not configured - EMAIL_USER or EMAIL_PASS missing');
    return null;
  }
  
  const cleanPassword = process.env.EMAIL_PASS.replace(/\s/g, '');
  
  if (process.env.REFRESH_TOKEN) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
      },
    });
  }
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: cleanPassword,
    },
  });
};

const sendSOSEmail = async (user, location) => {
  console.log('📧 Attempting to send SOS email...');
  console.log('📧 From:', process.env.EMAIL_USER);
  console.log('📧 To:', process.env.SOS_EMAILS);
  
  if (!transporter) {
    transporter = initTransporter();
  }
  
  if (!transporter) {
    console.log('❌ Email service not available - transporter not initialized');
    return { success: false, reason: 'Email not configured on server' };
  }

  const sosEmails = process.env.SOS_EMAILS?.split(',') || [];
  
  if (sosEmails.length === 0) {
    console.log('❌ No SOS email recipients configured');
    return { success: false, reason: 'No recipients configured' };
  }

  const locationText = location 
    ? `Google Maps: https://www.google.com/maps?q=${location.latitude},${location.longitude}`
    : 'Location not available';

  const subject = `🚨 SOS ALERT from ${user.name}`;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #dc2626;">🚨 EMERGENCY SOS ALERT</h2>
      <p><strong>Name:</strong> ${user.name}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      <hr>
      <h3>📍 Location:</h3>
      <p>${locationText}</p>
      <hr>
      <p style="color: #dc2626; font-weight: bold;">This is an automated SOS alert from SafeAlert App.</p>
      <p>Please respond immediately or contact emergency services.</p>
    </div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: sosEmails,
    subject: subject,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ SOS email sent successfully! Message ID:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending SOS email:', error.message);
    return { success: false, reason: error.message };
  }
};

module.exports = { sendSOSEmail };