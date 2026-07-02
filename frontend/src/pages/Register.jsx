import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { UserPlus, Image, Key, Mail, MapPin, Droplet, User, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

// Mock list of Districts & Upazilas in Bangladesh for selectors
const LOCATION_DATA = {
  'Dhaka': ['Mirpur', 'Gulshan', 'Dhanmondi', 'Uttara', 'Savar', 'Keraniganj'],
  'Chittagong': ['Hathazari', 'Panchlaish', 'Double Mooring', 'Halishahar', 'Raozan'],
  'Sylhet': ['Sylhet Sadar', 'Beanibazar', 'Golapganj', 'Fenchuganj', 'Balaganj'],
  'Rajshahi': ['Paba', 'Boalia', 'Motihar', 'Rajpara', 'Godagari']
};

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bloodGroup: 'A+',
    district: '',
    upazila: '',
    password: '',
    confirmPassword: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // Reset upazila if district changes
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

  const uploadToImgBB = async (file) => {
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
    if (!apiKey || apiKey === 'placeholder' || apiKey.startsWith('placeholder_')) {
      console.warn('VITE_IMGBB_API_KEY not configured. Falling back to default unsplash avatar.');
      // Beautiful mock user avatars
      const mockAvatars = [
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
        'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200'
      ];
      return mockAvatars[Math.floor(Math.random() * mockAvatars.length)];
    }

    const form = new FormData();
    form.append('image', file);

    try {
      const res = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, form);
      return res.data.data.url;
    } catch (err) {
      console.error('ImgBB upload error, using default avatar fallback:', err);
      return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const { name, email, bloodGroup, district, upazila, password, confirmPassword } = formData;

    if (!name || !email || !bloodGroup || !district || !upazila || !password || !confirmPassword) {
      setErrorMsg('Please fill in all details.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      let avatarUrl = '';
      if (imageFile) {
        avatarUrl = await uploadToImgBB(imageFile);
      } else {
        avatarUrl = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'; // fallback default
      }

      await register({
        name,
        email,
        avatar: avatarUrl,
        bloodGroup,
        district,
        upazila,
        password,
        confirmPassword
      });

      setSuccessMsg('Account registered successfully! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-100/80 border border-slate-100 overflow-hidden">
          {/* Card Header */}
          <div className="bg-rose-500 py-8 px-6 text-center text-white relative">
            <div className="absolute right-4 top-4 bg-white/10 p-2 rounded-xl text-white">
              <UserPlus className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold">Join as a Donor</h2>
            <p className="text-rose-100 text-sm mt-1">Fill in the fields below to register and start saving lives.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            {errorMsg && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl p-4 text-sm font-medium">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl p-4 text-sm font-medium flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Name Field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <User className="h-4.5 w-4.5" />
                </span>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/80 focus:border-rose-500 focus:bg-white focus:outline-none rounded-2xl text-sm transition-all"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Mail className="h-4.5 w-4.5" />
                </span>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="johndoe@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/80 focus:border-rose-500 focus:bg-white focus:outline-none rounded-2xl text-sm transition-all"
                />
              </div>
            </div>

            {/* Blood Group and Avatar Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Blood Group</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-rose-500">
                    <Droplet className="h-4.5 w-4.5 fill-rose-500" />
                  </span>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/80 focus:border-rose-500 focus:bg-white focus:outline-none rounded-2xl text-sm transition-all appearance-none cursor-pointer font-semibold text-slate-700"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((grp) => (
                      <option key={grp} value={grp}>{grp}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avatar Image</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="avatar-upload"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="w-full flex items-center justify-center space-x-1 py-3 px-3 bg-slate-50 border border-dashed border-slate-300 hover:border-rose-500 hover:bg-rose-50/20 text-slate-500 hover:text-rose-500 rounded-2xl cursor-pointer text-xs font-medium transition-all"
                  >
                    <Image className="h-4 w-4" />
                    <span className="truncate">{imageFile ? imageFile.name : 'Upload File'}</span>
                  </label>
                </div>
              </div>
            </div>

            {/* District & Upazila Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">District</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <MapPin className="h-4.5 w-4.5" />
                  </span>
                  <select
                    name="district"
                    required
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/80 focus:border-rose-500 focus:bg-white focus:outline-none rounded-2xl text-sm transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select District</option>
                    {Object.keys(LOCATION_DATA).map((dist) => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Upazila</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <MapPin className="h-4.5 w-4.5" />
                  </span>
                  <select
                    name="upazila"
                    required
                    disabled={!formData.district}
                    value={formData.upazila}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/80 focus:border-rose-500 focus:bg-white focus:outline-none rounded-2xl text-sm transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="" disabled>Select Upazila</option>
                    {formData.district && LOCATION_DATA[formData.district].map((upz) => (
                      <option key={upz} value={upz}>{upz}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Password Fields */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Key className="h-4.5 w-4.5" />
                </span>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/80 focus:border-rose-500 focus:bg-white focus:outline-none rounded-2xl text-sm transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Key className="h-4.5 w-4.5" />
                </span>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/80 focus:border-rose-500 focus:bg-white focus:outline-none rounded-2xl text-sm transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-rose-500/20 active:scale-98 transition-all duration-150 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Register Now</span>
              )}
            </button>

            <div className="text-center text-sm text-slate-500 pt-2">
              Already have an account?{' '}
              <Link to="/login" className="text-rose-500 font-semibold hover:text-rose-600">
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
export { LOCATION_DATA };
