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
}: {
  isOpen: boolean;
  onClose: () => void;
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
                    No User or Organizations found. Please install{" "}
                    <a
                      href="https://github.com/apps/gitauto-ai"
                      target="_blank"
                      className="text-pink underline"
                    >
                      GitAuto
                    </a>
                    .
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
                                <span className="text-lg">- organization</span>
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