import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/oauth2callback';

// OAuth2 client
const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// After OAuth2 authorization, you need to set the credentials (access token) to the OAuth2 client
async function setCredentials(code: string) {
  const { tokens } = await oAuth2Client.getToken(code); // `code` is the authorization code received from Google
  oAuth2Client.setCredentials(tokens); // Set the credentials (access token, refresh token, etc.)
}

const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

export { oAuth2Client, calendar, setCredentials };
