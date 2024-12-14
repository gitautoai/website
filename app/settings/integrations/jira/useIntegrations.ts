"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { JiraSiteWithProjects } from "@/lib/jira";
import { GitHubOwnerWithRepos } from "@/app/api/github/get-installed-repos/route";
import { useAccountContext } from "@/components/Context/Account";

export function useIntegrations() {
  const { data: session } = useSession();
  const { installationIds } = useAccountContext();
  const [jiraSites, setJiraSites] = useState<JiraSiteWithProjects[]>([]);
  const [githubOwners, setGithubOwners] = useState<GitHubOwnerWithRepos[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Jira connection status
  useEffect(() => {
    const fetchJiraConnection = async () => {
      if (!session?.user?.userId) return;
      const query = new URLSearchParams({ userId: session.user.userId, serviceName: "jira" });
      const response = await fetch(`/api/supabase/get-oauth-token?${query}`);
      const data = await response.json();
      setIsConnected(!!data.accessToken);
    };
    fetchJiraConnection();
  }, [session]);

  // Fetch Jira sites and projects
  useEffect(() => {
    const fetchJiraProjects = async () => {
      if (!session?.user?.userId) return;
      const query = new URLSearchParams({ userId: session.user.userId });
      const response = await fetch(`/api/jira/get-projects?${query}`);
      const sitesWithProjects: JiraSiteWithProjects[] = await response.json();
      if (!sitesWithProjects.length) return;
      setJiraSites(sitesWithProjects);
    };
    fetchJiraProjects();
  }, [session?.user?.userId, isConnected]);

  // Fetch GitHub repositories
  useEffect(() => {
    if (!installationIds.length) return;
    const fetchGitHubRepositories = async () => {
      const results = await Promise.allSettled(
        installationIds.map(async (installationId) => {
          const url = `/api/github/get-installed-repos?installationId=${installationId}`;
          const responseRepos = await fetch(url);
          const formattedData: GitHubOwnerWithRepos = await responseRepos.json();
          return formattedData;
        })
      );

      const allOwners = results.reduce<GitHubOwnerWithRepos[]>((acc, result) => {
        if (result.status === "fulfilled") return [...acc, result.value];
        return acc;
      }, []);

      setGithubOwners(allOwners);
    };
    fetchGitHubRepositories();
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
