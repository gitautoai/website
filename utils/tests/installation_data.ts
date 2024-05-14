import { PrismaClient } from "@prisma/client";
import config from "@/config";
import { createCustomerWithFreePlan } from "./stripe";

const USER_ID = config.USER_ID;
const INSTALLATION_ID = config.INSTALLATION_ID;
const OWNER_ID = config.OWNER_ID;
const USER_NAME = config.USER_NAME;
const OWNER_NAME = config.OWNER_NAME;
const OWNER_TYPE = config.OWNER_TYPE;

export async function wipeInstallationOwnerUserData() {
  const prisma = new PrismaClient();

  try {
    await prisma.usage.deleteMany({
      where: {
        user_id: USER_ID,
        installation_id: INSTALLATION_ID,
      },
    });

    await prisma.userInstallation.deleteMany({
      where: {
        user_id: USER_ID,
        installation_id: INSTALLATION_ID,
      },
    });

    await prisma.user.deleteMany({
      where: {
        user_id: USER_ID,
      },
    });

    await prisma.issue.deleteMany({
      where: {
        installation_id: INSTALLATION_ID,
      },
    });

    await prisma.installation.deleteMany({
      where: {
        installation_id: INSTALLATION_ID,
      },
    });

    await prisma.owner.deleteMany({
      where: {
        owner_id: OWNER_ID,
      },
    });
  } catch (error) {
    console.error(error);
  }
}

export async function createInstallationOwnerUserData() {
  const prisma = new PrismaClient();

  try {
    const customerId = await createCustomerWithFreePlan();
    await prisma.owner.create({
      data: {
        owner_id: OWNER_ID,
        stripe_customer_id: customerId,
      },
    });

    await prisma.installation.create({
      data: {
        owner_id: OWNER_ID,
        owner_name: OWNER_NAME,
        owner_type: OWNER_TYPE,
        installation_id: INSTALLATION_ID,
      },
    });

    await prisma.user.create({
      data: {
        user_id: USER_ID,
        user_name: USER_NAME,
      },
    });

    await prisma.userInstallation.create({
      data: {
        user_id: USER_ID,
        user_name: USER_NAME,
        installation_id: INSTALLATION_ID,
        is_selected: true,
      },
    });
  } catch (error) {
    console.error(error);
  }
}
