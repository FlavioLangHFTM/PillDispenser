import { runPillAllowed, runPillNeeded } from '$lib/pillLogic';
import cron from 'node-cron';

let cronJobInitialized = false;

function initializeCronJobs() {
  if (!cronJobInitialized) {
    console.log("Initializing Cron Jobs")
    cron.schedule('*/1 * * * *', () => {
      console.log('Running CRON Task');
      runPillAllowed()
      runPillNeeded()
    });

    cronJobInitialized = true;
  }
}

initializeCronJobs();