import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LOCATION_DATA } from '../Register';
import { User, Mail, MapPin, Droplet, Edit3, Save, CheckCircle, Image } from 'lucide-react';
import axios from 'axios';
import { showSuccessToast, showErrorToast } from '../../utils/alert';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bloodGroup: user?.bloodGroup || '',
    district: user?.district || '',
    upazila: user?.upazila || '',
    avatar: user?.avatar || ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'district') {
        updated.upazila = '';
      }
      return updated;
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const uploadToCloudinary = async (file) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET?.replace(/['"]/g, '').trim();

    if (!cloudName || !uploadPreset || cloudName === 'placeholder' || uploadPreset === 'placeholder') {
      console.warn('Cloudinary not configured. Skipping file upload.');
      return user.avatar; // retain current avatar
    }

    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', uploadPreset);

    try {
      const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, form);
      return res.data.secure_url;
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      return user.avatar;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      let avatarUrl = formData.avatar;
      if (imageFile) {
        avatarUrl = await uploadToCloudinary(imageFile);
      }

      await updateProfile({
        name: formData.name,
        bloodGroup: formData.bloodGroup,
        district: formData.district,
        upazila: formData.upazila,
        avatar: avatarUrl
      });

      setSuccessMsg('Profile updated successfully!');
      showSuccessToast('Profile updated successfully!');
      setEditMode(false);
      setImageFile(null);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      const msg = err.message || 'Failed to update profile.';
      setErrorMsg(msg);
      showErrorToast(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Profile</h2>
        <p className="text-slate-500 text-sm">View or manage your account details and blood donation settings.</p>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl p-4 text-xs font-semibold flex items-center space-x-2 shadow-sm max-w-2xl">
          <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl p-4 text-xs font-semibold max-w-2xl">
          {errorMsg}
        </div>
      )}

      {/* Main Profile Card */}
      <div className="bg-white border border-slate-200/60 rounded-3xl shadow-sm overflow-hidden max-w-2xl">
        {/* Banner header decoration */}
        <div className="h-32 bg-gradient-to-r from-rose-500 to-rose-600 relative">
          <button
            onClick={() => {
              if (editMode) {
                // reset form fields
                setFormData({
                  name: user.name,
                  bloodGroup: user.bloodGroup,
                  district: user.district,
                  upazila: user.upazila,
                  avatar: user.avatar
                });
                setImageFile(null);
              }
              setEditMode(!editMode);
            }}
            className="absolute right-4 bottom-4 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/20 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>{editMode ? 'Cancel Edit' : 'Edit Profile'}</span>
          </button>
        </div>

        {/* Profile Details Container */}
        <div className="px-6 pb-8 relative pt-14">
          {/* Absolute avatar position */}
          <div className="absolute top-0 left-6 -translate-y-1/2">
            <div className="relative group">
              <img
                src={imageFile ? URL.createObjectURL(imageFile) : formData.avatar}
                alt={user.name}
                className="h-24 w-24 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
              />
              {editMode && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    id="profile-avatar-upload"
                    className="hidden"
                  />
                  <label
                    htmlFor="profile-avatar-upload"
                    className="absolute inset-0 bg-slate-900/60 text-white rounded-2xl flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                  >
                    <Image className="h-5 w-5" />
                  </label>
                </>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Name field */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    name="name"
                    type="text"
                    required
                    disabled={!editMode}
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-rose-500 focus:outline-none rounded-xl text-xs transition-colors disabled:opacity-75 disabled:cursor-not-allowed font-medium text-slate-800"
                  />
                </div>
              </div>

              {/* Email field (Read-only) */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Address (Read-only)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 font-semibold focus:outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Blood group */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Blood Group</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-rose-500">
                    <Droplet className="h-4 w-4 fill-rose-500" />
                  </span>
                  <select
                    name="bloodGroup"
                    disabled={!editMode}
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-rose-500 focus:outline-none rounded-xl text-xs transition-colors disabled:opacity-75 disabled:cursor-not-allowed appearance-none font-bold text-slate-700"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((grp) => (
                      <option key={grp} value={grp}>{grp}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location: District */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">District</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <select
                    name="district"
                    disabled={!editMode}
                    required
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-rose-500 focus:outline-none rounded-xl text-xs transition-colors disabled:opacity-75 disabled:cursor-not-allowed appearance-none"
                  >
                    {Object.keys(LOCATION_DATA).map((dist) => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location: Upazila */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Upazila</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <select
                    name="upazila"
                    disabled={!editMode || !formData.district}
                    required
                    value={formData.upazila}
                    onChange={handleChange}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-rose-500 focus:outline-none rounded-xl text-xs transition-colors disabled:opacity-75 disabled:cursor-not-allowed appearance-none"
                  >
                    <option value="" disabled>Select Upazila</option>
                    {formData.district && LOCATION_DATA[formData.district].map((upz) => (
                      <option key={upz} value={upz}>{upz}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Edit Mode Save Button */}
            {editMode && (
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-md shadow-rose-500/20 active:scale-98 transition-all flex items-center space-x-1 text-xs disabled:opacity-50"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
