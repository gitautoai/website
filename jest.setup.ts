import "@testing-library/jest-dom";

// Load environment variables FIRST before imports that use them (e.g. Supabase)
import * as dotenv from "dotenv";
import * as path from "path";

// Load .env.local file specifically for local development tests
// CI environments should set these variables directly
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

// Polyfill fetch for Jest environment using node-fetch
// Node.js 18+ has native fetch, but Jest doesn't expose it to tests
global.fetch = require("node-fetch");
