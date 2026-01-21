import React from "react";

import { PRData } from "../types";

type PRTableProps = {
  prs: PRData[];
};

const getCheckStatusBadge = (status: PRData["checkStatus"]) => {
  switch (status) {
    case "success":
      return <span className="px-2 py-1 text-xs rounded text-green-800">✓ Passed</span>;
    case "failure":
      return <span className="px-2 py-1 text-xs rounded text-red-800">✗ Failed</span>;
    case "pending":
      return <span className="px-2 py-1 text-xs rounded text-yellow-800">⋯ Pending</span>;
    case "none":
      return <span className="px-2 py-1 text-xs rounded text-gray-600">- No Checks</span>;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "added":
      return <span className="text-green-600 text-xs font-semibold">A</span>;
    case "modified":
      return <span className="text-blue-600 text-xs font-semibold">M</span>;
    case "removed":
      return <span className="text-red-600 text-xs font-semibold">D</span>;
    case "renamed":
      return <span className="text-purple-600 text-xs font-semibold">R</span>;
  }
};

const getDiffBadge = (additions: number, deletions: number) => {
  const parts = [];
  if (additions > 0)
    parts.push(
      <span key="add" className="text-green-600">
        +{additions}
      </span>,
    );
  if (deletions > 0)
    parts.push(
      <span key="del" className="text-red-600">
        -{deletions}
      </span>,
    );

  if (parts.length === 0) return null;

  return (
    <span className="text-xs ml-2">
      ({parts.reduce<React.ReactNode[]>((acc, curr, i) => [...acc, i > 0 ? ", " : "", curr], [])})
    </span>
  );
};

export default function PRTable({ prs }: PRTableProps) {
  return (
    <div className="overflow-x-auto">
      <div className="max-h-[90vh] overflow-y-auto">
        <table className="w-full bg-white border table-fixed">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="py-3 px-4 text-left border font-normal w-24">PR #</th>
              <th className="py-3 px-4 text-left border font-normal">Title / Files</th>
              <th className="py-3 px-4 text-left border font-normal w-32">Status</th>
              <th className="py-3 px-4 text-left border font-normal w-40">Timestamps</th>
            </tr>
          </thead>
          <tbody>
            {prs.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-4 px-4 text-center border">
                  No open GitAuto PRs
                </td>
              </tr>
            ) : (
              prs.map((pr) => (
                <React.Fragment key={pr.number}>
                  {/* PR Title Row */}
                  <tr className="hover:bg-gray-50 border-t">
                    <td className="pt-3 pb-1 px-4 border-l border-r font-medium">#{pr.number}</td>
                    <td className="pt-3 pb-1 px-4 border-r">
                      <a
                        href={pr.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-600 hover:text-pink-700 hover:underline"
                      >
                        {pr.title}
                      </a>
                    </td>
                    <td className="pt-3 pb-1 px-4 border-r">
                      <div>
                        {getCheckStatusBadge(pr.checkStatus)}
                        {pr.hasConflicts && (
                          <div className="mt-1 text-xs text-red-600">⚠ Has conflicts</div>
                        )}
                      </div>
                    </td>
                    <td className="pt-3 pb-1 px-4 border-r text-xs text-gray-600">
                      <div>Created: {new Date(pr.createdAt).toLocaleString()}</div>
                      <div>Fetched: {new Date(pr.lastFetched).toLocaleString()}</div>
                    </td>
                  </tr>

                  {/* File Rows */}
                  {pr.files.map((file, index) => (
                    <tr key={`pr-${pr.number}-file-${index}`} className="hover:bg-gray-50">
                      <td
                        className={`py-1 px-4 border-l border-r ${index === pr.files.length - 1 ? "pb-3" : ""}`}
                      ></td>
                      <td
                        className={`py-1 px-4 border-r pl-8 ${index === pr.files.length - 1 ? "pb-3" : ""}`}
                      >
                        <div className="text-sm">
                          {getStatusBadge(file.status)}{" "}
                          <span className="font-mono text-sm">{file.filename}</span>
                          {getDiffBadge(file.additions, file.deletions)}
                        </div>
                      </td>
                      <td
                        className={`py-1 px-4 border-r ${index === pr.files.length - 1 ? "pb-3" : ""}`}
                      ></td>
                      <td
                        className={`py-1 px-4 border-r ${index === pr.files.length - 1 ? "pb-3" : ""}`}
                      ></td>
                    </tr>
                  ))}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
