import type { Note } from '../types/types';
import { FiEdit, FiTrash2, FiClock, FiCalendar } from 'react-icons/fi';
import { formatDate } from '../utils/helpers';

interface NoteItemProps {
  note: Note;
  onDelete: (id: string) => void;
  onEdit: (note: Note) => void;
}

export default function NoteItem({ note, onDelete, onEdit }: NoteItemProps) {
  return (
    <div className="relative group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      {/* Card Content */}
      <div className="p-5">
        {/* Header with title and action buttons */}
        <div className="flex justify-between items-start gap-3 mb-3">
          <h3 className="font-semibold text-gray-900 text-lg truncate">
            {note.title}
          </h3>
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(note);
              }}
              className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
              aria-label="Edit note"
              title="Edit note"
            >
              <FiEdit size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note._id);
              }}
              className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-600 transition-colors cursor-pointer"
              aria-label="Delete note"
              title="Delete note"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        </div>

        {/* Note content with gradient fade */}
        <div className="relative mb-4">
          <p className="text-gray-600 line-clamp-4 text-ellipsis break-words">
            {note.body}
          </p>
        </div>

        {/* Metadata footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <FiCalendar size={12} className="flex-shrink-0" />
            <span>{formatDate(note.createdAt)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FiClock size={12} className="flex-shrink-0" />
            <span>Updated: {formatDate(note.updatedAt)}</span>
          </div>
        </div>
      </div>

      {/* Hover effect border */}
      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-blue-100 pointer-events-none transition-all duration-200" />
    </div>
  );
}