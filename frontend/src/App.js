import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Doctors from "./pages/Doctors";
import BookAppointment from "./pages/BookAppointment";
import Appointments from "./pages/Appointments";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";

import DoctorProfile from "./pages/DoctorProfile";

import ProtectedRoute from "./components/ProtectedRoute";

import Admin from "./pages/Admin";
import AddDoctor from "./pages/AddDoctor";
import AdminDoctors from "./pages/AdminDoctors";
import AdminAppointments from "./pages/AdminAppointments";
import AdminRoute from "./components/AdminRoute";

import Footer from "./components/Footer";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";


function App() {

  return (

    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* =========================
            LOGIN
        ========================== */}

        <Route
          path="/"
          element={<Login />}
        />


        {/* =========================
            REGISTER
        ========================== */}

        <Route
          path="/register"
          element={<Register />}
        />


        {/* =========================
            DASHBOARD
        ========================== */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />


        {/* =========================
            DOCTORS
        ========================== */}

        <Route
          path="/doctors"
          element={
            <ProtectedRoute>
              <Doctors />
            </ProtectedRoute>
          }
        />


        {/* =========================
            DOCTOR PROFILE
        ========================== */}

        <Route
          path="/doctors/:doctorId"
          element={
            <ProtectedRoute>
              <DoctorProfile />
            </ProtectedRoute>
          }
        />


        {/* =========================
            BOOK APPOINTMENT
        ========================== */}

        <Route
          path="/book/:doctorId"
          element={
            <ProtectedRoute>
              <BookAppointment />
            </ProtectedRoute>
          }
        />


        {/* =========================
            APPOINTMENTS
        ========================== */}

        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <Appointments />
            </ProtectedRoute>
          }
        />


        {/* =========================
            FAVORITES
        ========================== */}

        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />


        {/* =========================
            PROFILE
        ========================== */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />


        {/* =========================
            ADMIN
        ========================== */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />


        {/* =========================
            ADMIN - ADD DOCTOR
        ========================== */}

        <Route
          path="/admin/add-doctor"
          element={
            <AdminRoute>
              <AddDoctor />
            </AdminRoute>
          }
        />


        {/* =========================
            ADMIN - MANAGE DOCTORS
        ========================== */}

        <Route
          path="/admin/doctors"
          element={
            <AdminRoute>
              <AdminDoctors />
            </AdminRoute>
          }
        />


        {/* =========================
            ADMIN - APPOINTMENTS
        ========================== */}

        <Route
          path="/admin/appointments"
          element={
            <AdminRoute>
              <AdminAppointments />
            </AdminRoute>
          }
        />

      </Routes>

      <Footer />

    </BrowserRouter>

  );

}

export default App;