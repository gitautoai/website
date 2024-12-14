"use client";

import { useIntegrations } from "./useIntegrations";
import { useRows } from "./useRows";
import dynamic from 'next/dynamic';
const JiraHeader = dynamic(() => import('./JiraHeader'));
const JiraForm = dynamic(() => import('./JiraForm'));

export default function JiraIntegrationPage() {
  const { jiraSites, githubOwners, isConnected, isConnecting, handleJiraAuth } = useIntegrations();
  const { integrationRows, addNewRow, updateRow, deleteRow } = useRows();

  return (
    <div className="py-28 md:py-36 max-w-screen-lg mx-auto">
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
  );
}
