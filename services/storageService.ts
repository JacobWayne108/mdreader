import { Note } from '../types';
import { STORAGE_KEY } from '../constants';

export const getNotes = (): Note[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load notes", e);
    return [];
  }
};

export const saveNotes = (notes: Note[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (e) {
    console.error("Failed to save notes", e);
  }
};

export const saveNote = (note: Note): Note[] => {
  const notes = getNotes();
  const existingIndex = notes.findIndex(n => n.id === note.id);
  
  let newNotes;
  if (existingIndex >= 0) {
    newNotes = [...notes];
    newNotes[existingIndex] = note;
  } else {
    newNotes = [note, ...notes];
  }
  
  saveNotes(newNotes);
  return newNotes;
};

export const deleteNote = (id: string): Note[] => {
  const notes = getNotes().filter(n => n.id !== id);
  saveNotes(notes);
  return notes;
};