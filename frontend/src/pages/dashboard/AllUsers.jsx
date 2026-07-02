import React, { useState, useEffect } from 'react';
import { useAuth, api } from '../../context/AuthContext';
import { Shield, ShieldAlert, User, ShieldCheck, Mail, Lock, Unlock, Inbox } from 'lucide-react';

const AllUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatusToggle = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    setActionLoading(true);
    try {
      await api.patch(`/users/${userId}/status`, { status: newStatus });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      return;
    }
    setActionLoading(true);
    try {
      await api.patch(`/users/${userId}/role`, { role: newRole });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user role.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">All Users Management</h2>
        <p className="text-slate-500 text-sm">Review, block/unblock, or change security roles of registered platform accounts.</p>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-200/60 rounded-3xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/40">
          <h3 className="font-bold text-slate-800 text-sm">Registered Accounts</h3>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-rose-500"></div>
          </div>
        ) : users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase tracking-wider">
                  <th className="px-6 py-4">Avatar</th>
                  <th className="px-6 py-4">User Info</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((item) => {
                  const isSelf = currentUser && currentUser._id === item._id;
                  return (
                    <tr key={item._id} className={`hover:bg-slate-50/50 ${isSelf ? 'bg-rose-50/20' : ''}`}>
                      <td className="px-6 py-4">
                        <img
                          src={item.avatar}
                          alt={item.name}
                          className="h-10 w-10 rounded-xl object-cover border border-slate-100 shadow-sm"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800 flex items-center space-x-1">
                          <span>{item.name}</span>
                          {isSelf && (
                            <span className="bg-rose-100 text-rose-600 text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full shrink-0">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 flex items-center space-x-1">
                          <Mail className="h-3.5 w-3.5 shrink-0" />
                          <span>{item.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                          item.role === 'admin' ? 'bg-purple-50 border-purple-200 text-purple-600' :
                          item.role === 'volunteer' ? 'bg-blue-50 border-blue-200 text-blue-600' :
                          'bg-slate-50 border-slate-200 text-slate-600'
                        }`}>
                          {item.role === 'admin' && <Shield className="h-3 w-3 shrink-0" />}
                          {item.role === 'volunteer' && <ShieldCheck className="h-3 w-3 shrink-0" />}
                          {item.role === 'donor' && <User className="h-3 w-3 shrink-0" />}
                          <span>{item.role}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                          item.status === 'active'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                            : 'bg-red-50 border-red-200 text-red-600'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          {/* Block/Unblock toggle */}
                          <button
                            onClick={() => handleStatusToggle(item._id, item.status)}
                            disabled={actionLoading || isSelf}
                            className={`p-2 rounded-xl border flex items-center justify-center transition-colors ${
                              item.status === 'active'
                                ? 'bg-red-50 hover:bg-red-100 text-red-600 border-red-100 disabled:opacity-40'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-100 disabled:opacity-40'
                            }`}
                            title={item.status === 'active' ? 'Block Account' : 'Unblock Account'}
                          >
                            {item.status === 'active' ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
                          </button>

                          {/* Role options buttons */}
                          {item.role !== 'volunteer' && (
                            <button
                              onClick={() => handleRoleChange(item._id, 'volunteer')}
                              disabled={actionLoading || isSelf}
                              className="px-2.5 py-2 bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100 rounded-xl font-bold text-[9px] disabled:opacity-40 transition-colors"
                            >
                              Make Volunteer
                            </button>
                          )}

                          {item.role !== 'admin' && (
                            <button
                              onClick={() => handleRoleChange(item._id, 'admin')}
                              disabled={actionLoading || isSelf}
                              className="px-2.5 py-2 bg-purple-50 border border-purple-200 text-purple-600 hover:bg-purple-100 rounded-xl font-bold text-[9px] disabled:opacity-40 transition-colors"
                            >
                              Make Admin
                            </button>
                          )}

                          {item.role !== 'donor' && (
                            <button
                              onClick={() => handleRoleChange(item._id, 'donor')}
                              disabled={actionLoading || isSelf}
                              className="px-2.5 py-2 bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl font-bold text-[9px] disabled:opacity-40 transition-colors"
                            >
                              Demote Donor
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-20 text-center text-slate-400 space-y-2">
            <Inbox className="h-8 w-8 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold">No registered users in the database.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
