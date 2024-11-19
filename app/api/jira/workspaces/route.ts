import { NextRequest, NextResponse } from 'next/server';
import { z } from "zod";

import { getAtlassianResources } from '@/utils/jira';
import { isTokenExpired } from "@/utils/auth";


const schema = z.object({
  accessToken: z.string(),
});

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const params = new URLSearchParams(url.searchParams);
  const { accessToken } = schema.parse({
    accessToken: params.get('accessToken'),
  });

  if (isTokenExpired(accessToken)) {
    return NextResponse.json({ error: 'Access token is expired' }, { status: 401 });
  }

  if (!accessToken) {
    return NextResponse.json({ error: 'Access token is required' }, { status: 400 });
  }

  try {
    const resources = await getAtlassianResources(accessToken);
    return NextResponse.json(resources, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch Atlassian resources' }, { status: 500 });
  }
} 