import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Note } from '../types';
import { getNotes } from '../services/storageService';
import { Icons } from '../components/Icon';

const Home: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setNotes(getNotes());
  }, []);

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 shadow-sm sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">My Notes</h1>
        <div className="relative">
          <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <Icons.FileText size={48} className="mb-2 opacity-50" />
            <p>No notes found.</p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div 
              key={note.id}
              onClick={() => navigate(`/note/${note.id}`)}
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 active:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-800 text-lg mb-1 truncate">{note.title || "Untitled"}</h3>
              <p className="text-gray-500 text-sm line-clamp-2">{note.content.replace(/[#*`]/g, '')}</p>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                <span>{new Date(note.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;