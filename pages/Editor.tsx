import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Note, EditorMode } from '../types';
import { getNotes, saveNote, deleteNote } from '../services/storageService';
import { enhanceText } from '../services/geminiService';
import { Icons } from '../components/Icon';
import { DEFAULT_NOTE_CONTENT } from '../constants';

const Editor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | null>(null);
  const [mode, setMode] = useState<EditorMode>('edit');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (id === 'new') {
      const newNote: Note = {
        id: crypto.randomUUID(),
        title: '',
        content: DEFAULT_NOTE_CONTENT,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setNote(newNote);
    } else {
      const notes = getNotes();
      const found = notes.find(n => n.id === id);
      if (found) {
        setNote(found);
      } else {
        navigate('/');
      }
    }
  }, [id, navigate]);

  const handleSave = () => {
    if (note) {
      // Extract first line as title
      const lines = note.content.split('\n');
      const title = lines[0]?.replace(/^#+\s*/, '').trim() || 'Untitled Note';
      const updatedNote = { ...note, title, updatedAt: Date.now() };
      saveNote(updatedNote);
      setNote(updatedNote);
    }
  };

  const handleBack = () => {
    handleSave();
    navigate(-1);
  };

  const handleDelete = () => {
    if (note && window.confirm("Are you sure you want to delete this note?")) {
      deleteNote(note.id);
      navigate('/');
    }
  };

  const handleExportHtml = () => {
    if (!note) return;
    const element = document.createElement("a");
    const file = new Blob([note.content], {type: 'text/html'});
    element.href = URL.createObjectURL(file);
    element.download = `${note.title || 'note'}.html`;
    document.body.appendChild(element);
    element.click();
    setShowMenu(false);
  };

  const handlePrintPdf = () => {
    setShowMenu(false);
    setMode('preview');
    setTimeout(() => {
        window.print();
    }, 500);
  };

  const handleAiEnhance = async (type: 'summarize' | 'grammar' | 'continue') => {
    if (!note) return;
    setIsAiLoading(true);
    setShowMenu(false);
    try {
      const result = await enhanceText(note.content, type);
      if (type === 'summarize') {
        alert(`Summary:\n\n${result}`);
      } else {
        setNote({ ...note, content: type === 'continue' ? note.content + '\n\n' + result : result });
      }
    } catch (e) {
      alert("AI Service unavailable. Check API Key.");
    } finally {
      setIsAiLoading(false);
    }
  };

  if (!note) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white shadow-sm z-20 no-print pt-safe top-0 sticky">
        <button onClick={handleBack} className="p-2 -ml-2 text-gray-600 rounded-full hover:bg-gray-100">
          <Icons.ChevronLeft size={24} />
        </button>
        
        <div className="flex bg-gray-100 p-1 rounded-lg">
           <button 
             onClick={() => setMode('edit')}
             className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${mode === 'edit' ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}
           >
             Edit
           </button>
           <button 
             onClick={() => setMode('preview')}
             className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${mode === 'preview' ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}
           >
             View
           </button>
        </div>

        <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="p-2 -mr-2 text-gray-600 rounded-full hover:bg-gray-100">
                <Icons.MoreVertical size={24} />
            </button>
            
            {showMenu && (
                <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
                    <button onClick={handleExportHtml} className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700">
                        <Icons.Download size={16} /> Export HTML
                    </button>
                    <button onClick={handlePrintPdf} className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700">
                        <Icons.Share size={16} /> Print / PDF
                    </button>
                    <div className="h-px bg-gray-100 my-1"></div>
                     <button onClick={() => handleAiEnhance('grammar')} className="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center gap-2 text-sm text-blue-600">
                        <Icons.Wand2 size={16} /> Fix Grammar (AI)
                    </button>
                    <button onClick={() => handleAiEnhance('continue')} className="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center gap-2 text-sm text-blue-600">
                        <Icons.PenLine size={16} /> Continue Writing (AI)
                    </button>
                    <div className="h-px bg-gray-100 my-1"></div>
                    <button onClick={handleDelete} className="w-full text-left px-4 py-3 hover:bg-red-50 flex items-center gap-2 text-sm text-red-600">
                        <Icons.Trash2 size={16} /> Delete Note
                    </button>
                </div>
            )}
        </div>
      </div>

      {/* Editor / Preview Area */}
      <div className="flex-1 overflow-hidden relative">
        {isAiLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-30 flex items-center justify-center flex-col gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="text-sm font-medium text-blue-600">AI is thinking...</span>
            </div>
        )}
        
        {mode === 'edit' ? (
          <textarea
            ref={textareaRef}
            className="w-full h-full p-6 resize-none focus:outline-none text-base leading-relaxed text-gray-800"
            value={note.content}
            onChange={(e) => setNote({ ...note, content: e.target.value })}
            placeholder="Start typing..."
          />
        ) : (
          <div className="prose prose-blue p-6 max-w-none overflow-y-auto h-full pb-20 print-only">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {note.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;