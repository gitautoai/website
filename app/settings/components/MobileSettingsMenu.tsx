"use client";
import { useState, useEffect } from "react";
import SettingsMenu from "./SettingsMenu";

export default function MobileSettingsMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />

      {/* Menu */}
      <div
        className={`fixed right-0 top-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-200 ease-in-out ${
          isClosing ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        <SettingsMenu onItemClick={onClose} />
      </div>
    </div>
  );
}
