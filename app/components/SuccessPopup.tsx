import { useEffect } from "react";

interface SuccessPopupProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function SuccessPopup({ message, onClose, duration = 3000 }: SuccessPopupProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-5 right-28 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up">
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span>{message}</span>
      </div>
    </div>
  );
}
