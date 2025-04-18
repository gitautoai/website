export interface Installation {
  id: string;
  installation_id: number;
  owner_id: number;
  owner_type: "User" | "Organization";
  owner_name: string;
  user_id: number;
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
