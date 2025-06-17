import CheckIcon from "@/app/components/icon/CheckIcon";
import SpinnerIcon from "@/app/components/icon/SpinnerIcon";
import XIcon from "@/app/components/icon/XIcon";

interface SyncModalProps {
  message: string;
  type: "loading" | "success" | "error";
}

export default function SyncModal({ message, type }: SyncModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
        <div className="flex items-center space-x-3">
          {type === "loading" && <SpinnerIcon color="pink" />}
          {type === "success" && (
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <CheckIcon />
            </div>
          )}
          {type === "error" && (
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <XIcon />
            </div>
          )}
          <div>
            <p className="text-gray-800 font-medium">
              {type === "loading"
                ? "Syncing Repository"
                : type === "success"
                ? "Sync Complete"
                : type === "error"
                ? "Sync Failed"
                : "Repository Update"}
            </p>
            <p className="text-gray-600 text-sm">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
