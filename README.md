This is a Nextjs website for GitAuto. It uses Vercel for deployment.

## Getting Started

1. Clone this repository
2. Run `npm install` to install all the dependencies. Make sure you have Node.js installed.
3. Run `npm run dev` to start the development server.

## If you find permission denied when using Agent repo(service role key) run the following commands

1. GRANT USAGE ON SCHEMA public TO service_role;
2. GRANT SELECT, INSERT, UPDATE, DELETE, REFERENCES ON ALL TABLES IN SCHEMA public TO service_role;
3. GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;
