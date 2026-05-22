import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Note: we could fetch the user profile here, but for now we'll just set it on login
    } else {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      throw err.response?.data?.message || 'Login failed';
    }
  };

  const signup = async (name, email, password) => {
    try {
      const res = await axios.post('/api/auth/signup', { name, email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      throw err.response?.data?.message || 'Signup failed';
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
