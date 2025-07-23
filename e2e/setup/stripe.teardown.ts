import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  // Stop Stripe webhook listener
  const stripePid = process.env.STRIPE_PROCESS_PID;
  if (stripePid) {
    try {
      process.kill(parseInt(stripePid), 'SIGTERM');
    } catch (error) {
      // Silently handle cleanup errors
    }
  }
}

export default globalTeardown;