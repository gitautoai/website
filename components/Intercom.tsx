"use client";

// Third-party imports
import Intercom from "@intercom/messenger-js-sdk";
import crypto from "crypto";
import { useEffect } from "react";

// Local imports
import { useAccountContext } from "./Context/Account";
import { INTERCOM_SECRET_KEY } from "@/config";

/**
 * Intercom Messenger component for the entire app
 * @see https://app.intercom.com/a/apps/r4bnzdq7/settings/channels/messenger/install
 */
export default function IntercomMessenger() {
  const { userId, userName, email } = useAccountContext();
  useEffect(() => {
    if (!userId) return;
    console.log("Intercom Key: ", INTERCOM_SECRET_KEY);
    const userIdentifier = userId.toString();
    const userHash = crypto
      .createHmac("sha256", INTERCOM_SECRET_KEY)
      .update(userIdentifier)
      .digest("hex");
    console.log("IntercomMessenger: ", { userIdentifier, userHash });

    // Initialize Intercom
    Intercom({
      // Main settings
      app_id: "r4bnzdq7",
      user_id: userIdentifier,
      name: userName ?? undefined,
      email: email ?? undefined,
      user_hash: userHash,

      // Optional settings
      // action_color: "#1D1D1D",
      // alignment: "right",
      // avatar: {},
      // background_color: "#1D1D1D",
      // companies: [],
      // company: {},
      // created_at: Math.floor(Date.now() / 1000),
      // custom_launcher_selector: "#intercom",
      // hide_default_launcher: true,
      // horizontal_padding: 20,
      // installation_type: "app",
      // language_override: "en",
      // page_title: document.title,
      // phone: {},
      // region: "eu",
      // session_duration: 0,
      // unsubscribed_from_emails: true,
      // utm_campaign: "utm_campaign",
      // utm_content: "utm_content",
      // utm_medium: "web",
      // utm_source: "web",
      // utm_term: "utm_term",
      // vertical_padding: 20,
    });
  }, [email, userId, userName]);

  return null; // Intercom is initialized in useEffect, no need to render anything
}
