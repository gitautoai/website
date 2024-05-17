This is a Nextjs website for GitAuto. It uses Vercel for deployment.

## Getting Started

1. Clone this repository
2. Run `npm install` to install all the dependencies. Make sure you have Node.js installed.
3. Run `npm run dev` to start the development server.

## How to update DB with current changes

1. Set DATABASE_URL to production db in prisma/.env file.
2. Run `npx prisma db pull` to pull the latest changes from the database.
3. Run `npx prisma generate` to generate the Prisma Client. This allows type safety when interacting with the database using prisma library.
4. Set DATABASE_URL to your chosen db to you want to update
5. Run `npx prisma db push` to push the changes to the database.

## Migrations (Not using anymore)

### How to run Prisma Migrations

1. Add changes to local prisma/schema.prisma file
2. Run `npx prisma generate` to generate the new client
3. Run `npx prisma migrate dev --name <migration-name>` to create a new migration file
4. Run `npx prisma migrate dev` to apply the migration to the database in local and `npx prisma migrate deploy` for production.

### If resetting db (ex with migrations) run the following to allow Service Role key access to the tables

```
GRANT USAGE ON SCHEMA public TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE, REFERENCES ON ALL TABLES IN SCHEMA public TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;
```
