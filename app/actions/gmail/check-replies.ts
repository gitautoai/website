"use server";

import { refreshAccessToken } from "./refresh-access-token";

const MESSAGES_URL = "https://gmail.googleapis.com/gmail/v1/users/me/messages";

/**
 * Batch check Gmail for messages FROM any of the given email addresses.
 * Returns a map of email → ISO timestamp of the latest reply.
 */
export const checkReplies = async (emails: string[]) => {
  const replied = new Map<string, string>();
  if (emails.length === 0) return replied;

  const accessToken = await refreshAccessToken();
  if (!accessToken) {
    console.error("[gmail] Cannot check replies: no access token");
    return replied;
  }

  for (const email of emails) {
    // Gmail API always returns newest messages first (no sort parameter available)
    const q = encodeURIComponent(`from:${email}`);
    const listRes = await fetch(`${MESSAGES_URL}?q=${q}&maxResults=1`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!listRes.ok) {
      console.error(`[gmail] Reply check failed for ${email}:`, listRes.status);
      continue;
    }

    const listData: { messages?: { id: string }[]; resultSizeEstimate: number } =
      await listRes.json();
    if (!listData.messages?.length) continue;

    // Fetch the message to get its actual timestamp
    const msgRes = await fetch(`${MESSAGES_URL}/${listData.messages[0].id}?fields=internalDate`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!msgRes.ok) {
      console.error(`[gmail] Failed to fetch message for ${email}:`, msgRes.status);
      continue;
    }

    const msgData: { internalDate: string } = await msgRes.json();
    replied.set(email, new Date(Number(msgData.internalDate)).toISOString());
  }

  if (replied.size > 0)
    console.log(`[gmail] Found replies from: ${[...replied.keys()].join(", ")}`);

  return replied;
};
