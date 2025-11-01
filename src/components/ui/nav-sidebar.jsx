import { useState, useCallback} from "react";
import { LogOut, Settings } from "lucide-react";


export default function NavSidebar({ onSignOut }) {
    const [showModal, setShowModal] = useState(false);
    
    return (
        <div className="w-full">
        {/* Settings / Sign Out buttons */}
        <div className="flex flex-col gap-2">
            {/* <button
            className="w-full py-2 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
            >
            <Settings size={18} /> Settings
            </button> */}

        <button
            onClick={() => setShowModal(true)}
            className="w-full py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
            <LogOut size={18} />
            {/* Hide text on small screens, show on medium+ */}
            <span className="hidden md:inline">Sign Out</span>
        </button>

        </div>

        {/* Modal */}
        {showModal && (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-20 animate-fade-in">
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm text-center transform scale-95 opacity-0 animate-modal-in">
            <LogOut className="mx-auto mb-3 text-red-600" size={48} />
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Sign Out</h2>
            <p className="text-gray-600 text-sm mb-6">
            Are you sure you want to sign out?
            </p>
            <div className="flex justify-between gap-3">
            <button
                onClick={() => setShowModal(false)}
                className="w-1/2 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors"
            >
                Cancel
            </button>
            <button
                onClick={onSignOut}
                className="w-1/2 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
            >
                Sign Out
            </button>
            </div>
        </div>
    </div>
        )}
        </div>
    );
}
