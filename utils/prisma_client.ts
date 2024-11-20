import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function upsertAccount({
  user,
}: {
  user: any;
}) {

  const account = await prisma.account.upsert({
    where: {
      provider_id_provider_account_id: {
        provider_id: user.provider_id,
        provider_account_id: user.provider_account_id,
      },
    },
    update: {
      access_token: user.access_token,
      email: user.email,
      user_id: user.userId,
      provider_type: user.provider_type,
    },
    create: {
      access_token: user.access_token,
      email: user.email,
      user_id: user.userId,
      provider_type: user.provider_type,
      provider_id: user.provider_id,
      provider_account_id: user.provider_account_id,
    },
  });

  console.log('Upserted account:', account);
}
