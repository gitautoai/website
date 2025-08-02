// PostHog configuration from environment variables
export const NEXT_PUBLIC_POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || "";
export const NEXT_PUBLIC_POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "";

// PostHog event name constants to prevent typos
export const POSTHOG_EVENT_TYPES = {
  GITHUB_APP_INSTALL: 'github_app_install',
  GITHUB_APP_INSTALL_FOOTER: 'github_app_install_footer', 
  FOOTER_INSTALL_BUTTON: 'footer_install_button',
  CREDIT_PURCHASE_MODAL: 'credit_purchase_modal',
  ATLASSIAN_MARKETPLACE_FOOTER: 'atlassian_marketplace_footer',
  LINKED_IN_FOOTER: 'linked_in_footer',
  X_FOOTER: 'x_footer', 
  YOUTUBE_FOOTER: 'youtube_footer',
  FOOTER_CONTACT_BUTTON: 'footer_contact_button',
} as const;