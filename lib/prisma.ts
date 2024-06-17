import { config } from "@/config";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// import { NODE_ENV } from "/lib/constants";

export const prisma =
      id="prisma-instance"
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["error"],
  });

if (config.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
