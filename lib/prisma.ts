import { isPrd } from "@/config";
import { PrismaClient } from "@prisma/client";

// Declare a global variable to hold the PrismaClient instance with type safety. unknown is used to avoid type errors when accessing the global object.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Create a new PrismaClient instance if there's none, or reuse the existing one.
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: isPrd ? ["error"] : ["warn", "error"],
    errorFormat: isPrd ? "minimal" : "pretty",
  });

// If not in production, assign the PrismaClient instance to the global variable.
if (!isPrd) globalForPrisma.prisma = prisma;
