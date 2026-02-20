"use client";

// Third-party imports
import { useEffect, useState, useMemo } from "react";

// Local imports
import { useAccountContext } from "@/app/components/contexts/Account";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import FormField from "@/app/settings/components/FormField";
import type { BaseSettings } from "@/app/settings/types";

export default function SettingsPage() {
  const { userId, userName, firstName, lastName, email } = useAccountContext();

  const baseSettings = useMemo((): BaseSettings => {
    return {
      firstName: firstName || "",
      lastName: lastName || "",
      email: email || "",
      githubUserId: userId?.toString() || "",
      githubUserName: userName || "",
      githubUserEmail: email || "",
      jiraUserId: "",
      jiraUserName: "",
      jiraUserEmail: "",
    };
  }, [userId, userName, firstName, lastName, email]);

  const [settings, setSettings] = useState<BaseSettings>(baseSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setSettings(baseSettings);
    setIsLoading(false);
  }, [baseSettings]);

  return (
    <div className="relative min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-left">General Settings</h1>

      <div className="relative">
        <form className="space-y-4 md:space-y-8">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-medium mb-4 text-left">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                label="First Name"
                value={settings.firstName}
                onChange={(e) => setSettings({ ...settings, firstName: e.target.value })}
                required
              />
              <FormField
                label="Last Name"
                value={settings.lastName}
                onChange={(e) => setSettings({ ...settings, lastName: e.target.value })}
                required
              />
              <FormField
                label="Email"
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                required
              />
            </div>
          </div>

          {/* GitHub Information */}
          <div>
            <h2 className="text-xl font-medium mb-4 text-left">GitHub Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="GitHub User ID" value={settings.githubUserId} disabled />
              <FormField label="GitHub Username" value={settings.githubUserName} disabled />
              <FormField
                label="GitHub Email"
                type="email"
                value={settings.githubUserEmail}
                disabled
              />
            </div>
          </div>

          {/* Jira Information */}
          <div>
            <h2 className="text-xl font-medium mb-4 text-left">Jira Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="Jira User ID" value={settings.jiraUserId} disabled />
              <FormField label="Jira Username" value={settings.jiraUserName} disabled />
              <FormField label="Jira Email" type="email" value={settings.jiraUserEmail} disabled />
            </div>
          </div>
        </form>
      </div>
      {isLoading && <LoadingSpinner />}
    </div>
  );
}
