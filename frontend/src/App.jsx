import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from './utils/alert';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Search from './pages/Search';
import DonationRequests from './pages/DonationRequests';

// Private Pages
import RequestDetails from './pages/RequestDetails';
import Funding from './pages/Funding';

// Dashboard Components
import DashboardLayout from './pages/dashboard/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import Profile from './pages/dashboard/Profile';
import CreateDonationRequest from './pages/dashboard/CreateDonationRequest';
import MyDonationRequests from './pages/dashboard/MyDonationRequests';
import AllUsers from './pages/dashboard/AllUsers';
import AllDonationRequests from './pages/dashboard/AllDonationRequests';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/blood-donation-requests" element={<DonationRequests />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Main Routes */}
          <Route
            path="/donation-request/:id"
            element={
              <ProtectedRoute allowedRoles={['donor', 'volunteer', 'admin']}>
                <RequestDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/funding"
            element={
              <ProtectedRoute allowedRoles={['donor', 'volunteer', 'admin']}>
                <Funding />
              </ProtectedRoute>
            }
          />

          {/* Dashboard Nested Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['donor', 'volunteer', 'admin']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Common dashboard pages */}
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<Profile />} />

            {/* Donor-only routes */}
            <Route
              path="create-donation-request"
              element={
                <ProtectedRoute allowedRoles={['donor']}>
                  <CreateDonationRequest />
                </ProtectedRoute>
              }
            />
            <Route
              path="my-donation-requests"
              element={
                <ProtectedRoute allowedRoles={['donor']}>
                  <MyDonationRequests />
                </ProtectedRoute>
              }
            />

            {/* Admin-only routes */}
            <Route
              path="all-users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AllUsers />
                </ProtectedRoute>
              }
            />

            {/* Admin & Volunteer routes */}
            <Route
              path="all-blood-donation-request"
              element={
                <ProtectedRoute allowedRoles={['admin', 'volunteer']}>
                  <AllDonationRequests />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
