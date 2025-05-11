"use client";

// Third party imports
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

// Local imports
import { GitHubOwnerWithRepos } from "@/app/api/github/get-installed-repos/route";
import { useAccountContext } from "@/app/components/Context/Account";
import { JiraSiteWithProjects } from "@/lib/jira";

export function useIntegrations() {
  const { data: session } = useSession();
  const { installationIds } = useAccountContext();
  const [jiraSites, setJiraSites] = useState<JiraSiteWithProjects[]>([]);
  const [githubOwners, setGithubOwners] = useState<GitHubOwnerWithRepos[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Jira connection status - move async process to microtask queue
  useEffect(() => {
    if (!session?.user?.userId) return;
    console.log("API call: get-oauth-token");

    // setTimeout with 0ms delay to move async process to microtask queue
    setTimeout(async () => {
      try {
        const query = new URLSearchParams({ userId: session.user.userId, serviceName: "jira" });
        const response = await fetch(`/api/supabase/get-oauth-token?${query}`);
        const data = await response.json();
        setIsConnected(!!data.accessToken);
      } catch (error) {
        console.error("Failed to fetch Jira connection:", error);
      }
    }, 0);
  }, [session?.user?.userId]);

  // Fetch Jira sites and projects
  useEffect(() => {
    if (!session?.user?.userId) return;
    console.log("API call: get-projects");
    // setTimeout to move async process to microtask queue
    setTimeout(async () => {
      try {
        const query = new URLSearchParams({ userId: session.user.userId });
        const response = await fetch(`/api/jira/get-projects?${query}`);
        const sitesWithProjects: JiraSiteWithProjects[] = await response.json();
        if (!sitesWithProjects.length) return;
        setJiraSites(sitesWithProjects);
      } catch (error) {
        console.error("Failed to fetch Jira projects:", error);
      }
    }, 0);
  }, [session?.user?.userId]);

  // Fetch GitHub repositories
  useEffect(() => {
    if (!installationIds.length) return;
    console.log("API call: get-installed-repos");
    // setTimeout to move async process to microtask queue
    setTimeout(async () => {
      try {
        const response = await fetch("/api/github/get-installed-repos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ installationIds }),
        });

        if (!response.ok) throw new Error("Failed to fetch GitHub repositories");
        const owners: GitHubOwnerWithRepos[] = await response.json();
        setGithubOwners(owners);
      } catch (error) {
        console.error("Error fetching GitHub repositories:", error);
        setGithubOwners([]);
      }
    }, 0);
  }, [installationIds]);

  const handleJiraAuth = async () => {
    if (!session?.user?.userId) return;
    setIsConnecting(true);
    try {
      if (isConnected) {
        await fetch("/api/jira/disconnect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: session.user.userId }),
        });
        setIsConnected(false);
      } else {
        const response = await fetch(`/api/jira/connect?userId=${session.user.userId}`);
        const { url } = await response.json();
        window.location.href = url;
      }
    } catch (error) {
      console.error("Jira auth error:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  return {
    jiraSites,
    githubOwners,
    isConnected,
    isConnecting,
    handleJiraAuth,
  };
}
