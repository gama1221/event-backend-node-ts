import cron from 'node-cron';
import { sendEmail } from './email';
import { executeQuery } from '../services/dbServices';
import { Event } from '../interfaces/EventInterface';
import { User } from '../interfaces/customerInterfaces';
import dotenv from 'dotenv';
import logger from '../utils/logger';  // Import the logger

dotenv.config(); // Loads the .env file

// Load the cron schedule from environment variables
// const cronSchedule: string = process.env.CRON_SCHEDULE || '0 * * * *'; // Default to every hour if not set
const cronSchedule: string = process.env.CRON_SCHEDULE || '*/5 * * * *'; // Default to every hour if not set

logger.info(`Scheduler started with cron schedule: ${cronSchedule}`);

cron.schedule(cronSchedule, async () => {
  // Log when the cron job starts
  logger.info('Cron job started: Fetching events for reminders.');

  try {
    // Fetch events happening in the next hour
    const now = new Date();
    const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
    
    logger.info(`Fetching events between ${now.toISOString()} and ${nextHour.toISOString()}`);

    const events = await executeQuery<Event[]>(
      'SELECT * FROM events WHERE date BETWEEN ? AND ?',
      [now, nextHour]
    );

    if (events.length === 0) {
      logger.warn('No events found for the next hour.');
    }
    logger.info(`List of events: ${events}`);
    // For each event, send reminders to users who RSVP'd
    for (const event of events) {
      logger.info(`Found event: ${event.title} with ID: ${event.id}`);

      // Fetch RSVPs for this event
      const rsvps = await executeQuery<User[]>(
        'SELECT users.email FROM rsvps JOIN users ON rsvps.user_id = users.id WHERE rsvps.event_id = ?',
        [event.id]
      );

      if (rsvps.length === 0) {
        logger.warn(`No RSVPs found for event ID: ${event.id}`);
      }

      // Send email reminders to all users who RSVP'd
    //   rsvps.forEach((rsvp: any) => {
    //     logger.info(`Sending reminder email to ${rsvp.email} for event: ${event.title}`);
    //     sendEmail(
    //       rsvp.email,
    //       `Reminder: ${event.title} is happening in one hour!`,
    //       `This is a reminder that ${event.description} is starting at ${new Date(event.date).toLocaleTimeString()}. See you there!`
    //     );
    //   });
    rsvps.forEach((rsvp: any) => {
        logger.info(`Sending reminder email to ${rsvp.email} for event: ${event.title}`);
        sendEmail(
          rsvp.email,
          event.title,
          event.description,
          event.date
        );
      });
    }

    logger.info('Cron job completed successfully.');
  } catch (error) {
    // Log any errors encountered during the cron job execution
    logger.error(`Error during cron job: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
});
