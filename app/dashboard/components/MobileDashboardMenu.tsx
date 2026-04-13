"use client";
import { useState, useEffect } from "react";
import DashboardMenu from "./DashboardMenu";

interface MobileDashboardMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath?: string;
}

export default function MobileDashboardMenu({
  isOpen,
  onClose,
  currentPath,
}: MobileDashboardMenuProps) {
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
        className={`fixed right-0 top-0 h-full w-64 bg-white shadow-xl overflow-y-auto transform transition-transform duration-200 ease-in-out ${
          isClosing ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        <DashboardMenu onItemClick={onClose} currentPath={currentPath} />
      </div>
    </div>
  );
}
