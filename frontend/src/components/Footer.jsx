import React from 'react';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Brand Description */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-rose-500 p-2 rounded-xl text-white">
                <Heart className="h-5 w-5 fill-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                BloodLink
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm">
              Connecting blood donors with seekers instantly. Build a community that saves lives, one donation at a time. Join us today.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-rose-500 transition-colors">Home</a></li>
              <li><a href="/search" className="hover:text-rose-500 transition-colors">Search Donors</a></li>
              <li><a href="/blood-donation-requests" className="hover:text-rose-500 transition-colors">Requests Feed</a></li>
              <li><a href="/funding" className="hover:text-rose-500 transition-colors">Funding Support</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Contact Info</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-rose-500" />
                <span>+880 1863431747</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-rose-500" />
                <span>mdrifathasan5127@gmail.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-rose-500" />
                <span>Rajshahi, Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="h-[1px] bg-slate-800 my-8"></div>

        <div className="flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} BloodLink Platform. All rights reserved.</p>
          <p className="flex items-center mt-2 md:mt-0">
            Made with <Heart className="h-3 w-3 mx-1 text-rose-500 fill-rose-500" /> in Bangladesh
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
