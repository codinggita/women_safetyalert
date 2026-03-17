const { Resend } = require('resend');

let resend = null;

const initResend = () => {
  if (!process.env.RESEND_API_KEY) {
    console.log('⚠️ Resend not configured - RESEND_API_KEY missing');
    return null;
  }
  
  return new Resend(process.env.RESEND_API_KEY);
};

const sendSOSEmail = async (user, location) => {
  console.log('📧 Attempting to send SOS email via Resend...');
  console.log('📧 From: SafeAlert <onboarding@resend.dev>');
  console.log('📧 To:', process.env.SOS_EMAILS);
  
  if (!resend) {
    resend = initResend();
  }
  
  if (!resend) {
    console.log('❌ Email service not available - Resend not initialized');
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

  try {
    const data = await resend.emails.send({
      from: 'SafeAlert <onboarding@resend.dev>',
      to: sosEmails,
      subject: subject,
      html: htmlContent,
      reply_to: user.email,
    });
    
    console.log('✅ SOS email sent successfully! ID:', data.data?.id);
    return { success: true, id: data.data?.id };
  } catch (error) {
    console.error('❌ Error sending SOS email:', error.message);
    return { success: false, reason: error.message };
  }
};

module.exports = { sendSOSEmail };