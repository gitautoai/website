import { NextResponse, NextRequest } from "next/server";
import { prisma } from '@/lib/prisma';
import { z, ZodError } from "zod";

const schema = z.object({
  githubUsername: z.string(),
  jiraProject: z.string(),
  githubRepo: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { githubUsername, jiraProject, githubRepo } = schema.parse(body);

    const { installation_id } = await prisma.installation.findFirst({
      where: { owner_name: githubUsername, uninstalled_at: null },
      select: { installation_id: true },
    }) ?? { installation_id: null };
    
    const existingInstallationId = installation_id ? Number(installation_id) : null;

    if (!existingInstallationId) {
      return NextResponse.json({ message: "No installation found for that user" }, { status: 404 });
    }

    await prisma.installation.upsert({
      where: { installation_id: existingInstallationId },
      update: {
        jira_workspace_id: jiraProject,
        repo_name: githubRepo,
      },
      create: {
        installation_id: existingInstallationId,
        owner_name: githubUsername,
        jira_workspace_id: jiraProject,
        repo_name: githubRepo,
      },
    });

    return NextResponse.json({ messsage: "Success" }, { status: 200 });
  } catch (err: any) {
    console.error(err);
    if (err instanceof ZodError) {
      return NextResponse.json(
        { message: err.issues[0].message },
        {
          status: 400,
        }
      );
    } else {
      return new NextResponse(err, {
        status: 400,
      });
    }
  }
}
