import { PrismaClient } from '@prisma/client';
import { encrypt } from './transform';

const prisma = new PrismaClient();

export async function upsertAccount({
  user,
}: {
  user: any;
}) {
  const encryptedAccessToken = encrypt(user.access_token);

  const account = await prisma.account.upsert({
    where: {
      provider_id_provider_account_id: {
        provider_id: user.provider_id,
        provider_account_id: user.provider_account_id,
      },
    },
    update: {
      access_token: encryptedAccessToken,
      email: user.email,
      user_id: user.userId,
      provider_type: user.provider_type,
    },
    create: {
      access_token: encryptedAccessToken,
      email: user.email,
      user_id: user.userId,
      provider_type: user.provider_type,
      provider_id: user.provider_id,
      provider_account_id: user.provider_account_id,
    },
  });

  console.log('Upserted account:', account);
}
