import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Header from './components/Header';
import { VoidPage } from './pages/void-page';
import { FlatPage } from './pages/FlatPage';
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
