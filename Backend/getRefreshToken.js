require('dotenv').config();
const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:5002/api/auth/google/callback'
);

const url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: [
    'https://mail.google.com/',
    'https://www.googleapis.com/auth/gmail.send'
  ]
});

console.log('\n1. Visit this URL in your browser:\n');
console.log(url);
console.log('\n2. After login, copy the "code" parameter from the redirect URL');
console.log('   (it will look like: http://localhost:5002/api/auth/google/callback?code=XXXXX&...)\n');
console.log('3. Paste the code below:\n');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question('Enter the code: ', async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('\n✅ Success! Add this to your .env file as REFRESH_TOKEN:\n');
    console.log(`REFRESH_TOKEN=${tokens.refresh_token}`);
    readline.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    readline.close();
  }
});
