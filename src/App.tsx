import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import InfoPage from './pages/InfoPage';
import ListenPage from './pages/ListenPage';
// import WatchPage from './pages/WatchPage';
import WatchPageUnder from './pages/WatchPage_vid under';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<InfoPage />} />
          <Route path="/listen" element={<ListenPage />} />
          <Route path="/watch" element={<WatchPageUnder />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
