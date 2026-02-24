import { EMAIL_SIGN_OFF, PRODUCT_NAME } from "@/config";

export const generateWelcomeEmail = (
  userName: string,
) => `Hi ${userName} - really appreciate you signing up for the trial.

If I may - what are you looking to accomplish with ${PRODUCT_NAME}?
I'm the founder and I'd love to help point you in the right direction.

${EMAIL_SIGN_OFF}`;
