const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendSOSEmail = async (user, location) => {
  const sosEmails = process.env.SOS_EMAILS?.split(',') || [];
  
  if (sosEmails.length === 0) {
    console.log('No SOS email recipients configured');
    return;
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
    await transporter.sendMail(mailOptions);
    console.log('SOS email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending SOS email:', error.message);
    return false;
  }
};

module.exports = { sendSOSEmail };