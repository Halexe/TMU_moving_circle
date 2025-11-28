
import React from 'react';
import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';
import TheoryPage from './pages/TheoryPage';
import OperationPage from './pages/OperationPage';
import StatsPage from './pages/StatsPage';
import { BookOpen, MapPin, BarChart2 } from 'lucide-react';

const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300 ${
          isActive
            ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]'
            : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
        }`
      }
    >
      <Icon size={18} />
      <span className="font-medium tracking-wide hidden sm:inline">{label}</span>
    </NavLink>
  );
};

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center font-bold text-white shadow-lg shadow-red-900/20">
              TMU
            </div>
            <span className="font-bold text-lg tracking-tighter hidden sm:block">
              PROJECT: <span className="text-red-500">MOVING</span>
            </span>
          </div>
          
          <nav className="flex items-center gap-2">
            <NavItem to="/" icon={BookOpen} label="理論背景" />
            <NavItem to="/operation" icon={MapPin} label="作戦本部" />
            <NavItem to="/stats" icon={BarChart2} label="戦術データ" />
          </nav>
        </div>
      </header>
  );
}

const Layout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-200 selection:bg-red-900 selection:text-white">
      <Header />

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-neutral-600 text-sm">
          <p>© 2024 TMU Student Underground Moving Committee.</p>
          <p className="mt-2 text-xs">
            本サイトはパロディプロジェクトです。許可なく実際に建物を押す行為はお控えください。<br/>
            This is a parody project. Please do not actually attempt to push buildings without proper permits.
          </p>
        </div>
      </footer>
    </div>
  );
};

const App = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<TheoryPage />} />
          <Route path="/operation" element={<OperationPage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;