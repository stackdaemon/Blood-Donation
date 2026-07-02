import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { api, useAuth } from '../context/AuthContext';
import {
  Heart,
  Calendar,
  Clock,
  MapPin,
  Hospital,
  User,
  Mail,
  ArrowLeft,
  CheckCircle,
  FileText,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

const RequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRequestDetails = async () => {
    try {
      const response = await api.get(`/donations/${id}`);
      setRequest(response.data);
    } catch (err) {
      console.error('Error fetching donation request details:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to retrieve donation details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestDetails();
  }, [id]);

  const handleDonateConfirm = async () => {
    setActionLoading(true);
    try {
      await api.patch(`/donations/${id}/donate`);
      setModalOpen(false);
      // Refresh details to update state
      await fetchRequestDetails();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit donation response.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-rose-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (errorMsg || !request) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-white rounded-3xl p-6 border border-slate-100 shadow-xl text-center space-y-4">
            <div className="inline-flex p-4 bg-rose-50 rounded-full text-rose-500">
              <AlertCircle className="h-10 w-10" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Error Loading Request</h3>
            <p className="text-slate-500 text-sm">{errorMsg || 'Request not found.'}</p>
            <Link to="/blood-donation-requests" className="inline-flex items-center space-x-2 text-rose-500 font-semibold hover:text-rose-600">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Feed</span>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isOwner = user && user.email === request.requesterEmail;
  const isPending = request.status === 'pending';
  const showDonateButton = user && !isOwner && isPending;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        {/* Back Link */}
        <Link
          to="/blood-donation-requests"
          className="inline-flex items-center space-x-1.5 text-slate-500 hover:text-rose-500 text-sm font-semibold transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Requests Feed</span>
        </Link>

        {/* Content Card */}
        <div className="bg-white border border-slate-200/60 rounded-3xl shadow-xl shadow-slate-100/50 overflow-hidden">
          {/* Header Bar */}
          <div className="bg-slate-900 text-white px-6 py-6 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2.5">
                <span className={`h-2.5 w-2.5 rounded-full ${
                  request.status === 'pending' ? 'bg-amber-400' :
                  request.status === 'inprogress' ? 'bg-blue-400' : 'bg-emerald-400'
                }`}></span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Status: {request.status}
                </span>
              </div>
              <h2 className="text-xl font-bold">Request Details for {request.recipientName}</h2>
            </div>
            <span className="bg-rose-500 text-white text-base font-extrabold px-4.5 py-1.5 rounded-2xl shadow-md shadow-rose-500/20 shrink-0">
              Blood Type {request.bloodGroup}
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Logistics */}
              <div className="space-y-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Donation Details</h3>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3.5">
                    <div className="bg-rose-50 p-2.5 rounded-xl text-rose-500 shrink-0 mt-0.5">
                      <Hospital className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Hospital Name</h4>
                      <p className="text-sm font-bold text-slate-800">{request.hospitalName}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3.5">
                    <div className="bg-rose-50 p-2.5 rounded-xl text-rose-500 shrink-0 mt-0.5">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Hospital Address</h4>
                      <p className="text-sm font-medium text-slate-700">{request.fullAddress}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{request.recipientUpazila}, {request.recipientDistrict}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3.5">
                      <div className="bg-rose-50 p-2.5 rounded-xl text-rose-500 shrink-0 mt-0.5">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Date</h4>
                        <p className="text-sm font-bold text-slate-800">{request.donationDate}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3.5">
                      <div className="bg-rose-50 p-2.5 rounded-xl text-rose-500 shrink-0 mt-0.5">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Time</h4>
                        <p className="text-sm font-bold text-slate-800">{request.donationTime}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Contact & Message */}
              <div className="space-y-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Requester Info</h3>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3.5">
                    <div className="bg-slate-50 p-2.5 rounded-xl text-slate-500 shrink-0 mt-0.5">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Name</h4>
                      <p className="text-sm font-bold text-slate-800">{request.requesterName}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3.5">
                    <div className="bg-slate-50 p-2.5 rounded-xl text-slate-500 shrink-0 mt-0.5">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Email Address</h4>
                      <p className="text-sm font-semibold text-slate-700">{request.requesterEmail}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3.5">
                    <div className="bg-slate-50 p-2.5 rounded-xl text-slate-500 shrink-0 mt-0.5">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Message</h4>
                      <p className="text-sm text-slate-600 bg-slate-50 border border-slate-100 p-3 rounded-2xl leading-relaxed italic">
                        "{request.requestMessage}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Donor response log (if status not pending) */}
            {request.status !== 'pending' && request.donorInfo && request.donorInfo.name && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 flex items-start space-x-4">
                <div className="bg-emerald-500 p-2.5 rounded-2xl text-white shrink-0">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-emerald-800 text-base">Donor Responded</h4>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    This request has been accepted by volunteer donor <strong className="text-emerald-900">{request.donorInfo.name}</strong> (<span className="font-mono text-emerald-800">{request.donorInfo.email}</span>). The donation status is current scheduled or completed.
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {showDonateButton && (
              <div className="pt-4 flex justify-center">
                <button
                  onClick={() => setModalOpen(true)}
                  className="w-full sm:w-1/2 py-4 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-rose-500/25 active:scale-98 transition-all flex items-center justify-center space-x-2 text-sm"
                >
                  <Heart className="h-5 w-5 fill-white" />
                  <span>Donate Blood</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-in fade-in duration-200">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setModalOpen(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full relative z-10 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-rose-500 py-6 px-6 text-center text-white">
              <h3 className="text-lg font-bold">Confirm Donation</h3>
              <p className="text-rose-100 text-xs mt-0.5">Please confirm that you would like to volunteer as a donor.</p>
            </div>

            <div className="p-6 space-y-4">
              {/* Recipient summary */}
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-xs space-y-1">
                <div>Recipient: <strong className="text-slate-800">{request.recipientName}</strong></div>
                <div>Blood Group: <strong className="text-rose-500 font-bold">{request.bloodGroup}</strong></div>
                <div>Hospital: <strong className="text-slate-800">{request.hospitalName}</strong></div>
              </div>

              {/* Donor fields (Auto-filled read-only) */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Donor Name</label>
                  <input
                    type="text"
                    readOnly
                    value={user?.name || ''}
                    className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 font-semibold focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Donor Email</label>
                  <input
                    type="email"
                    readOnly
                    value={user?.email || ''}
                    className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 font-semibold focus:outline-none"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setModalOpen(false)}
                  disabled={actionLoading}
                  className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDonateConfirm}
                  disabled={actionLoading}
                  className="py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs shadow-md shadow-rose-500/10 transition-colors flex items-center justify-center"
                >
                  {actionLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <span>Confirm</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default RequestDetails;
