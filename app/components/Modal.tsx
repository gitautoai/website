import CheckIcon from "@/app/components/icons/CheckIcon";
import SpinnerIcon from "@/app/components/icons/SpinnerIcon";
import XIcon from "@/app/components/icons/XIcon";

interface ModalProps {
  title: string;
  type: "loading" | "success" | "error";
  message: string;
  onClose?: () => void;
}

export default function Modal({ message, type, title, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-100 transform transition-all">
        <div className="text-center">
          {type === "loading" && (
            <div className="w-16 h-16 mx-auto mb-6 bg-pink-50 rounded-full flex items-center justify-center">
              <SpinnerIcon color="pink" />
            </div>
          )}
          {type === "success" && (
            <div className="w-16 h-16 mx-auto mb-6 bg-green-50 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <CheckIcon />
              </div>
            </div>
          )}
          {type === "error" && (
            <div className="w-16 h-16 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <XIcon />
              </div>
            </div>
          )}

          <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{message}</p>

          {onClose && (
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Got it
            </button>
          )}
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XIcon />
          </button>
        )}
      </div>
    </div>
  );
}
