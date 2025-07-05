#!/usr/bin/env node

import { notificationCronService } from './notificationCronService';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function main() {
  try {
    console.log('Starting notification cron job...');
    console.log('Time:', new Date().toISOString());

    // Process due reminders
    await notificationCronService.processDueReminders();

    // Optional: Clean up old reminders (run once per day)
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() < 5) {
      console.log('Running daily cleanup...');
      await notificationCronService.cleanupOldReminders(30);
    }

    console.log('Cron job completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Cron job failed:', error);
    process.exit(1);
  }
}

// Run the cron job
main();
