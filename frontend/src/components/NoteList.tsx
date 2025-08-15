import { useEffect, useState } from 'react';
import { useNotes } from '../hooks/useNotes';
import NoteItem from './NoteItem';
import LoadingSpinner from './LoadingSpinner';
import NoteFormModal from './NoteFormModal';
import type { Note } from '../types/types';

interface NoteListProps {
  onAddNote?: () => void;
}

export default function NoteList({ onAddNote }: NoteListProps) {
  const { notes, loading, error, loadNotes, removeNote, editNote } = useNotes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const handleDelete = async (id: string) => {
    await removeNote(id);
  };

  const handleEditClick = (note: Note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const handleEditSubmit = async (updatedNote: { title: string; body: string }) => {
    if (editingNote) {
      await editNote(editingNote._id, updatedNote);
      setIsModalOpen(false);
    }
  };

  if (loading && notes.length === 0) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Your Notes</h2>
        <button
          onClick={() => {
            setEditingNote(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Create New Note
        </button>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No notes yet. Create your first note!
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <NoteItem 
              key={note._id} 
              note={note} 
              onDelete={handleDelete}
              onEdit={handleEditClick}
            />
          ))}
        </div>
      )}

      <NoteFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        note={editingNote}
        onSubmit={editingNote ? handleEditSubmit : undefined}
        onAddNote={loadNotes}
      />
    </div>
  );
}