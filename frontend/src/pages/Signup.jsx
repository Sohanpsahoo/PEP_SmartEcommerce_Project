import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signup(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 p-4">
      <div className="glass p-8 rounded-2xl w-full max-w-md shadow-2xl shadow-brand-500/20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-500 to-purple-400 bg-clip-text text-transparent">
            SmartStore AI
          </h1>
          <p className="text-slate-400 mt-2">Admin Registration</p>
        </div>
        
        <form onSubmit={handleSignup} className="space-y-5">
          {error && <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg text-sm text-center">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-dark-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-white transition-all"
              placeholder="Store Owner"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-dark-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-white transition-all"
              placeholder="admin@smartstore.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-dark-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-white transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-brand-500/30 mt-2"
          >
            Create Admin Account
          </button>
        </form>
        
        <p className="mt-6 text-center text-slate-400 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 transition-colors">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
