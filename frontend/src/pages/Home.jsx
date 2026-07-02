import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Heart, Search, Users, ShieldAlert, Award, Star, Mail, Phone, MapPin, CheckCircle } from 'lucide-react';

const Home = () => {
  const stats = [
    { label: 'Active Donors', value: '450+', icon: Users, color: 'text-rose-500 bg-rose-50' },
    { label: 'Lives Impacted', value: '1,200+', icon: Heart, color: 'text-emerald-500 bg-emerald-50' },
    { label: 'Verified Locations', value: '24 Upazilas', icon: MapPin, color: 'text-blue-500 bg-blue-50' },
    { label: 'Safety Verified', value: '100%', icon: Award, color: 'text-amber-500 bg-amber-50' }
  ];

  const features = [
    {
      title: 'Quick Match',
      desc: 'Our advanced database matches matching blood groups in your local upazila instantly.',
      icon: Search
    },
    {
      title: 'Secure Accounts',
      desc: 'All donor contact details and requests are encrypted using industry standard protocols.',
      icon: Award
    },
    {
      title: 'Role Authorization',
      desc: 'Separate workflows for Donors, Volunteers, and Admins to ensure donation processing efficiency.',
      icon: Star
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8">
        {/* Background blobs for premium decoration */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-rose-500/10 text-rose-400 text-xs font-bold uppercase tracking-wider rounded-full border border-rose-500/20">
              <Heart className="h-3 w-3 fill-rose-400" />
              <span>Save lives today</span>
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              A Single Drop of Blood <br />
              <span className="bg-gradient-to-r from-rose-500 to-rose-400 bg-clip-text text-transparent">
                Can Save a Soul
              </span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0">
              Join BloodLink and become part of a nationwide network of heroes. Connect instantly with seekers, respond to emergencies, or request assistance in seconds.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 bg-rose-500 hover:bg-rose-600 text-white text-center font-bold rounded-2xl shadow-lg shadow-rose-500/20 hover:shadow-rose-500/30 transform hover:-translate-y-0.5 transition-all duration-150"
              >
                Join as Donor
              </Link>
              <Link
                to="/search"
                className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-100 text-center font-bold rounded-2xl border border-slate-700 hover:border-slate-600 transition-all flex items-center justify-center space-x-2"
              >
                <Search className="h-5 w-5 text-slate-400" />
                <span>Search Donors</span>
              </Link>
            </div>
          </div>

          <div className="hidden lg:block relative justify-self-center">
            {/* Visual illustration / stock style card representing donor matches */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative max-w-md w-full overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Live Requests Feed</span>
                </div>
                <Link to="/blood-donation-requests" className="text-xs text-rose-400 hover:text-rose-300 font-semibold">View All</Link>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 flex items-start space-x-3">
                  <div className="bg-rose-500/10 text-rose-400 p-2 rounded-xl font-bold text-sm shrink-0 border border-rose-500/20">
                    O+
                  </div>
                  <div className="text-xs space-y-1">
                    <h4 className="font-bold text-slate-100">Urgent: United Hospital</h4>
                    <p className="text-slate-400">Dhaka, Gulshan • Date: Emergency</p>
                    <p className="text-slate-500 italic mt-1">"Bypass surgery scheduled."</p>
                  </div>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 flex items-start space-x-3 opacity-60">
                  <div className="bg-rose-500/10 text-rose-400 p-2 rounded-xl font-bold text-sm shrink-0 border border-rose-500/20">
                    A-
                  </div>
                  <div className="text-xs space-y-1">
                    <h4 className="font-bold text-slate-100">National Heart Foundation</h4>
                    <p className="text-slate-400">Dhaka, Mirpur</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-3 sm:space-y-0 sm:space-x-4 p-4">
                  <div className={`p-3.5 rounded-2xl ${stat.color} shrink-0`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold text-slate-900">{stat.value}</h3>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">How It Works</h2>
            <p className="text-slate-500 text-sm">
              We leverage modern technology to streamline donation management, making matching quick and reliable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-md shadow-slate-100/50 hover:shadow-xl hover:shadow-slate-200/40 hover:-translate-y-1 transition-all duration-200 space-y-4">
                  <div className="inline-flex p-3.5 bg-rose-50 rounded-2xl text-rose-500">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{feature.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Get in Touch with Us</h2>
            <p className="text-slate-500 text-sm leading-relaxed max-w-lg">
              Have questions, issues, or feedback about the BloodLink platform? Fill out this contact form, or connect with our support helpline immediately.
            </p>
            <div className="space-y-4 pt-2">
              <div className="flex items-center space-x-3.5">
                <div className="bg-rose-50 p-2.5 rounded-xl text-rose-500">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Helpline (24/7)</h4>
                  <p className="text-sm font-bold text-slate-800">+880 1234 567890</p>
                </div>
              </div>

              <div className="flex items-center space-x-3.5">
                <div className="bg-rose-50 p-2.5 rounded-xl text-rose-500">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Us</h4>
                  <p className="text-sm font-bold text-slate-800">support@bloodlink.org</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-inner">
            <form onSubmit={(e) => { e.preventDefault(); alert("Message sent! We'll reply shortly."); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-rose-500 focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="Your Email"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-rose-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Message</label>
                <textarea
                  required
                  rows="3"
                  placeholder="How can we help you?"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-rose-500 focus:outline-none transition-colors resize-none"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-md shadow-rose-500/10 active:scale-98 transition-all text-sm"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
