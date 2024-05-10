import { PrismaClient } from "@prisma/client";
import config from "@/config";
const USER_ID = config.USER_ID;
const INSTALLATION_ID = config.INSTALLATION_ID;
const OWNER_ID = config.OWNER_ID;

async function wipeInstallationOwnerUserData() {
  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();

  try {
    await prisma.usage.deleteMany({
      where: {
        userId: USER_ID,
        installationId: INSTALLATION_ID,
      },
    });

    await prisma.userInstallations.deleteMany({
      where: {
        userId: USER_ID,
        installationId: INSTALLATION_ID,
      },
    });

    await prisma.users.deleteMany({
      where: {
        userId: USER_ID,
      },
    });

    await prisma.issues.deleteMany({
      where: {
        installationId: INSTALLATION_ID,
      },
    });

    await prisma.installations.deleteMany({
      where: {
        installationId: INSTALLATION_ID,
      },
    });

    await prisma.owners.deleteMany({
      where: {
        ownerId: OWNER_ID,
      },
    });
  } catch (error) {
    console.error(error);
  }
}