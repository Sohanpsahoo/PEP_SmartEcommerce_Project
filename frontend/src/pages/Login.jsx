import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiCpu, FiTrendingUp, FiEdit3, FiShield, FiCheckCircle } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-dark-900 overflow-hidden font-sans">
      
      {/* LEFT PANEL - Premium Showcase */}
      <div className="hidden lg:flex w-[55%] relative flex-col justify-between p-16 bg-dark-950 overflow-hidden border-r border-slate-800">
        
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-brand-600/20 rounded-full blur-[120px]" />
          <div className="absolute top-[40%] -right-[20%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[100px]" />
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
        </div>

        {/* Brand */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-500/20 border border-white/10">
            <FiCpu className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">SmartStore<span className="text-brand-400">.ai</span></span>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-xl my-auto py-12">
          <h1 className="text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
            Manage your store <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-purple-400 to-pink-400 animate-gradient">
              intelligently.
            </span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed mb-10">
            The all-in-one e-commerce dashboard powered by advanced AI. Automate your workflow, track revenue in real-time, and let data drive your growth.
          </p>

          {/* Feature Grid to fill space beautifully */}
          <div className="grid grid-cols-2 gap-6">
            <div className="glass p-5 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md">
              <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center mb-4">
                <FiTrendingUp className="w-5 h-5 text-brand-400" />
              </div>
              <h3 className="text-white font-semibold mb-1">AI Sales Insights</h3>
              <p className="text-sm text-slate-400">Real-time pricing & trend analysis</p>
            </div>
            <div className="glass p-5 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                <FiEdit3 className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-white font-semibold mb-1">Smart Copywriting</h3>
              <p className="text-sm text-slate-400">Auto-generate SEO descriptions</p>
            </div>
            <div className="glass p-5 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                <FiCheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-white font-semibold mb-1">Inventory Sync</h3>
              <p className="text-sm text-slate-400">Automated low-stock alerts</p>
            </div>
             <div className="glass p-5 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                <FiShield className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold mb-1">Bank-Grade Security</h3>
              <p className="text-sm text-slate-400">Your store data is fully encrypted</p>
            </div>
          </div>
        </div>

        {/* Footer / Social Proof */}
        <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-8 mt-8">
          <div className="flex -space-x-3">
            <img className="w-10 h-10 rounded-full border-2 border-dark-950" src="https://i.pravatar.cc/100?img=1" alt="User" />
            <img className="w-10 h-10 rounded-full border-2 border-dark-950" src="https://i.pravatar.cc/100?img=2" alt="User" />
            <img className="w-10 h-10 rounded-full border-2 border-dark-950" src="https://i.pravatar.cc/100?img=3" alt="User" />
            <div className="w-10 h-10 rounded-full border-2 border-dark-950 bg-dark-800 flex items-center justify-center text-xs font-bold text-white">+2k</div>
          </div>
          <p className="text-sm text-slate-500 font-medium">Trusted by top sellers worldwide</p>
        </div>
      </div>

      {/* RIGHT PANEL - Auth Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 sm:p-12 relative bg-dark-900">
        
        {/* Mobile Logo (visible only on small screens) */}
        <div className="lg:hidden absolute top-8 left-8 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
            <FiCpu className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white">SmartStore AI</span>
        </div>

        <div className="w-full max-w-[420px]">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white mb-3">Welcome Back</h2>
            <p className="text-slate-400">Enter your credentials to access your dashboard.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium flex items-center gap-2 animate-[fadeIn_0.3s_ease-out]">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                {error}
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-dark-800 border border-slate-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 text-white placeholder-slate-500 transition-all shadow-sm"
                placeholder="admin@smartstore.com"
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-dark-800 border border-slate-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 text-white placeholder-slate-500 transition-all shadow-sm"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-2 pb-6 px-1 text-sm">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" className="peer appearance-none w-5 h-5 border border-slate-600 rounded-md bg-dark-800 checked:bg-brand-500 checked:border-brand-500 transition-all cursor-pointer" />
                  <FiCheckCircle className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                </div>
                <span className="text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-4 bg-white text-dark-900 hover:bg-slate-100 rounded-2xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-dark-900/30 border-t-dark-900 rounded-full animate-spin" />
                  Signing In...
                </>
              ) : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-10 text-center">
            <p className="text-slate-400 text-sm">
              Don't have an admin account?{' '}
              <Link to="/signup" className="text-white hover:text-brand-400 font-semibold transition-colors border-b border-transparent hover:border-brand-400 pb-0.5">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
