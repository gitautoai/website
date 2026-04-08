"use client";

import { useCallback, useState } from "react";
import { getSetupPRStatus, SetupPRStatus } from "@/app/actions/github/get-open-setup-pr";
import { setupCoverageWorkflow } from "@/app/actions/setup-coverage-workflow";
import Modal from "@/app/components/Modal";

export const useSetupWorkflow = () => {
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [modalPRStatus, setModalPRStatus] = useState<SetupPRStatus | null>(null);
  // Track per-repo status (by repoName)
  const [repoStatuses, setRepoStatuses] = useState<Partial<Record<string, SetupPRStatus>>>({});

  const getRepoStatus = useCallback(
    (repoName: string) => repoStatuses[repoName] || null,
    [repoStatuses],
  );

  // Check if a repo already has a setup PR (call on page load for repos with no data)
  const checkSetupPR = useCallback(
    async ({
      ownerName,
      repoName,
      installationId,
    }: {
      ownerName: string;
      repoName: string;
      installationId: number;
    }) => {
      try {
        const status = await getSetupPRStatus({ ownerName, repoName, installationId });
        if (status.status !== "none") {
          setRepoStatuses((prev) => ({ ...prev, [repoName]: status }));
        }
      } catch (error) {
        console.error("Failed to check setup PR status:", error);
      }
    },
    [],
  );

  const triggerSetup = async ({
    ownerName,
    repoName,
    installationId,
    senderName,
    source,
  }: {
    ownerName: string;
    repoName: string;
    installationId: number;
    senderName: string;
    source: string;
  }) => {
    setIsSettingUp(true);

    // Check for existing setup PR before creating a new one
    try {
      const status = await getSetupPRStatus({ ownerName, repoName, installationId });
      if (status.status !== "none") {
        setModalPRStatus(status);
        setRepoStatuses((prev) => ({ ...prev, [repoName]: status }));
        setIsSettingUp(false);
        return;
      }
    } catch (error) {
      console.error("Failed to check setup PR status:", error);
    }

    // Fire and forget — Lambda runs setup in the background
    setupCoverageWorkflow(ownerName, repoName, installationId, senderName, source).catch(() => {});
    setShowSetupModal(true);
    const triggered: SetupPRStatus = {
      status: "open",
      url: "",
      number: 0,
      title: "Setup in progress",
    };
    setRepoStatuses((prev) => ({ ...prev, [repoName]: triggered }));
    setIsSettingUp(false);
  };

  const SetupModals = () => (
    <>
      {showSetupModal && (
        <Modal
          title="Setting Up CI Workflow"
          type="success"
          message="A pull request will be created shortly with a CI workflow to upload coverage reports. Check your repository for the new PR."
          onClose={() => setShowSetupModal(false)}
        />
      )}
      {modalPRStatus?.status === "open" && (
        <Modal
          title="Setup PR Already Open"
          type="success"
          message={
            <>
              A setup PR is already open for this repository:{" "}
              <a
                href={modalPRStatus.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:underline font-medium"
              >
                #{modalPRStatus.number} {modalPRStatus.title}
              </a>
            </>
          }
          onClose={() => setModalPRStatus(null)}
          actions={[
            {
              label: "View PR",
              onClick: () => {
                window.open(modalPRStatus.url, "_blank");
                setModalPRStatus(null);
              },
            },
            {
              label: "Close",
              onClick: () => setModalPRStatus(null),
              variant: "secondary" as const,
            },
          ]}
        />
      )}
      {modalPRStatus?.status === "closed" && (
        <Modal
          title="Setup Not Available"
          type="error"
          message={modalPRStatus.message}
          onClose={() => setModalPRStatus(null)}
        />
      )}
    </>
  );

  return { isSettingUp, getRepoStatus, checkSetupPR, triggerSetup, SetupModals };
};
