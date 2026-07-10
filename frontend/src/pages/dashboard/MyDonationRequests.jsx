import React, { useState, useEffect } from 'react';
import { useAuth, api } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Trash2,
  Edit3,
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter,
  PlusCircle,
  Inbox,
  X,
  Hospital,
  MapPin,
  FileText
} from 'lucide-react';
import { LOCATION_DATA } from '../Register';
import { confirmDialog, showSuccessToast, showErrorToast } from '../../utils/alert';

const MyDonationRequests = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Edit Modal State
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

  const fetchMyRequests = async () => {
    setLoading(true);
    try {
      const response = await api.get('/donations', {
        params: {
          requesterEmail: user?.email,
          status: statusFilter === 'all' ? undefined : statusFilter,
          page,
          limit: 5 // Paginated at 5 rows per page
        }
      });
      setRequests(response.data.requests || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      console.error('Failed to load my donation requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, [statusFilter, page]);

  // Handle status update
  const handleStatusChange = async (requestId, newStatus) => {
    setActionLoading(true);
    try {
      await api.patch(`/donations/${requestId}/status`, { status: newStatus });
      showSuccessToast(`Request status changed to ${newStatus}.`);
      fetchMyRequests();
    } catch (err) {
      showErrorToast(err.response?.data?.message || 'Failed to update request status.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle delete request
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
      showSuccessToast('Donation request deleted.');
      fetchMyRequests();
    } catch (err) {
      showErrorToast(err.response?.data?.message || 'Failed to delete request.');
    } finally {
      setActionLoading(false);
    }
  };

  // Edit click handlers
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
      fetchMyRequests();
    } catch (err) {
      showErrorToast(err.response?.data?.message || 'Failed to update donation request details.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Donation Requests</h2>
          <p className="text-slate-500 text-sm">Review, modify, or delete blood requests you have created.</p>
        </div>
        <Link
          to="/dashboard/create-donation-request"
          className="px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-500/10 flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Create Request</span>
        </Link>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <Filter className="h-4 w-4 text-slate-400" />
          <span>Filter Status</span>
        </div>
        <div className="flex w-full sm:w-auto items-center space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1); // reset to first page on filter change
            }}
            className="w-full sm:w-48 px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 focus:border-rose-500 focus:bg-white focus:outline-none rounded-xl text-xs font-semibold text-slate-600 cursor-pointer"
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-200/60 rounded-3xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-rose-500"></div>
          </div>
        ) : requests.length > 0 ? (
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
                {requests.map((req) => (
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
          <div className="py-20 text-center text-slate-400 space-y-3">
            <Inbox className="h-10 w-10 text-slate-200 mx-auto" />
            <p className="text-xs">No donation requests match this filter.</p>
          </div>
        )}

        {/* Pagination footer bar */}
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Page <span className="font-bold text-slate-800">{page}</span> of <span className="font-bold text-slate-800">{totalPages}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                className="p-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                className="p-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Donation Request Modal Drawer */}
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

export default MyDonationRequests;
