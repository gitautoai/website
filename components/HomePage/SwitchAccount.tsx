"use client";

// Local
import { useAccountContext } from "../Context/Account";

import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";

export default function SwitchAccount({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { userInfos, mutateUserInfos, selectedIndex, userId, jwtToken } =
    useAccountContext();

  async function setInstalllationToSelected(newUserPrimaryId: string) {
    const response = await fetch("/api/users/set-installation-to-selected", {
      method: "POST",
      body: JSON.stringify({
        userId: userId,
        jwtToken: jwtToken,
        newUserPrimaryId: Number(newUserPrimaryId.replace("n", "")),
      }),
    });
    if (response.ok) {
      await response.json();
              id="account-selection"
      await mutateUserInfos();
      onClose();
    }
    return;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(1px)" />
      <ModalCloseButton />
      <ModalContent>
        <ModalBody>
          <div className="text-xl my-16">
            {userInfos ? (
              <>
                {userInfos.length > 0 && (
                  <div>
                    <div className="mt-8 mb-8 text-2xl">
                      Please select an account:
                    </div>
                    <div className="flex flex-col items-start text-2xl gap-5">
                      {userInfos.map((item: any, index: number) => {
                        return (
                          <div key={index}>
                            {item.installations.owner_type === "User" && (
                              <button
                                onClick={() => {
                                  setInstalllationToSelected(item.id);
                                }}
                                className={`${
                                  selectedIndex == index &&
                                  "border-l-2 p-1 border-pink"
                                }`}
                              >
                                {item.installations.owner_name}
                                <span className="text-lg">
                                  - personal account
                                </span>
                              </button>
                            )}
                            {item.installations.owner_type ===
                              "Organization" && (
                              <button
                                onClick={() => {
                                  setInstalllationToSelected(item.id);
                                }}
                                className={`${
                                  selectedIndex == index &&
                                  "border-l-2 p-1 border-pink"
                                }`}
                              >
                                {item.installations.owner_name}{" "}
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
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
