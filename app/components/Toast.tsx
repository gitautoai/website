import { useEffect } from "react";
import CheckIcon from "./icon/CheckIcon";
import SpinnerIcon from "./icon/SpinnerIcon";
import XIcon from "./icon/XIcon";

interface ToastProps {
  message: string;
  type: "success" | "error" | "loading";
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (type !== "loading") {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose, type]);

  const getStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border border-green-200";
      case "error":
        return "bg-red-50 border border-red-200";
      case "loading":
        return "bg-blue-50 border border-blue-200";
      default:
        return "bg-gray-50 border border-gray-200";
    }
  };

  const getTextColor = () => {
    switch (type) {
      case "success":
        return "text-green-800";
      case "error":
        return "text-red-800";
      case "loading":
        return "text-blue-800";
      default:
        return "text-gray-800";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckIcon />
          </div>
        );
      case "error":
        return (
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
            <XIcon />
          </div>
        );
      case "loading":
        return <SpinnerIcon color="blue" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`fixed bottom-5 right-28 z-50 rounded-lg shadow-lg px-6 py-4 transition-all duration-300 w-auto ${getStyles()}`}
    >
      <div className="flex items-center space-x-4 whitespace-nowrap">
        {getIcon()}
        <div>
          <p className={`text-base font-medium ${getTextColor()}`}>{message}</p>
        </div>
      </div>
    </div>
  );
}
