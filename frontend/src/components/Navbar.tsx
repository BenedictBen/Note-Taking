import { FiUser, FiPlus } from "react-icons/fi";

interface NavbarProps {
  onAddNote: () => void;
}

export default function Navbar({ onAddNote }: NavbarProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Notes App</h1>
        
        <div className="flex items-center space-x-4">
          {/* Add Note Button (now with icon) */}
          <button
            onClick={onAddNote}
            className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
            aria-label="Add note"
            title="Add new note"
          >
            <FiPlus size={20} />
          </button>
          
          {/* User Profile */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <FiUser className="text-gray-600" size={16} />
            </div>
            <span className="hidden md:inline text-sm font-medium text-gray-700">
              User
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}