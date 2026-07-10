import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { LogIn, Mail, Key } from 'lucide-react';
import { showSuccessToast, showErrorToast } from '../utils/alert';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Redirect page after login
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      showErrorToast('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      showSuccessToast('Welcome back! Login successful.');
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password.');
      showErrorToast(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-100/80 border border-slate-100 overflow-hidden">
          {/* Card Header */}
          <div className="bg-rose-500 py-8 px-6 text-center text-white relative">
            <div className="absolute right-4 top-4 bg-white/10 p-2 rounded-xl text-white">
              <LogIn className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold">Sign In</h2>
            <p className="text-rose-100 text-sm mt-1">Welcome back. Enter your credentials to access your dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {errorMsg && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl p-4 text-sm font-medium animate-shake">
                {errorMsg}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Mail className="h-4.5 w-4.5" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/80 focus:border-rose-500 focus:bg-white focus:outline-none rounded-2xl text-sm transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Key className="h-4.5 w-4.5" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/80 focus:border-rose-500 focus:bg-white focus:outline-none rounded-2xl text-sm transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-rose-500/20 active:scale-98 transition-all duration-150 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>

            {/* Test Credentials Helper Panel */}
            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Development Demo Accounts</h4>
              <div className="grid grid-cols-1 gap-1 text-[11px] text-slate-500">
                <div>🔑 <strong className="text-slate-700">Admin:</strong> <span className="font-mono">admin@blood.com</span> / <span className="font-mono">password123</span></div>
                <div>🔑 <strong className="text-slate-700">Volunteer:</strong> <span className="font-mono">volunteer@blood.com</span> / <span className="font-mono">password123</span></div>
                <div>🔑 <strong className="text-slate-700">Donor:</strong> <span className="font-mono">donor1@blood.com</span> / <span className="font-mono">password123</span></div>
              </div>
            </div>

            <div className="text-center text-sm text-slate-500 pt-2">
              Don't have an account yet?{' '}
              <Link to="/register" className="text-rose-500 font-semibold hover:text-rose-600">
                Register
              </Link>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
