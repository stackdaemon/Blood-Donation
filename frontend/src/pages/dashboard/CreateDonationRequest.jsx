import React, { useState } from 'react';
import { useAuth, api } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LOCATION_DATA } from '../Register';
import {
  PlusCircle,
  User,
  Mail,
  Heart,
  MapPin,
  Hospital,
  Calendar,
  Clock,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Droplet
} from 'lucide-react';
import { showSuccessToast, showErrorToast } from '../../utils/alert';

const CreateDonationRequest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientDistrict: '',
    recipientUpazila: '',
    hospitalName: '',
    fullAddress: '',
    bloodGroup: user?.bloodGroup || 'A+',
    donationDate: '',
    donationTime: '',
    requestMessage: ''
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'recipientDistrict') {
        updated.recipientUpazila = '';
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const {
      recipientName,
      recipientDistrict,
      recipientUpazila,
      hospitalName,
      fullAddress,
      bloodGroup,
      donationDate,
      donationTime,
      requestMessage
    } = formData;

    if (
      !recipientName ||
      !recipientDistrict ||
      !recipientUpazila ||
      !hospitalName ||
      !fullAddress ||
      !bloodGroup ||
      !donationDate ||
      !donationTime ||
      !requestMessage
    ) {
      setErrorMsg('Please fill in all donation details.');
      showErrorToast('Please fill in all donation details.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/donations', formData);
      showSuccessToast('Donation request created successfully!');
      setSuccessMsg('Donation request created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1200);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit request.';
      setErrorMsg(msg);
      showErrorToast(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const isBlocked = user.status === 'blocked';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Donation Request</h2>
        <p className="text-slate-500 text-sm">Post a new blood request to alert volunteer donors in your district.</p>
      </div>

      {isBlocked ? (
        /* Blocked Alert */
        <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6 sm:p-8 max-w-2xl shadow-sm flex items-start space-x-4">
          <div className="bg-rose-500 p-3 rounded-2xl text-white shrink-0 shadow-md shadow-rose-500/10">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h3 className="font-extrabold text-rose-800 text-lg">Creation Request Locked</h3>
            <p className="text-xs text-rose-700 leading-relaxed font-medium">
              Your account status is currently set to <strong className="uppercase">Blocked</strong>. Blocked users are restricted from creating new blood donation requests. Please reach out to an administrator for assistance.
            </p>
          </div>
        </div>
      ) : (
        /* Creation Form */
        <div className="bg-white border border-slate-200/60 rounded-3xl shadow-sm overflow-hidden max-w-2xl">
          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-t-3xl p-4 text-xs font-semibold flex items-center space-x-2">
              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 rounded-t-3xl p-4 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            {/* Requester Info Section (Read-only) */}
            <div className="space-y-3 bg-slate-50/50 border border-slate-100 p-4 rounded-2xl">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1.5 mb-2">Requester Info (Read-only)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Requester Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <User className="h-3.5 w-3.5" />
                    </span>
                    <input
                      type="text"
                      readOnly
                      value={user.name}
                      className="w-full pl-9 pr-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Requester Email</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <Mail className="h-3.5 w-3.5" />
                    </span>
                    <input
                      type="email"
                      readOnly
                      value={user.email}
                      className="w-full pl-9 pr-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 font-semibold focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Recipient details */}
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1.5 pt-2">Recipient Info</h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Recipient Name</label>
                <input
                  name="recipientName"
                  type="text"
                  required
                  placeholder="Patient Name"
                  value={formData.recipientName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-rose-500 focus:outline-none rounded-xl text-xs transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Blood Group Required</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-rose-500">
                    <Droplet className="h-4 w-4 fill-rose-500" />
                  </span>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-rose-500 focus:outline-none rounded-xl text-xs transition-colors appearance-none cursor-pointer font-bold text-slate-700"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((grp) => (
                      <option key={grp} value={grp}>{grp}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Locations */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Recipient District</label>
                <select
                  name="recipientDistrict"
                  required
                  value={formData.recipientDistrict}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-rose-500 focus:outline-none rounded-xl text-xs transition-colors appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select District</option>
                  {Object.keys(LOCATION_DATA).map((dist) => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Recipient Upazila</label>
                <select
                  name="recipientUpazila"
                  required
                  disabled={!formData.recipientDistrict}
                  value={formData.recipientUpazila}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-rose-500 focus:outline-none rounded-xl text-xs transition-colors appearance-none cursor-pointer disabled:opacity-50"
                >
                  <option value="" disabled>Select Upazila</option>
                  {formData.recipientDistrict && LOCATION_DATA[formData.recipientDistrict].map((upz) => (
                    <option key={upz} value={upz}>{upz}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Hospital Logistics */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Hospital Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Hospital className="h-4 w-4" />
                </span>
                <input
                  name="hospitalName"
                  type="text"
                  required
                  placeholder="e.g. Dhaka Medical College"
                  value={formData.hospitalName}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-rose-500 focus:outline-none rounded-xl text-xs transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Full Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <MapPin className="h-4 w-4" />
                </span>
                <input
                  name="fullAddress"
                  type="text"
                  required
                  placeholder="Ward No, Area, Street Address details"
                  value={formData.fullAddress}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-rose-500 focus:outline-none rounded-xl text-xs transition-colors"
                />
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Donation Date</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Calendar className="h-4 w-4" />
                  </span>
                  <input
                    name="donationDate"
                    type="date"
                    required
                    value={formData.donationDate}
                    onChange={handleChange}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-rose-500 focus:outline-none rounded-xl text-xs transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Donation Time</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Clock className="h-4 w-4" />
                  </span>
                  <input
                    name="donationTime"
                    type="time"
                    required
                    value={formData.donationTime}
                    onChange={handleChange}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-rose-500 focus:outline-none rounded-xl text-xs transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Message details */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Request Message</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start text-slate-400">
                  <FileText className="h-4 w-4" />
                </span>
                <textarea
                  name="requestMessage"
                  required
                  rows="3"
                  placeholder="Provide clinical urgency reason details here..."
                  value={formData.requestMessage}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-rose-500 focus:outline-none rounded-xl text-xs transition-colors resize-none"
                ></textarea>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-rose-500/20 active:scale-98 transition-all duration-150 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Creating Request...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="h-4.5 w-4.5" />
                  <span>Submit Request</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateDonationRequest;
