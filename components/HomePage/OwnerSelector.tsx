"use client";

// Local
import { useAccountContext } from "../Context/Account";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay } from "@chakra-ui/react";
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(1px)" />
      <ModalCloseButton />
      <ModalContent>
        <ModalBody>
          <div className="text-xl my-16">
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
                                {item.owner_name} <span className="text-lg">- organization</span>{" "}
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
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
