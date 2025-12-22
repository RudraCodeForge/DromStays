import { Routes, Route } from "react-router-dom";
import PageNotFound from "./pages/Common/Page_Not_Found.jsx";
import Home from "./pages/Common/Home.jsx";
import Login from "./pages/Auth/Login.jsx";
import Signup from "./pages/Auth/Signup.jsx";
import Profile from "./pages/Common/Profile.jsx";
import Verify from "./pages/Common/Verify.jsx";
import OwnerDashboard from "./pages/Owner/OwnerDashboard.jsx";
import EditProfile from "./pages/Common/EditProfile.jsx";
import ChangePassword from "./pages/Auth/ChangePassword.jsx";
import ResetPassword from "./pages/Auth/ResetPassword.jsx";
import NewPassword from "./pages/Common/NewPassword.jsx";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "./redux/authThunks";
import { authCheckFinished } from "./redux/authSlice";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AboutUs from "./pages/Common/About_Us.jsx";
import PrivacyPolicy from "./pages/Common/PrivacyPolicy.jsx";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      dispatch(authCheckFinished());
      return;
    }

    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <Routes>
      {/* 🌍 Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="/Forgot_password" element={<ResetPassword />} />
      <Route path="/reset-password" element={<NewPassword />} />
      <Route path="/about_us" element={<AboutUs />} />
      <Route path="/privacy_policy" element={<PrivacyPolicy />} />

      {/* 🔐 Protected Routes */}
      <Route
        path="/Profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/Owner/dashboard"
        element={
          <ProtectedRoute>
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/EditProfile"
        element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ChangePassword"
        element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        }
      />

      {/* 404 Page Not Found */}

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
