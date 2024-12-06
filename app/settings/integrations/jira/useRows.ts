"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { JiraSiteWithProjects } from "@/lib/jira";
import { GitHubOwnerWithRepos } from "@/app/api/github/get-installed-repos/route";

export interface IntegrationRow {
  siteName: string;
  projectName: string;
  githubOwner: string;
  githubRepository: string;
  lastSyncDate: string;
}

const createDefaultRow = (): IntegrationRow => ({
  siteName: "",
  projectName: "",
  githubOwner: "",
  githubRepository: "",
  lastSyncDate: "-",
});

export function useRows() {
  const { data: session } = useSession();
  const [integrationRows, setIntegrationRows] = useState<IntegrationRow[]>([createDefaultRow()]);

  useEffect(() => {
    const fetchInitialRows = async () => {
      try {
        const response = await fetch("/api/supabase/get-jira-github-link");
        const { data } = await response.json();

        if (data && data.length > 0) {
          const rows: IntegrationRow[] = data.map((link: any) => ({
            siteName: link.jira_site_name,
            projectName: link.jira_project_name,
            githubOwner: link.github_owner_name,
            githubRepository: link.github_repo_name,
            lastSyncDate: link.updated_at || "-",
          }));
          setIntegrationRows(rows);
        }
      } catch (error) {
        console.error("Failed to fetch initial rows:", error);
        setIntegrationRows([createDefaultRow()]);
      }
    };

    fetchInitialRows();
  }, []);

  const addNewRow = () => setIntegrationRows([...integrationRows, createDefaultRow()]);

  const saveIntegration = async (
    row: IntegrationRow,
    jiraSites: JiraSiteWithProjects[],
    githubOwners: GitHubOwnerWithRepos[]
  ) => {
    const site = jiraSites.find((s) => s.name === row.siteName);
    const project = site?.projects.find((p) => p.name === row.projectName);
    const owner = githubOwners.find((o) => o.ownerName === row.githubOwner);
    const repo = owner?.repositories.find((r) => r.repoName === row.githubRepository);
    if (!site || !project || !owner || !repo || !session?.user?.userId) return;

    try {
      const response = await fetch("/api/supabase/upsert-jira-github-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jira_site_id: site.id,
          jira_site_name: site.name,
          jira_project_id: project.id,
          jira_project_name: project.name,
          github_owner_id: owner.ownerId,
          github_owner_name: owner.ownerName,
          github_repo_id: repo.repoId,
          github_repo_name: repo.repoName,
          created_by: session.user.userId,
          updated_by: session.user.userId,
        }),
      });

      if (response.ok) {
        const newRows = [...integrationRows];
        const index = integrationRows.findIndex((r) => r === row);
        newRows[index].lastSyncDate = new Date().toISOString();
        setIntegrationRows(newRows);
      }
    } catch (error) {
      console.error("Failed to save integration:", error);
    }
  };

  const updateRow = (
    index: number,
    field: keyof IntegrationRow,
    value: string,
    jiraSites: JiraSiteWithProjects[],
    githubOwners: GitHubOwnerWithRepos[]
  ) => {
    const newRows = [...integrationRows];
    newRows[index][field] = value;

    // Reset dependent fields
    if (field === "siteName") newRows[index].projectName = "";
    if (field === "githubOwner") newRows[index].githubRepository = "";

    setIntegrationRows(newRows);

    // Auto-save when all fields are filled
    const updatedRow = newRows[index];
    const { siteName, projectName, githubOwner, githubRepository } = updatedRow;
    if (siteName && projectName && githubOwner && githubRepository)
      saveIntegration(updatedRow, jiraSites, githubOwners);
  };

  // Delete a row and delete the corresponding row in Supabase
  const deleteRow = async (
    index: number,
    jiraSites: JiraSiteWithProjects[],
    githubOwners: GitHubOwnerWithRepos[]
  ) => {
    try {
      const row = integrationRows[index];
      const site = jiraSites.find((s) => s.name === row.siteName);
      const project = site?.projects.find((p) => p.name === row.projectName);
      const owner = githubOwners.find((o) => o.ownerName === row.githubOwner);
      const repo = owner?.repositories.find((r) => r.repoName === row.githubRepository);
      if (!site || !project || !owner || !repo) return;

      const response = await fetch("/api/supabase/delete-jira-github-link", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jira_site_id: site.id,
          jira_project_id: project.id,
          github_owner_id: owner.ownerId,
          github_repo_id: repo.repoId,
        }),
      });

      if (response.ok) {
        const newRows = [...integrationRows];
        newRows.splice(index, 1);
        setIntegrationRows(newRows.length ? newRows : [createDefaultRow()]);
      }
    } catch (error) {
      console.error("Failed to delete integration:", error);
    }
  };

  return {
    integrationRows,
    addNewRow,
    updateRow,
    deleteRow,
  };
}
