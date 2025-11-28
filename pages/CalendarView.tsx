import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Note } from '../types';
import { getNotes } from '../services/storageService';
import { Icons } from '../components/Icon';

const CalendarView: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    setNotes(getNotes());
  }, []);

  // Helper to generate calendar grid
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getFirstDayOfMonth(year, month);
  const today = new Date();

  // Get notes for selected date
  const selectedDateNotes = notes.filter(note => {
    const noteDate = new Date(note.createdAt);
    return noteDate.getDate() === selectedDate.getDate() &&
           noteDate.getMonth() === selectedDate.getMonth() &&
           noteDate.getFullYear() === selectedDate.getFullYear();
  });

  const hasNotesOnDay = (day: number) => {
    return notes.some(note => {
      const d = new Date(note.createdAt);
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });
  };

  const changeMonth = (offset: number) => {
    setSelectedDate(new Date(year, month + offset, 1));
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Calendar</h1>
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 rounded-full">
            <Icons.ChevronLeft size={20} />
          </button>
          <h2 className="font-semibold text-lg">
            {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 rounded-full rotate-180">
            <Icons.ChevronLeft size={20} />
          </button>
        </div>
        
        {/* Days Header */}
        <div className="grid grid-cols-7 text-center text-xs text-gray-400 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={i}>{d}</span>)}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const isSelected = day === selectedDate.getDate();
            const hasNote = hasNotesOnDay(day);

            return (
              <button
                key={day}
                onClick={() => setSelectedDate(new Date(year, month, day))}
                className={`
                  h-10 w-10 rounded-full flex items-center justify-center text-sm relative transition-all mx-auto
                  ${isSelected ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}
                  ${isToday && !isSelected ? 'text-blue-600 font-bold border border-blue-200' : ''}
                `}
              >
                {day}
                {hasNote && (
                  <span className={`absolute bottom-1.5 h-1 w-1 rounded-full ${isSelected ? 'bg-white' : 'bg-blue-500'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Notes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
          {selectedDate.toDateString() === new Date().toDateString() ? 'Today' : selectedDate.toLocaleDateString()}
        </h3>
        
        {selectedDateNotes.length === 0 ? (
          <div className="text-center text-gray-400 py-8 text-sm">
            No notes created on this day.
          </div>
        ) : (
          selectedDateNotes.map(note => (
            <div 
              key={note.id}
              onClick={() => navigate(`/note/${note.id}`)}
              className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3 active:scale-[0.99] transition-transform"
            >
              <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                <Icons.FileText size={18} />
              </div>
              <div className="overflow-hidden">
                <h4 className="font-medium text-gray-800 truncate">{note.title || "Untitled"}</h4>
                <p className="text-xs text-gray-500 truncate">{new Date(note.createdAt).toLocaleTimeString()}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CalendarView;