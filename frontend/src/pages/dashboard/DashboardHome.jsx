import React, { useState, useEffect } from 'react';
import { useAuth, api } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  Users,
  Coins,
  HeartHandshake,
  Heart,
  Calendar,
  Clock,
  MapPin,
  Trash2,
  Edit3,
  Eye,
  Activity,
  PlusCircle,
  TrendingUp,
  AlertTriangle,
  X,
  FileText,
  Hospital
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { LOCATION_DATA } from '../Register';
import { confirmDialog, showSuccessToast, showErrorToast } from '../../utils/alert';

const DashboardHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isStaff = user && (user.role === 'admin' || user.role === 'volunteer');

  const [stats, setStats] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Edit Modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [editForm, setEditForm] = useState({
    recipientName: '',
    recipientDistrict: '',
    recipientUpazila: '',
    hospitalName: '',
    fullAddress: '',
    bloodGroup: 'A+',
    donationDate: '',
    donationTime: '',
    requestMessage: ''
  });

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (isStaff) {
        const response = await api.get('/users/stats');
        setStats(response.data);
      } else {
        const response = await api.get('/donations/recent');
        setRecentRequests(response.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  // Action: Status change
  const handleStatusChange = async (requestId, newStatus) => {
    setActionLoading(true);
    try {
      await api.patch(`/donations/${requestId}/status`, { status: newStatus });
      showSuccessToast(`Request status updated to ${newStatus}.`);
      fetchDashboardData();
    } catch (err) {
      showErrorToast(err.response?.data?.message || 'Failed to update request status.');
    } finally {
      setActionLoading(false);
    }
  };

  // Action: Delete request
  const handleDeleteRequest = async (requestId) => {
    const confirmed = await confirmDialog({
      title: 'Delete Request',
      text: 'Are you sure you want to delete this donation request? This cannot be undone.',
      confirmButtonText: 'Delete Request',
      danger: true
    });
    if (!confirmed) return;

    setActionLoading(true);
    try {
      await api.delete(`/donations/${requestId}`);
      showSuccessToast('Donation request deleted successfully.');
      fetchDashboardData();
    } catch (err) {
      showErrorToast(err.response?.data?.message || 'Failed to delete request.');
    } finally {
      setActionLoading(false);
    }
  };

  // Edit form controls
  const handleEditClick = (req) => {
    setEditingRequest(req);
    setEditForm({
      recipientName: req.recipientName,
      recipientDistrict: req.recipientDistrict,
      recipientUpazila: req.recipientUpazila,
      hospitalName: req.hospitalName,
      fullAddress: req.fullAddress,
      bloodGroup: req.bloodGroup,
      donationDate: req.donationDate,
      donationTime: req.donationTime,
      requestMessage: req.requestMessage
    });
    setEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'recipientDistrict') {
        updated.recipientUpazila = '';
      }
      return updated;
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await api.put(`/donations/${editingRequest._id}`, editForm);
      showSuccessToast('Donation request updated successfully!');
      setEditModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      showErrorToast(err.response?.data?.message || 'Failed to update donation request details.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  // Chart styling options
  const chartData = stats ? [
    { name: 'Users', count: stats.totalUsers || 0, color: '#e11d48' },
    { name: 'Requests', count: stats.totalDonationRequests || 0, color: '#f43f5e' },
    { name: 'Funding ($)', count: stats.totalFunding || 0, color: '#10b981' }
  ] : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-60 h-60 bg-rose-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative space-y-2 max-w-xl">
          <span className="text-[10px] bg-rose-500 text-white font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            {user?.role} workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Welcome back, {user?.name}!</h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            {user?.role === 'donor' && 'Create requests, view donation responses, and track your history in real time.'}
            {user?.role === 'volunteer' && 'Review matching requests and coordinate donations in your assigned area.'}
            {user?.role === 'admin' && 'Monitor total users, donation metrics, Stripe funding records, and manage settings.'}
          </p>
        </div>
      </div>

      {/* Staff View: Statistics Cards & Charts */}
      {isStaff && stats && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Stats Card: Total Users */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm flex items-center space-x-4">
              <div className="p-4 bg-rose-50 rounded-2xl text-rose-500 shrink-0">
                <Users className="h-6 w-6" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Users</h4>
                <p className="text-2xl font-extrabold text-slate-900">{stats.totalUsers || 0}</p>
              </div>
            </div>

            {/* Stats Card: Total Funding */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm flex items-center space-x-4">
              <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-500 shrink-0">
                <Coins className="h-6 w-6" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Funding</h4>
                <p className="text-2xl font-extrabold text-slate-900">${(stats.totalFunding || 0).toFixed(2)}</p>
              </div>
            </div>

            {/* Stats Card: Total Requests */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm flex items-center space-x-4">
              <div className="p-4 bg-blue-50 rounded-2xl text-blue-500 shrink-0">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Requests</h4>
                <p className="text-2xl font-extrabold text-slate-900">{stats.totalDonationRequests}</p>
              </div>
            </div>
          </div>

          {/* Simple Recharts Bar Chart */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-1">
              <TrendingUp className="h-4 w-4 text-rose-500" />
              <span>Platform Activity Overview</span>
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(241, 245, 249, 0.4)' }} />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={60}>
                    {chartData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Donor View: 3 Recent Requests Table */}
      {!isStaff && (
        <div className="bg-white border border-slate-200/60 rounded-3xl shadow-sm overflow-hidden space-y-1">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">3 Recent Donation Requests</h3>
            <Link
              to="/dashboard/create-donation-request"
              className="px-3.5 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-500/10 flex items-center space-x-1"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>New Request</span>
            </Link>
          </div>

          {recentRequests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase tracking-wider">
                    <th className="px-6 py-4">Recipient</th>
                    <th className="px-6 py-4">Address</th>
                    <th className="px-6 py-4">Group</th>
                    <th className="px-6 py-4">Logistics</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentRequests.map((req) => (
                    <tr key={req._id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{req.recipientName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-600 font-medium">{req.hospitalName}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{req.recipientUpazila}, {req.recipientDistrict}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-rose-50 border border-rose-100 text-rose-600 font-bold px-2 py-0.5 rounded-lg text-[10px]">
                          {req.bloodGroup}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1 text-slate-600 font-medium">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          <span>{req.donationDate}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-slate-400 text-[10px] mt-0.5">
                          <Clock className="h-3 w-3 text-slate-400" />
                          <span>{req.donationTime}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                          req.status === 'pending' ? 'bg-amber-50 border-amber-200 text-amber-600' :
                          req.status === 'inprogress' ? 'bg-blue-50 border-blue-200 text-blue-600' :
                          req.status === 'done' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
                          'bg-slate-100 border-slate-200 text-slate-500'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-1.5">
                          {/* View details */}
                          <button
                            onClick={() => navigate(`/donation-request/${req._id}`)}
                            className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-lg border border-slate-200/50"
                            title="View Details"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>

                          {/* Edit request */}
                          <button
                            onClick={() => handleEditClick(req)}
                            disabled={actionLoading}
                            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-lg border border-rose-100"
                            title="Edit Request"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>

                          {/* Delete request */}
                          <button
                            onClick={() => handleDeleteRequest(req._id)}
                            disabled={actionLoading}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg border border-red-100"
                            title="Delete Request"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>

                          {/* Status Actions: pending -> inprogress */}
                          {req.status === 'pending' && (
                            <button
                              onClick={() => handleStatusChange(req._id, 'inprogress')}
                              disabled={actionLoading}
                              className="px-2.5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold text-[10px]"
                            >
                              In Progress
                            </button>
                          )}

                          {/* Status Actions: inprogress -> done/canceled */}
                          {req.status === 'inprogress' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(req._id, 'done')}
                                disabled={actionLoading}
                                className="px-2.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-[10px]"
                              >
                                Done
                              </button>
                              <button
                                onClick={() => handleStatusChange(req._id, 'canceled')}
                                disabled={actionLoading}
                                className="px-2.5 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg font-bold text-[10px]"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400 space-y-3">
              <HeartHandshake className="h-10 w-10 text-slate-200 mx-auto" />
              <p className="text-xs">You have not created any donation requests yet.</p>
              <Link
                to="/dashboard/create-donation-request"
                className="inline-flex items-center space-x-1 text-rose-500 text-xs font-bold hover:underline"
              >
                <span>Create your first request</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Edit Donation Request Slide-out / Modal Drawer */}
      {editModalOpen && editingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-in fade-in duration-200">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setEditModalOpen(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full relative z-10 overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="bg-rose-500 py-5 px-6 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Edit Donation Request</h3>
                <p className="text-rose-100 text-xs mt-0.5">Modify request parameters and save details.</p>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Form */}
            <form onSubmit={handleEditSubmit} className="p-6 max-h-[75vh] overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Recipient Name</label>
                  <input
                    name="recipientName"
                    type="text"
                    required
                    value={editForm.recipientName}
                    onChange={handleEditChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-rose-500 focus:outline-none rounded-xl text-xs transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Blood Group Required</label>
                  <select
                    name="bloodGroup"
                    value={editForm.bloodGroup}
                    onChange={handleEditChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-rose-500 focus:outline-none rounded-xl text-xs transition-colors appearance-none cursor-pointer"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((grp) => (
                      <option key={grp} value={grp}>{grp}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Recipient District</label>
                  <select
                    name="recipientDistrict"
                    required
                    value={editForm.recipientDistrict}
                    onChange={handleEditChange}
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
                    disabled={!editForm.recipientDistrict}
                    value={editForm.recipientUpazila}
                    onChange={handleEditChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-rose-500 focus:outline-none rounded-xl text-xs transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select Upazila</option>
                    {editForm.recipientDistrict && LOCATION_DATA[editForm.recipientDistrict].map((upz) => (
                      <option key={upz} value={upz}>{upz}</option>
                    ))}
                  </select>
                </div>
              </div>

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
                    value={editForm.hospitalName}
                    onChange={handleEditChange}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-rose-500 focus:outline-none rounded-xl text-xs transition-colors"
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
                    value={editForm.fullAddress}
                    onChange={handleEditChange}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-rose-500 focus:outline-none rounded-xl text-xs transition-colors"
                  />
                </div>
              </div>

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
                      value={editForm.donationDate}
                      onChange={handleEditChange}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-rose-500 focus:outline-none rounded-xl text-xs transition-colors"
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
                      value={editForm.donationTime}
                      onChange={handleEditChange}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-rose-500 focus:outline-none rounded-xl text-xs transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Request Message</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start text-slate-400">
                    <FileText className="h-4 w-4" />
                  </span>
                  <textarea
                    name="requestMessage"
                    required
                    rows="2.5"
                    value={editForm.requestMessage}
                    onChange={handleEditChange}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-rose-500 focus:outline-none rounded-xl text-xs transition-colors resize-none"
                  ></textarea>
                </div>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  disabled={actionLoading}
                  className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs shadow-md shadow-rose-500/10 transition-colors flex items-center justify-center"
                >
                  {actionLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
