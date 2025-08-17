import { useState, useCallback } from 'react';
import { 
  fetchNotes, 
  createNote, 
  updateNote, 
  deleteNote,
  fetchNote
} from '../api/notesApi';
import type { Note } from '../types/types';
import { hasNoteChanged } from '../utils/helpers';


export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotes();
      setNotes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, []);


  const addNote = useCallback(async (note: Omit<Note, '_id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    try {
      const newNote = await createNote(note);
      setNotes(prev => [...prev, newNote]); 
      return newNote;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

 

const editNote = useCallback(async (id: string, updates: Partial<Note>) => {
  // Check if note exists and if there are actual changes
  const noteToUpdate = notes.find(note => note._id === id);
  if (!noteToUpdate) {
    throw new Error('Note not found');
  }

  // Check if the title is being changed to an existing title (excluding itself)
  if (updates.title && updates.title !== noteToUpdate.title) {
    const titleExists = notes.some(
      note => note.title === updates.title && note._id !== id
    );
    if (titleExists) {
      throw new Error('A note with this title already exists');
    }
  }

  // Check if there are actual content changes
  if (!hasNoteChanged(noteToUpdate, updates)) {
    return noteToUpdate;
  }

  setLoading(true);
  try {

    setNotes(prev => prev.map(note => 
      note._id === id ? { 
        ...note, 
        ...updates,
        updatedAt: new Date().toISOString()
      } : note
    ));
    
    const updatedNote = await updateNote(id, updates);
    
  
    setNotes(prev => prev.map(note => 
      note._id === id ? updatedNote : note
    ));
    
    return updatedNote;
  } catch (err) {
    setNotes(prev => [...prev]);
    throw err;
  } finally {
    setLoading(false);
  }
}, [notes]);

  const removeNote = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await deleteNote(id);
      setNotes(prev => prev.filter(note => note._id !== id));
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getNote = useCallback(async (id: string) => {
    setLoading(true);
    try {
      return await fetchNote(id);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    notes,
    loading,
    error,
    loadNotes,
    addNote,
    editNote,
    removeNote,
    getNote
  };
};