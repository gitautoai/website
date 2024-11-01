"use client";

import React, { useState } from 'react';

export default function JiraIntegration() {
  const [githubUsername, setGithubUsername] = useState('');
  const [jiraProject, setJiraProject] = useState('');
  const [githubRepo, setGithubRepo] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
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

      console.log('Upsert response:', response);
      if (!response.ok) {
        throw new Error('Failed to upsert data');
      }

      const data = await response.json();
      console.log('Upsert successful:', data);
    } catch (error) {
      console.error('Error during upsert:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl">Jira Integration</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="GitHub Username"
          value={githubUsername}
          onChange={(e) => setGithubUsername(e.target.value)}
          className="border p-2"
        />
        <input
          type="text"
          placeholder="Jira Project"
          value={jiraProject}
          onChange={(e) => setJiraProject(e.target.value)}
          className="border p-2"
        />
        <input
          type="text"
          placeholder="GitHub Repo"
          value={githubRepo}
          onChange={(e) => setGithubRepo(e.target.value)}
          className="border p-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          Submit
        </button>
      </form>
    </div>
  );
}
