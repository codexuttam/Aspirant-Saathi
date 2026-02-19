import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CompleteProfile from "./pages/CompleteProfile";
import Submit from "./pages/Submit";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import AttemptDetails from "./pages/AttemptDetails";
import ModelAnswer from "./pages/ModelAnswer";
import About from "./pages/About";
import Profile from "./pages/Profile";
import VerifyOtp from "./pages/VerifyOtp";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Pricing from "./pages/Pricing";
import RefundPolicy from "./pages/RefundPolicy";
import ScrollToTop from "./components/ScrollToTop";
import ChatBot from "./components/ChatBot";


function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ChatBot />
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />

        {/* 🔒 Dashboard (Protected) */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        {/* 🔒 Protected Route */}
        <Route
          path="/submit"
          element={
            <PrivateRoute>
              <Submit />
            </PrivateRoute>
          }
        />

        <Route
          path="/attempt/:id"
          element={
            <PrivateRoute>
              <AttemptDetails />
            </PrivateRoute>
          }
        />

        <Route
          path="/attempt/:id/model"
          element={
            <PrivateRoute>
              <ModelAnswer />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

