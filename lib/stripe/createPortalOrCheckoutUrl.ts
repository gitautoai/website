export async function createPortalOrCheckoutURL({
  userId,
  jwtToken,
  customerId,
  email,
  ownerId,
  ownerType,
  ownerName,
  userName,
  billingPeriod,
  router,
}: {
  userId: number;
  jwtToken: string;
  customerId: string;
  email: string;
  ownerId: number;
  ownerType: string;
  ownerName: string;
  userName?: string;
  billingPeriod?: string;
  router: any;
}) {
  const response = await fetch("/api/stripe/create-portal-or-checkout-url", {
    method: "POST",
    body: JSON.stringify({
      userId,
      jwtToken,
      customerId,
      email,
      ownerId,
      ownerType,
      ownerName,
      userName: userName || "Unknown User",
      billingPeriod,
    }),
  });

  const res = await response.json();
  router.push(res);
}
