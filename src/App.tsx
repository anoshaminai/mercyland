import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Header from './components/Header';
import { VoidPage } from './pages/void-page';
import { FlatPage } from './pages/FlatPage';
import { GatePage } from './pages/gate-page';
import { ChatWorldPage } from './pages/chat-world-page';
import { ExplorePage } from './pages/explore-page';
import { WorldPage } from './pages/world-page';
import { HomeRedirect } from './components/HomeRedirect';
import { ScrollToHash } from './components/ScrollToHash';

// One app-level layout: the shared Header (a fixed overlay) renders once, above every route
// (nav_header.md — "mount once, not per-page"). Full-bleed experiences (/void, /chat-world)
// keep their own layout; the header simply floats on top, the same way VoidNav used to.
const Layout = () => (
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
        <Route element={<Layout />}>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/world" element={<WorldPage />} />
          <Route path="/flat" element={<FlatPage />} />
          <Route path="/void" element={<VoidPage />} />
          <Route path="/gate" element={<GatePage />} />
          <Route path="/chat-world" element={<ChatWorldPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
