import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  User,
  PlusCircle,
  ClipboardList,
  Users,
  Heart,
  LogOut,
  Home,
  Menu,
  HeartHandshake
} from 'lucide-react';

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  const links = [
    {
      name: 'Dashboard Home',
      path: '/dashboard',
      icon: LayoutDashboard,
      roles: ['donor', 'volunteer', 'admin'],
      end: true
    },
    {
      name: 'My Profile',
      path: '/dashboard/profile',
      icon: User,
      roles: ['donor', 'volunteer', 'admin']
    },
    // Donor specific
    {
      name: 'Create Request',
      path: '/dashboard/create-donation-request',
      icon: PlusCircle,
      roles: ['donor']
    },
    {
      name: 'My Requests',
      path: '/dashboard/my-donation-requests',
      icon: ClipboardList,
      roles: ['donor']
    },
    // Admin specific
    {
      name: 'All Users',
      path: '/dashboard/all-users',
      icon: Users,
      roles: ['admin']
    },
    // Admin & Volunteer
    {
      name: 'All Requests',
      path: '/dashboard/all-blood-donation-request',
      icon: HeartHandshake,
      roles: ['admin', 'volunteer']
    }
  ];

  const filteredLinks = links.filter(link => link.roles.includes(user.role));

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300">
      {/* Sidebar Header / Logo */}
      <div className="flex items-center space-x-2 px-6 py-5 border-b border-slate-800">
        <div className="bg-rose-500 p-1.5 rounded-lg text-white">
          <Heart className="h-5 w-5 fill-white" />
        </div>
        <span className="font-extrabold text-lg tracking-wider text-white">
          BloodLink
        </span>
        <span className="text-[10px] bg-rose-500/10 text-rose-400 font-bold px-2 py-0.5 rounded-full border border-rose-500/20 uppercase tracking-widest">
          {user.role}
        </span>
      </div>

      {/* User Info Card */}
      <div className="px-6 py-5 border-b border-slate-800 flex items-center space-x-3 bg-slate-950/40">
        <img
          src={user.avatar}
          alt={user.name}
          className="h-10 w-10 rounded-full object-cover border-2 border-rose-500/20 shadow-sm"
        />
        <div className="overflow-hidden">
          <h4 className="font-semibold text-white text-sm truncate">{user.name}</h4>
          <p className="text-xs text-slate-500 truncate">{user.email}</p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {filteredLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.end}
              onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar Footer Controls */}
      <div className="p-4 border-t border-slate-800 space-y-1">
        <button
          onClick={() => {
            if (setIsMobileOpen) setIsMobileOpen(false);
            navigate('/');
          }}
          className="flex w-full items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all duration-150"
        >
          <Home className="h-4 w-4" />
          <span>Back to Home</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex w-full items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 transition-all duration-150"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 border-r border-slate-800 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar (Slide drawer) */}
      {isMobileOpen && (
        <div className="fixed inset-0 flex z-40 lg:hidden animate-in fade-in duration-200">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          ></div>

          {/* Drawer content */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900 animate-in slide-in-from-left duration-250">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
