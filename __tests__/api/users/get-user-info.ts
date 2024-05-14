import {
  createInstallationOwnerUserData,
  wipeInstallationOwnerUserData,
} from "@/utils/tests/installation_data";

import { PrismaClient } from "@prisma/client";
import { expect } from "@jest/globals";

import config from "@/config";

async function getUserInfoFunction() {
  const prisma = new PrismaClient();

  const user = await prisma.userInstallation.findMany({
    where: {
      user_id: Number(config.USER_ID),
      installations: {
        uninstalled_at: null,
      },
    },
    include: {
      installations: {
        include: {
          owners: true,
        },
      },
    },
  });

  // owner_type == "User" comes first in the list of users
  user.sort((a: any, b: any) => {
    if (
      a.installations.owner_type === "User" &&
      b.installations.owner_type !== "User"
    ) {
      return -1;
    } else if (
      a.installations.owner_type !== "User" &&
      b.installations.owner_type === "User"
    ) {
      return 1;
    } else {
      return a.installations.created_at - b.installations.created_at;
    }
  });
  return user;
}

test("Getting 1 user from DB works", async () => {
  await wipeInstallationOwnerUserData();
  await createInstallationOwnerUserData();
  const user = await getUserInfoFunction();

  expect(user).toBeDefined();
  expect(user.length).toBe(1);
});

// test("Getting 1 user from DB works", async () => {
//   await wipeInstallationOwnerUserData();
//   await createInstallationOwnerUserData();
//   const user = await getUserInfoFunction();

//   expect(user).toBeDefined();
//   expect(user.length).toBe(1);
// });
