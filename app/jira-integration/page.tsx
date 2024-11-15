"use client";

import React, { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function JiraIntegration() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [githubUsername, setGithubUsername] = useState('');
  const [jiraProject, setJiraProject] = useState('');
  const [githubRepo, setGithubRepo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session) {
      console.log('Atlassian Session Data:', session);
      console.log('JWT Token:', session.jwtToken);
    }
  }, [session]);

  const handleAtlassianAuth = async () => {
    await signIn('atlassian', { callbackUrl: '/jira-integration' });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/installations/upsert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          githubUsername,
          jiraProject,
          githubRepo,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to upsert data');
      }

      const data = await response.json();
      console.log('Upsert successful:', data);
      router.push('/'); // Redirect to home page after successful integration
    } catch (error) {
      console.error('Error during upsert:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl mb-8">Jira Integration</h1>
      
      {!session?.user ? (
        <button
          onClick={handleAtlassianAuth}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 px-8 shadow-xl font-semibold"
        >
          Connect with Atlassian
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-full max-w-md">
          <input
            type="text"
            placeholder="GitHub Username"
            value={githubUsername}
            onChange={(e) => setGithubUsername(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Jira Project"
            value={jiraProject}
            onChange={(e) => setJiraProject(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="GitHub Repo"
            value={githubRepo}
            onChange={(e) => setGithubRepo(e.target.value)}
            className="border p-2 rounded"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl py-3 px-8 shadow-xl font-semibold disabled:opacity-50"
          >
            {isLoading ? 'Connecting...' : 'Connect'}
          </button>
        </form>
      )}
    </div>
  );
}
