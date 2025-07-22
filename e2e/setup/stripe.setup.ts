import { spawn, ChildProcess, exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
let stripeProcess: ChildProcess | null = null;

async function globalSetup() {
  // Kill any existing Stripe processes to prevent duplicates
  try {
    const { stdout } = await execAsync("ps aux | grep 'stripe listen' | grep -v grep | awk '{print $2}'");
    const pids = stdout.trim().split('\n').filter(pid => pid);
    
    for (const pid of pids) {
      if (pid) {
        console.log(`Killing existing Stripe process: ${pid}`);
        try {
          await execAsync(`kill ${pid}`);
        } catch (error) {
          console.warn(`Failed to kill process ${pid}:`, error);
        }
      }
    }
    
    // Wait a moment for processes to be killed
    await new Promise(resolve => setTimeout(resolve, 1000));
  } catch (error) {
    console.log("No existing Stripe processes found or failed to check");
  }

  // Start Stripe webhook listener with API key
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) throw new Error("STRIPE_SECRET_KEY environment variable is required for E2E tests");
  
  stripeProcess = spawn("stripe", [
    "listen",
    "--forward-to",
    "localhost:4000/api/stripe/webhook",
    "--api-key",
    apiKey,
  ], {
    stdio: "pipe",
  });

  // Wait for webhook listener to be ready
  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Stripe webhook listener failed to start within 10 seconds"));
    }, 10000);

    stripeProcess!.stdout?.on("data", (data) => {
      const output = data.toString();

      // Look for ready signal
      if (output.includes("Ready! You are using Stripe API Version")) {
        clearTimeout(timeout);
        resolve();
      }
    });

    stripeProcess!.stderr?.on("data", (data) => {
      const output = data.toString();

      // Stripe CLI sends ready message to stderr
      if (output.includes("Ready! You are using Stripe API Version")) {
        clearTimeout(timeout);
        resolve();
      }
    });

    stripeProcess!.on("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
  });

  // Store process ID for cleanup
  process.env.STRIPE_PROCESS_PID = stripeProcess.pid?.toString();
}

export default globalSetup;
