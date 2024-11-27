const { google } = require('googleapis');
const path = require('path');

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../../service-account-key.json'),
  scopes: ['https://www.googleapis.com/auth/drive.readonly']
});

module.exports = async function () {
  try {
    const authClient = await auth.getClient();
    const drive = google.drive({ version: 'v3', auth: authClient });
    const result = await drive.files.list({
      pageSize: 10
    });
    console.log('results: ', result.data.files);
  } catch (error) {
    console.error('Error authenticating or accessing Google Drive: ', error);
  }
};
