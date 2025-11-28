import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CalendarView from './pages/CalendarView';
import Editor from './pages/Editor';
import NavBar from './components/NavBar';

const App: React.FC = () => {
  return (
    <Router>
        <div className="h-full w-full flex flex-col">
            <div className="flex-1 overflow-hidden relative">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/calendar" element={<CalendarView />} />
                    <Route path="/note/:id" element={<Editor />} />
                </Routes>
            </div>
            <NavBar />
        </div>
    </Router>
  );
};

export default App;