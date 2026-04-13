import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import InfoPage from './pages/InfoPage';
import ListenPage from './pages/ListenPage';
import WatchPage from './pages/WatchPage';

const App = () => {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<InfoPage />} />
          <Route path="/listen" element={<ListenPage />} />
          <Route path="/watch" element={<WatchPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
