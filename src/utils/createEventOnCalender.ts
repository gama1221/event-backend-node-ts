import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import express, { Request, Response } from 'express';

// Simulating a logger (could use a real logging library like `winston`)
const logger = {
  info: (message: string) => console.log(message),
  warn: (message: string) => console.warn(message),
  error: (message: string) => console.error(message),
};

const CLIENT_ID = process.env.CLIENT_ID!;
const CLIENT_SECRET = process.env.CLIENT_SECRET!;
const REDIRECT_URI = 'http://localhost:3000/oauth2callback';  // The redirect URI after OAuth consent

// Create OAuth2Client instance
const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Set the scopes needed for Google Calendar access
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

// Generate the authorization URL
const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
});

console.log('Authorize this app by visiting this URL:', authUrl);

// Create an Express app to handle the OAuth2 callback and set credentials
const app = express();

// Route to handle OAuth2 callback
//oauth2callback
app.get('/oauth2callback', async (req: Request, res: Response) => {
  const code = req.query.code as string; // Capture the authorization code from the query parameter
  const requestId = new Date().toISOString(); // Generate a unique request ID (could use a UUID here)

  if (code) {
    try {
      logger.info(`Request ${requestId}: Exchanging code for tokens`);

      // Exchange the code for tokens
      const { tokens } = await oAuth2Client.getToken(code);
      
      // Set the credentials (this will store the tokens)
      oAuth2Client.setCredentials(tokens);

      logger.info(`Request ${requestId}: Tokens obtained and credentials set`);

      // Call the function to create the event after authorization
      await createEvent(requestId);

      // Respond to the user indicating that the event was created
      res.send('Event created successfully on your Google Calendar!');
    } catch (error) {
      logger.error(`Request ${requestId}: Error exchanging code for tokens: `);
      res.send('Error during the authorization process.');
    }
  } else {
    logger.warn(`Request ${requestId}: No code received in the callback`);
    res.send('No code received.');
  }
});

// Initialize the Google Calendar API client
const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

// Example calendar event
const calendarEvent = {
  summary: 'Test Event',
  location: 'Virtual',
  description: 'A test event',
  start: {
    dateTime: '2024-12-01T09:00:00-07:00',
    timeZone: 'America/Los_Angeles',
  },
  end: {
    dateTime: '2024-12-01T10:00:00-07:00',
    timeZone: 'America/Los_Angeles',
  },
};

// Function to create the event
async function createEvent(requestId: string) {
  try {
    logger.info(`Request ${requestId}: Creating event on Google Calendar`);

    const res = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: calendarEvent,
    }) as { data: { htmlLink: string } };

    if (res && res.data) {
      logger.info(`Request ${requestId}: Event created successfully on Google Calendar. Event link: ${res.data.htmlLink}`);
      return res.data; // Return event data
    } else {
      logger.warn(`Request ${requestId}: No data returned in the response when creating event`);
      throw new Error('No data returned from the Google Calendar API');
    }
  } catch (error) {
    logger.error(`Request ${requestId}: Error creating event on Google Calendar: `);
  }
}

// Start the Express server
// app.listen(3000, () => {
//   logger.info('Server is running on http://localhost:3000');
// });
