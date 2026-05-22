import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiGrid, FiBox, FiTrendingUp, FiLogOut, FiUser, FiShoppingBag, FiDollarSign, FiCpu } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FiGrid className="w-5 h-5" /> },
    { name: 'Orders', path: '/orders', icon: <FiShoppingBag className="w-5 h-5" /> },
    { name: 'Revenue', path: '/revenue', icon: <FiDollarSign className="w-5 h-5" /> },
    { name: 'Products', path: '/products', icon: <FiBox className="w-5 h-5" /> },
    { name: 'Insights', path: '/insights', icon: <FiCpu className="w-5 h-5" /> },
    { name: 'Profile', path: '/profile', icon: <FiUser className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 bg-dark-800 border-r border-slate-700/50 flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-brand-500 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
          <FiTrendingUp className="text-brand-500" />
          SmartStore
        </h2>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <FiLogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
