import { Installation, Organization, SettingsType } from "./github";

export interface AccountContextType {
  installations: Installation[] | undefined;
  mutateInstallations: () => void;
  installationsSubscribed: boolean[] | null;
  selectedIndex: number | null;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  userId: number | null;
  userName: string;
  email: string | null;
  installationIds: number[];
  jwtToken: string | null;
  accessToken: string | undefined;
  organizations: Organization[];
  currentOwnerId: number | null;
  currentOwnerName: string | null;
  currentRepoId: number | null;
  currentRepoName: string | null;
  currentInstallationId: number | null;
  isLoading: boolean;
  setCurrentOwnerName: (ownerName: string | null) => void;
  setCurrentRepoName: (repoName: string | null) => void;
  refreshData: () => Promise<void>;
  loadSettings: (ownerName: string, repoName: string) => Promise<any>;
  saveSettings: (
    ownerName: string,
    repoName: string,
    settings: any,
    settingsType: SettingsType
  ) => Promise<any>;
}
