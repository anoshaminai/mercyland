import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Header from './components/Header';
import { VoidPage } from './pages/void-page';
import { FlatPage } from './pages/FlatPage';
import { GatePage } from './pages/gate-page';
import { ChatWorldPage } from './pages/chat-world-page';
import { ExplorePage } from './pages/explore-page';
import { HomeRedirect } from './components/HomeRedirect';
import { ScrollToHash } from './components/ScrollToHash';

const StandardLayout = () => (
  <div className="app">
    <Header />
    <Outlet />
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <Routes>
        <Route path="/void" element={<VoidPage />} />
        <Route path="/gate" element={<GatePage />} />
        <Route path="/chat-world" element={<ChatWorldPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route element={<StandardLayout />}>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/flat" element={<FlatPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
