import { useState } from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import ConfirmModal from "./modal/ConfirmModal";

export default function NavSidebar({ isOpen, isMobile }) {
  const [showModal, setShowModal] = useState(false);
  const { signOut } = useAuth();

  const handleSignOut = () => {
    setShowModal(false);
    signOut();
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="w-full">
      <button
        onClick={handleOpenModal}
        className="group relative w-full py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 active:bg-red-800 transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        aria-label="Sign out"
      >
        <LogOut size={18} aria-hidden="true" />

        {((!isMobile && isOpen) || isMobile) && <span>Sign Out</span>}

        {!isMobile && !isOpen && (
          <span className="absolute left-full ml-2 px-2 py-1 rounded bg-gray-900 text-white text-xs opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity pointer-events-none">
            Sign Out
          </span>
        )}
      </button>

      <ConfirmModal
        open={showModal}
        title="Sign Out"
        message="Are you sure you want to sign out?"
        onClose={handleCloseModal}
        onConfirm={handleSignOut}
      />
    </div>
  );
}
