"use client";

import React, { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function JiraIntegration() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [jiraWorkspaces, setJiraResources] = useState<{ id: string; name: string }[]>([]);


  useEffect(() => {
    const fetchJiraWorkspaces = async () => {
      if (session?.user?.atlassianInfo?.accessToken) {
        try {
          const response = await fetch(`/api/jira/workspaces?accessToken=${session.user.atlassianInfo.accessToken}`);
          const workspaces = await response.json();
          setJiraResources(workspaces.map((workspace: { id: string; name: string }) => ({ id: workspace.id, name: workspace.name })));
        } catch (error) {
          console.error('Error fetching Jira workspaces:', error);
        }
      }
    };

    fetchJiraWorkspaces();
  }, [session]);

  // const handleSubmit = async (event: React.FormEvent) => {
  //   event.preventDefault();
  //   setIsLoading(true);

  //   try {
  //     const response = await fetch('/api/installations/upsert', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         githubUsername,
  //         selectedRepos,
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to upsert data');
  //     }

  //     const data = await response.json();
  //     console.log('Upsert successful:', data);
  //     router.push('/'); // Redirect to home page after successful integration
  //   } catch (error) {
  //     console.error('Error during upsert:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };


  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {!session?.user?.atlassianInfo?.accessToken ? (
        <button
          onClick={() => signIn('atlassian')}
          type="button"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 px-8 shadow-xl font-semibold"
        >
          Connect with Atlassian
        </button>
      ) : (
        <div className="flex flex-col space-y-4 w-full max-w-md">
          <div className="flex flex-col space-y-2">
            <h1 className="text-xl font-semibold text-center">Select a Jira Workspace to Link</h1>
            {jiraWorkspaces.map((workspace) => (
              <button
                key={workspace.id}
                onClick={() => router.push(`/repos?workspaceId=${workspace.id}`)}
                className={`bg-pink-600 hover:bg-pink-700 text-white rounded-xl transition-colors duration-200 text-md sm:text-lg xl:text-xl py-3 sm:py-2 md:py-4 px-8 shadow-xl hover:shadow-xl font-semibold md:w-auto mx-auto mt-6 sm:mt-2 md:mt-6 flex items-center gap-2`}
              >
                {workspace.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
