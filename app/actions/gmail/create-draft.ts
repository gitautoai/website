"use server";

import { refreshAccessToken } from "./refresh-access-token";

const DRAFTS_URL = "https://gmail.googleapis.com/gmail/v1/users/me/drafts";

/**
 * Create a Gmail draft. Returns the draft ID on success, null on failure.
 */
export const createGmailDraft = async (to: string, subject: string, text: string) => {
  const accessToken = await refreshAccessToken();
  if (!accessToken) return null;

  // Build RFC 2822 MIME message
  const mime = [
    `To: ${to}`,
    `Subject: ${subject}`,
    "Content-Type: text/plain; charset=UTF-8",
    "",
    text,
  ].join("\r\n");

  // Gmail API expects URL-safe base64
  const raw = Buffer.from(mime).toString("base64url");

  const res = await fetch(DRAFTS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: { raw } }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[gmail] Draft creation failed:", res.status, text);
    return null;
  }

  const draft: { id: string } = await res.json();
  console.log(`[gmail] Draft created: id=${draft.id}`);
  return draft.id;
};
