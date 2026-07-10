# 🩸 Blood Donation Application

A full-stack MERN Blood Donation Management Platform that connects blood donors with patients in need. The application provides a secure, responsive, and user-friendly system for managing blood donation requests with role-based access for Donors, Volunteers, and Admins.

## 🌐 Live Demo

- **Frontend:** https://your-client-url.vercel.app
- **Backend:** https://your-server-url.vercel.app

---

# 📌 Project Objective

The Blood Donation Application is designed to simplify the blood donation process by allowing users to:

- Register as blood donors
- Search available donors
- Create blood donation requests
- Manage donation requests
- Donate to blood donation organizations
- Access features based on user roles

---

# ✨ Key Features

## 🔐 Authentication

- Email & Password Login
- Secure JWT Authentication
- Protected Routes
- Role-Based Authorization
- User Profile Management

---

## 🩸 Donor Features

- Register as a Blood Donor
- Update Personal Profile
- Create Blood Donation Requests
- Edit/Delete Own Requests
- View Request Details
- Manage Donation Status
- View Donation History

---

## 🤝 Volunteer Features

- View All Donation Requests
- Update Donation Status
- Manage Blood Donation Requests

---

## 👑 Admin Features

- Dashboard Statistics
- Manage All Users
- Block / Unblock Users
- Change User Roles
- View All Blood Donation Requests
- Manage Donation Status
- View Total Funding

---

## 🔎 Search System

Users can search donors by:

- Blood Group
- District
- Upazila

---

## 💳 Funding System

- Stripe Payment Integration
- Donation History
- Total Funding Statistics

---

## 📊 Dashboard

Responsive Sidebar Dashboard

### Dashboard Includes

- Profile Page
- Dashboard Home
- Statistics Cards
- Donation Request Table
- User Management
- Funding Information

---

## 🎨 UI Features

- Fully Responsive Design
- Premium Modern UI
- Clean Dashboard Layout
- Consistent Color Theme
- Reusable Components
- Mobile Friendly
- Smooth Animations

---

# 🛠 Tech Stack

## Frontend

- React.js
- React Router
- Tailwind CSS
- DaisyUI
- Axios
- React Hook Form
- React Icons
- SweetAlert2
- React Hot Toast
- Framer Motion / AOS

---

## Backend

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Firebase Admin (Optional)

---

## Database

- MongoDB Atlas

Database Name:

```
blood-donationDB
```

---

## Payment

- Stripe

---

## Image Upload

- ImageBB API

---

# 📦 NPM Packages

## Client

```bash
react
react-router-dom
axios
tailwindcss
daisyui
react-hook-form
react-icons
react-hot-toast
sweetalert2
framer-motion
react-datepicker
react-select
recharts
```

---

## Server

```bash
express
mongodb
cors
dotenv
jsonwebtoken
cookie-parser
stripe
firebase-admin
nodemon
```

---

# 📂 Project Structure

```
frontend/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── routes/
│   ├── hooks/
│   ├── context/
│   ├── services/
│   ├── utils/
│   └── App.jsx
│
backend/
│
├── config/
├── middleware/
├── routes/
├── controllers/
├── models/
├── utils/
├── server.js
└── .env
```

---

# 🔐 Environment Variables

### Client

```env
VITE_API_URL=
VITE_IMGBB_API_KEY=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

---

### Server

```env
PORT=5000

MONGODB_URI=

JWT_SECRET=

STRIPE_SECRET_KEY=

FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/your-username/blood-donation-client.git
```

## Install Client

```bash
cd frontend
npm install
npm run dev
```

---

## Install Server

```bash
cd backend
npm install
npm run dev
```

---

# 📱 User Roles

## Donor

- Create Donation Request
- Manage Own Requests
- Update Profile
- Donate Blood

---

## Volunteer

- View All Requests
- Update Donation Status

---

## Admin

- Manage Users
- Manage Donation Requests
- Dashboard Statistics
- Funding Management

---

# 📈 Future Improvements

- Email Notifications
- SMS Notifications
- Blood Request Approval
- AI Donor Recommendation
- Live Chat Support
- Dark Mode
- PWA Support

---

# 👨💻 Developer

**Name:** MD Rifat Hasan

Junior MERN Stack Developer

---

# 📄 License

This project is created for educational purposes as part of the Programming Hero MERN Stack Assignment.
