import axios, { AxiosError } from 'axios';
import type { Note } from '../types/types';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const serverError = error.response?.data?.message || error.message;
    toast.error(serverError);
    throw new Error(serverError);
  }
  toast.error('An unexpected error occurred');
  throw new Error('An unexpected error occurred');
};

export const fetchNotes = async (): Promise<Note[]> => {
  try {
    const response = await axios.get<Note[]>(API_BASE);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchNote = async (id: string): Promise<Note> => {
  try {
    const response = await axios.get<Note>(`${API_BASE}/${id}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const createNote = async (note: Omit<Note, '_id' | 'createdAt' | 'updatedAt'>): Promise<Note> => {
  try {
    const response = await axios.post<Note>(API_BASE, note);
    toast.success('Note created successfully');
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateNote = async (id: string, note: Partial<Note>): Promise<Note> => {
  try {
    const response = await axios.put<Note>(`${API_BASE}/${id}`, note);
    toast.success('Note updated successfully');
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteNote = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE}/${id}`);
    toast.success('Note deleted successfully');
  } catch (error) {
    handleApiError(error);
  }
};