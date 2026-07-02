import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Menu, X, LogIn, User, LogOut, LayoutDashboard, Coins } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Search Donors', path: '/search' },
    { name: 'Donation Requests', path: '/blood-donation-requests' },
    { name: 'Funding', path: '/funding' },
  ];

  return (
    <nav className="glass sticky top-0 z-50 border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-rose-500 p-2 rounded-xl text-white group-hover:scale-105 transition-transform duration-200 shadow-md shadow-rose-500/20">
              <Heart className="h-6 w-6 fill-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-rose-600 to-rose-500 bg-clip-text text-transparent">
              BloodLink
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-slate-600 hover:text-rose-500 font-medium text-sm transition-colors duration-150"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Controls */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1 text-slate-700 hover:text-rose-500 font-medium text-sm transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <div className="h-6 w-[1px] bg-slate-200"></div>
                <div className="flex items-center space-x-2 group cursor-pointer" onClick={() => navigate('/dashboard/profile')}>
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-9 w-9 rounded-full object-cover border-2 border-rose-100 group-hover:border-rose-300 transition-colors shadow-sm"
                  />
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all duration-150"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="flex items-center space-x-1.5 text-slate-700 hover:text-slate-900 font-medium text-sm px-4 py-2 rounded-xl hover:bg-slate-100 transition-all duration-150"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className="bg-rose-500 hover:bg-rose-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-md shadow-rose-500/20 hover:shadow-rose-500/30 transform hover:-translate-y-0.5 transition-all duration-150"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass border-t border-slate-200/50 px-2 pt-2 pb-4 space-y-1 shadow-inner animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 rounded-xl text-base font-medium text-slate-600 hover:text-rose-500 hover:bg-rose-50/50 transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <div className="h-[1px] bg-slate-200/60 my-2 mx-4"></div>
          {user ? (
            <div className="space-y-1">
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-2 px-4 py-3 rounded-xl text-base font-medium text-slate-600 hover:text-rose-500 hover:bg-rose-50/50 transition-colors"
              >
                <LayoutDashboard className="h-5 w-5 text-slate-400" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/dashboard/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-2 px-4 py-3 rounded-xl text-base font-medium text-slate-600 hover:text-rose-500 hover:bg-rose-50/50 transition-colors"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-6 w-6 rounded-full object-cover"
                />
                <span>Profile ({user.name})</span>
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center space-x-2 px-4 py-3 rounded-xl text-base font-medium text-rose-500 hover:bg-rose-50/50 transition-colors text-left"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 px-4 pt-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center space-x-1 text-slate-700 hover:bg-slate-100 font-semibold px-4 py-2.5 rounded-xl border border-slate-200 transition-colors text-sm"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center bg-rose-500 hover:bg-rose-600 text-white font-semibold px-4 py-2.5 rounded-xl text-sm shadow-md shadow-rose-500/10"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
