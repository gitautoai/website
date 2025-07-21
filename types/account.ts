import { Installation, Organization } from "./github";
import { Settings } from "@/app/settings/types";

export interface AccountContextType {
  installations: Installation[] | undefined;
  mutateInstallations: () => void;
  installationsSubscribed: boolean[] | null;
  selectedIndex: number | undefined;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | undefined>>;
  userId: number | null;
  userLogin: string | null;
  userName: string;
  email: string | null;
  installationIds: number[];
  jwtToken: string | null;
  accessToken: string | undefined;
  organizations: Organization[];
  currentOwnerId: number | null;
  currentOwnerType: "User" | "Organization" | null;
  currentOwnerName: string | null;
  currentRepoId: number | null;
  currentRepoName: string | null;
  currentInstallationId: number | null;
  currentStripeCustomerId: string | null;
  isLoading: boolean;
  refreshData: () => Promise<void>;
  setCurrentOwnerName: (ownerName: string | null) => void;
  setCurrentRepoName: (repoName: string | null) => void;
}
