"use client";

import { useAccountContext } from "../contexts/Account";
import { STORAGE_KEYS } from "@/lib/constants";
import { Installation } from "@/types/github";

export default function OwnerSelector({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const {
    installations,
    mutateInstallations,
    selectedIndex,
    setSelectedIndex,
    organizations,
    setCurrentRepoName,
    setCurrentOwnerName,
  } = useAccountContext();

  function selectOwner(index: number) {
    if (!installations) return;

    const newOwnerName = installations[index].owner_name;

    // Store the selected owner in localStorage
    localStorage.setItem(STORAGE_KEYS.CURRENT_OWNER_NAME, newOwnerName);

    // Update the selected index and owner name
    setSelectedIndex(index);
    setCurrentOwnerName(newOwnerName);

    // Find the first repository of the selected owner and set it
    const newOwner = organizations?.find((org) => org.ownerName === newOwnerName);
    if (newOwner && newOwner.repositories.length > 0) {
      const firstRepo = newOwner.repositories[0].repoName;
      localStorage.setItem(STORAGE_KEYS.CURRENT_REPO_NAME, firstRepo);
      setCurrentRepoName(firstRepo);
    }

    mutateInstallations();
    onClose();
  }

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-[1px] z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div className="relative bg-white rounded-xl w-full max-w-xl pointer-events-auto">
          <button
            onClick={onClose}
            className="absolute right-3 top-3 w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100"
          >
            ×
          </button>
          <div className="text-xl my-16 px-6">
            {installations ? (
              <>
                {installations.length > 0 && (
                  <div>
                    <div className="mt-8 mb-8 text-2xl">Select an organization or account:</div>
                    <div className="flex flex-col items-start text-2xl gap-5">
                      {installations.map((item: Installation, index: number) => {
                        return (
                          <div key={index}>
                            {item.owner_type === "User" && (
                              <button
                                id={`${index}-user-${item.id}`}
                                name={`${index}-user-${item.id}`}
                                onClick={() => {
                                  selectOwner(index);
                                }}
                                className={`${
                                  selectedIndex == index && "border-l-2 p-1 border-pink-600"
                                }`}
                              >
                                {item.owner_name}
                                <span className="text-lg">- personal account</span>
                              </button>
                            )}
                            {item.owner_type === "Organization" && (
                              <button
                                id={`${index}-org-${item.id}`}
                                name={`${index}-org-${item.id}`}
                                onClick={() => {
                                  selectOwner(index);
                                }}
                                className={`${
                                  selectedIndex == index && "border-l-2 p-1 border-pink-600"
                                }`}
                              >
                                {item.owner_name}{" "}
                                <span className="text-lg">- organization</span>{" "}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>loading...</>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
