import { useState, useEffect } from "react";
import { useNotes } from "../hooks/useNotes";
import { validateNote } from "../utils/helpers";
import type { Note } from "../types/types";

interface NoteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  note?: Note | null;
  onAddNote?: () => void;
  onSubmit?: (updatedNote: { title: string; body: string }) => void;
}

export default function NoteFormModal({
  isOpen,
  onClose,
  note = null,
  onAddNote,
  onSubmit,
}: NoteFormModalProps) {
  const { addNote, loading } = useNotes();
  const [title, setTitle] = useState(note?.title || "");
  const [body, setBody] = useState(note?.body || "");
  const [error, setError] = useState<string | null>(null);

  // Reset form when note changes
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setBody(note.body);
    } else {
      setTitle("");
      setBody("");
    }
    setError(null);
  }, [note]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateNote({ title, body });
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      if (onSubmit) {
        await onSubmit({ title, body });
      } else {
        await addNote({ title, body });
        onAddNote?.();
      }
      onClose();
      setTitle("");
      setBody("");
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save note");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {note ? "Edit Note" : "Create New Note"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer text-2xl"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
              maxLength={100}
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="body"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Content *
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 min-h-[200px]"
              required
              disabled={loading}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
            >
              {loading
                ? note
                  ? "Updating..."
                  : "Creating..."
                : note
                ? "Update Note"
                : "Create Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}