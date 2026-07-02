import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { api } from '../context/AuthContext';
import { LOCATION_DATA } from './Register';
import { Search as SearchIcon, Droplet, MapPin, Inbox, Mail } from 'lucide-react';

const Search = () => {
  const [bloodGroup, setBloodGroup] = useState('');
  const [district, setDistrict] = useState('');
  const [upazila, setUpazila] = useState('');
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setSearched(true);

    try {
      const params = {};
      if (bloodGroup) params.bloodGroup = bloodGroup;
      if (district) params.district = district;
      if (upazila) params.upazila = upazila;

      const response = await api.get('/users/search', { params });
      setDonors(response.data);
    } catch (err) {
      console.error('Search request error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Trigger search on mount to load initial list of active donors (optional or default)
  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Page Header */}
        <div className="text-center max-w-md mx-auto space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Search Donors</h1>
          <p className="text-slate-500 text-sm">Find compatible blood donors in your city or neighborhood quickly.</p>
        </div>

        {/* Filter Form Panel */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-md shadow-slate-100/50">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* Blood Group Select */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Blood Group</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-rose-500">
                  <Droplet className="h-4.5 w-4.5 fill-rose-500" />
                </span>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 focus:border-rose-500 focus:bg-white focus:outline-none rounded-2xl text-sm transition-all appearance-none cursor-pointer text-slate-700 font-semibold"
                >
                  <option value="">All Groups</option>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((grp) => (
                    <option key={grp} value={grp}>{grp}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* District Select */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">District</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <MapPin className="h-4.5 w-4.5" />
                </span>
                <select
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    setUpazila('');
                  }}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 focus:border-rose-500 focus:bg-white focus:outline-none rounded-2xl text-sm transition-all appearance-none cursor-pointer text-slate-700"
                >
                  <option value="">All Districts</option>
                  {Object.keys(LOCATION_DATA).map((dist) => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Upazila Select */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Upazila</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <MapPin className="h-4.5 w-4.5" />
                </span>
                <select
                  disabled={!district}
                  value={upazila}
                  onChange={(e) => setUpazila(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 focus:border-rose-500 focus:bg-white focus:outline-none rounded-2xl text-sm transition-all appearance-none cursor-pointer text-slate-700 disabled:opacity-50"
                >
                  <option value="">All Upazilas</option>
                  {district && LOCATION_DATA[district].map((upz) => (
                    <option key={upz} value={upz}>{upz}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl shadow-md shadow-rose-500/10 active:scale-98 transition-all flex items-center justify-center space-x-2 text-sm"
            >
              <SearchIcon className="h-4.5 w-4.5" />
              <span>Search</span>
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div>
          {loading ? (
            <div className="py-20 flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-rose-500"></div>
            </div>
          ) : donors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {donors.map((donor) => (
                <div
                  key={donor._id}
                  className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm hover:shadow-xl hover:shadow-slate-200/30 transform hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between">
                    <img
                      src={donor.avatar}
                      alt={donor.name}
                      className="h-14 w-14 rounded-full object-cover border-2 border-slate-50 shadow-sm"
                    />
                    <span className="inline-block bg-rose-50 border border-rose-100 text-rose-500 text-xs font-extrabold px-3 py-1 rounded-xl">
                      {donor.bloodGroup}
                    </span>
                  </div>

                  <div className="mt-4 space-y-1">
                    <h3 className="font-bold text-slate-800 text-base">{donor.name}</h3>
                    <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span>{donor.upazila}, {donor.district}</span>
                    </div>
                  </div>

                  <div className="h-[1px] bg-slate-100 my-4"></div>

                  <div className="flex items-center space-x-2 text-xs text-slate-500">
                    <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{donor.email}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : searched ? (
            <div className="bg-white border border-slate-100 rounded-3xl py-16 px-4 text-center space-y-3">
              <div className="inline-flex p-4 bg-slate-50 rounded-full text-slate-300">
                <Inbox className="h-10 w-10" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">No Match Found</h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto">
                No active donors match your search parameters. Try expanding your location filters.
              </p>
            </div>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Search;
