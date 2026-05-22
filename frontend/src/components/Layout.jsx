import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import AIChatWidget from './AIChatWidget';

const Layout = () => {
  return (
    <div className="min-h-screen bg-dark-900 text-slate-100 font-sans flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
      <AIChatWidget />
    </div>
  );
};

export default Layout;
