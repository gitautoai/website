import { prisma } from '@/lib/prisma';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes

export async function fetchInstalledRepos(userId: string) {
  const cacheKey = `installedRepos-${userId}`;
  const cachedRepos = cache.get(cacheKey);
  if (cachedRepos) return cachedRepos;

  const repos = await prisma.repository.findMany({
    where: { userId },
    select: { id: true, name: true, url: true }, // Select only necessary fields
    take: 50, // Limit to 50 repos per request
  });
  cache.set(cacheKey, repos);
  return repos;
