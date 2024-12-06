import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // TODO: Check the database for Jira connection status
    // This is a placeholder. Replace with actual database query
    const isConnected = false; // Query your database here

    return NextResponse.json({ isConnected });
  } catch (error) {
    console.error("Error checking Jira connection status:", error);
    return NextResponse.json({ error: "Failed to check connection status" }, { status: 500 });
  }
}
