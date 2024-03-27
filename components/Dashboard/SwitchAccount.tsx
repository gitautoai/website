"use client";
import { useEffect, useState } from "react";

// Local
import { useAccountContext } from "../Context/Account";
import { useSession } from "next-auth/react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { set } from "zod";

import { Session } from "next-auth";
interface ProfileIconProps {
  session: Session | null;
}

export default function SwitchAccount({
  isOpen,
  onClose,
  isFromProfileMenu = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  isFromProfileMenu?: boolean;
}) {
  const {
    account,
    setAccount,
    accountType,
    setAccountType,
    userInfos,
    selectedIndex,
    userId,
    jwtToken,
  } = useAccountContext();

  useEffect(() => {
    if (userInfos && userInfos.length === 1) {
      setAccount(userInfos[0].installations.owner_id);
      setAccountType(userInfos[0].installations.owner_type);
    }
    if (userInfos && selectedIndex) {
      setAccount(userInfos[selectedIndex].installations.owner_id);
      setAccountType(userInfos[selectedIndex].installations.owner_type);
    }
  }, [userInfos, setAccount, setAccountType, selectedIndex]);

  async function setInstalllationToSelected(newUserPrimaryId: string) {
    const response = await fetch("api/users/set-installation-to-selected", {
      method: "POST",
      body: JSON.stringify({
        userId: userId,
        jwtToken: jwtToken,
        newUserPrimaryId: Number(newUserPrimaryId.replace("n", "")),
      }),
    });

    const res = await response.json();
    await res;
    // TODO create loading button
    onClose();
    return;
  }

  return (
    <>
      {(account === null || isFromProfileMenu) && (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(1px)" />
          <ModalCloseButton />
          <ModalContent>
            <ModalBody>
              <div className="text-xl my-16">
                {userInfos ? (
                  <>
                    {userInfos.length === 0 && (
                      <div>
                        No User or Organizations found. Please install GitAuto.
                      </div>
                    )}
                    {userInfos.length === 1 && (
                      <div>
                        Only your GitHub user account was found. To manage your
                        organization, please install our{" "}
                        <a
                          href="https://github.com/apps/gitauto-ai"
                          target="_blank"
                          className="text-pink underline"
                        >
                          marketplace app
                        </a>
                      </div>
                    )}
                    {userInfos.length > 1 && (
                      <div>
                        <div className="mt-8 mb-8 text-2xl">
                          Please select an account:
                        </div>
                        <div className="flex flex-col items-start text-2xl gap-5">
                          {userInfos.map((item: any, index: number) => {
                            return (
                              <div key={index}>
                                {item.installations.owner_type === "U" && (
                                  <button
                                    onClick={() => {
                                      setAccount(item.installations.owner_id);
                                      setAccountType("U");
                                      setInstalllationToSelected(item.id);
                                    }}
                                  >
                                    {item.installations.owner_name}
                                    <span className="text-lg">
                                      - personal account
                                    </span>
                                  </button>
                                )}
                                {item.installations.owner_type === "O" && (
                                  <button
                                    onClick={() => {
                                      setAccount(item.installations.owner_id);
                                      setAccountType("O");
                                      setInstalllationToSelected(item.id);
                                    }}
                                  >
                                    {item.installations.owner_name}{" "}
                                    <span className="text-lg">
                                      - organization
                                    </span>
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
      )}
    </>
  );
}
