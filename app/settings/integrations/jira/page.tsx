"use client";

import { useIntegrations } from "./useIntegrations";
import { useRows } from "./useRows";
import { JiraHeader } from "./JiraHeader";
import { JiraForm } from "./JiraForm";

export default function JiraIntegrationPage() {
  const { jiraSites, githubOwners, isConnected, isConnecting, handleJiraAuth } = useIntegrations();
  const { integrationRows, addNewRow, updateRow, deleteRow } = useRows();

  return (
    <>
      <h1 className="text-3xl font-bold">Jira Integration</h1>

      <div className="space-y-8">
        <JiraHeader isConnected={isConnected} isConnecting={isConnecting} onAuth={handleJiraAuth} />
        <JiraForm
          integrationRows={integrationRows}
          jiraSites={jiraSites}
          githubOwners={githubOwners}
          onAddRow={addNewRow}
          onUpdateRow={updateRow}
          onDeleteRow={deleteRow}
        />
      </div>
    </>
  );
}
