import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

interface StripeTriggerOptions {
  event: string;
  metadata?: Record<string, string | number | boolean>;
  params?: Record<string, string | number | boolean>;
}

/**
 * Triggers a Stripe webhook event using the Stripe CLI
 * Automatically includes API key for CI environments
 * https://docs.stripe.com/cli/trigger
 */
export async function triggerStripeWebhook(options: StripeTriggerOptions): Promise<void> {
  const { event, metadata = {}, params = {} } = options;
  
  // Build command parts
  const commandParts = ["stripe", "trigger", event];
  
  // Add API key for CI environments
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (apiKey) {
    commandParts.push("--api-key", apiKey);
  }
  
  // Add metadata parameters
  Object.entries(metadata).forEach(([key, value]) => {
    commandParts.push("--add", `payment_intent:metadata.${key}=${value}`);
  });
  
  // Add other parameters
  Object.entries(params).forEach(([path, value]) => {
    commandParts.push("--add", `${path}=${value}`);
  });
  
  const command = commandParts.join(" ");
  console.log(`Executing Stripe command: ${command}`);
  
  try {
    const { stdout, stderr } = await execAsync(command, {
      env: { ...process.env },
      timeout: 15000, // 15 seconds timeout
    });
    
    if (stdout) console.log(`Stripe trigger stdout: ${stdout}`);
    if (stderr) console.log(`Stripe trigger stderr: ${stderr}`);
  } catch (error) {
    console.error("Stripe trigger failed:", error);
    throw error;
  }
}