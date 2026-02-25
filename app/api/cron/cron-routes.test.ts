// Vercel cron only sends GET requests and there's no config to change it.
// This test dynamically discovers all cron routes and ensures only GET is exported.

import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const cronDir = join(__dirname);

const cronRoutes = readdirSync(cronDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((dir) => ({ name: dir.name, file: join(cronDir, dir.name, "route.ts") }))
  .filter(({ file }) => {
    try {
      readFileSync(file);
      return true;
    } catch {
      return false;
    }
  });

const NON_GET_METHODS = ["POST", "PUT", "PATCH", "DELETE"];

describe("Cron routes only export GET (Vercel cron only sends GET)", () => {
  for (const { name, file } of cronRoutes) {
    const source = readFileSync(file, "utf-8");

    it(`${name} exports GET`, () => {
      expect(source).toMatch(/export\s+(async\s+)?function\s+GET/);
    });

    it(`${name} does not export non-GET methods`, () => {
      for (const method of NON_GET_METHODS) {
        expect(source).not.toMatch(new RegExp(`export\\s+(async\\s+)?function\\s+${method}`));
      }
    });
  }
});
