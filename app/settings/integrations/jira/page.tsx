"use client";

import { JiraForm } from "./JiraForm";
import { JiraHeader } from "./JiraHeader";
import { jiraIntegrationJsonLd } from "./jsonld";
import { useIntegrations } from "./useIntegrations";
import { useRows } from "./useRows";

export default function JiraIntegrationPage() {
  const { jiraSites, githubOwners, isConnected, isConnecting, handleJiraAuth } = useIntegrations();
  const { integrationRows, addNewRow, updateRow, deleteRow } = useRows();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jiraIntegrationJsonLd) }}
      />
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
