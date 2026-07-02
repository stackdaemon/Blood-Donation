import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { api } from '../context/AuthContext';
import { Heart, Calendar, Clock, MapPin, Hospital, Inbox, Eye } from 'lucide-react';

const DonationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // Fetch only pending requests
        const response = await api.get('/donations', {
          params: { status: 'pending', limit: 100 }
        });
        setRequests(response.data.requests || []);
      } catch (err) {
        console.error('Failed to load pending requests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Page Header */}
        <div className="text-center max-w-md mx-auto space-y-2">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-rose-50 border border-rose-100 text-rose-500 text-xs font-bold uppercase tracking-wider rounded-full">
            <Heart className="h-3 w-3 fill-rose-500" />
            <span>Active requests</span>
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Donation Requests</h1>
          <p className="text-slate-500 text-sm">Review pending blood requests and click details to volunteer.</p>
        </div>

        {/* Requests Feed List */}
        <div>
          {loading ? (
            <div className="py-20 flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-rose-500"></div>
            </div>
          ) : requests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.map((req) => (
                <div
                  key={req._id}
                  className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/35 transform hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Blood Group Badge Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="h-2 w-2 bg-rose-500 rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Urgent Support</span>
                      </div>
                      <span className="bg-rose-50 border border-rose-100 text-rose-600 font-extrabold text-sm px-3.5 py-1 rounded-xl">
                        {req.bloodGroup}
                      </span>
                    </div>

                    {/* Recipient details */}
                    <div className="space-y-1">
                      <h3 className="font-bold text-slate-800 text-lg leading-snug">{req.recipientName}</h3>
                      <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                        <span>{req.recipientUpazila}, {req.recipientDistrict}</span>
                      </div>
                    </div>

                    <div className="h-[1px] bg-slate-100"></div>

                    {/* Logistics */}
                    <div className="space-y-2 text-xs text-slate-500">
                      <div className="flex items-center space-x-2">
                        <Hospital className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="truncate font-medium text-slate-700">{req.hospitalName}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                          <span>{req.donationDate}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                          <span>{req.donationTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => navigate(`/donation-request/${req._id}`)}
                      className="w-full py-3 bg-slate-100 hover:bg-rose-500 hover:text-white text-slate-700 font-semibold rounded-2xl active:scale-98 transition-all flex items-center justify-center space-x-2 text-xs"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-100 rounded-3xl py-16 px-4 text-center space-y-3">
              <div className="inline-flex p-4 bg-slate-50 rounded-full text-slate-300">
                <Inbox className="h-10 w-10" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">No Pending Requests</h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto">
                There are currently no pending blood donation requests. Check back later.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DonationRequests;
