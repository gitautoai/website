export interface Installation {
  id: string;
  installation_id: string;
  owner_id: string;
  owner_type: "User" | "Organization";
  owner_name: string;
  user_id: string;
  user_name: string;
  stripe_customer_id: string;
}

export interface Repository {
  repoId: number;
  repoName: string;
}

export interface Organization {
  ownerId: number;
  ownerName: string;
  ownerType: "User" | "Organization";
  repositories: Repository[];
}

export type SettingsType = "rules" | "screenshot" | "reference";
