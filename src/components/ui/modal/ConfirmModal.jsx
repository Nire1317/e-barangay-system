import { LogOut } from "lucide-react";

export default function ConfirmModal({
  open,
  title,
  message,
  onConfirm,
  onClose,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-20 animate-fade-in">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm text-center transform scale-95 opacity-0 animate-modal-in">
        <LogOut className="mx-auto mb-3 text-red-600" size={48} />

        <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>

        <p className="text-gray-600 text-sm mb-6">{message}</p>

        <div className="flex justify-between gap-3">
          <button
            onClick={onClose}
            className="w-1/2 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="w-1/2 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
