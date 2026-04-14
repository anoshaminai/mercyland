import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Header from './components/Header';
import InfoPage from './pages/InfoPage';
import ListenPage from './pages/ListenPage';
import WatchPage from './pages/WatchPage';
import { VoidPage } from './pages/void-page';

const StandardLayout = () => (
  <div className="app">
    <Header />
    <Outlet />
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/void" element={<VoidPage />} />
        <Route element={<StandardLayout />}>
          <Route path="/" element={<InfoPage />} />
          <Route path="/listen" element={<ListenPage />} />
          <Route path="/watch" element={<WatchPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
