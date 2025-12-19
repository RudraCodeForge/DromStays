import { Routes, Route } from "react-router-dom";
import PageNotFound from "./pages/Common/Page_Not_Found.jsx";
import Home from "./pages/Common/Home.jsx";
import Login from "./pages/Auth/Login.jsx";
import Signup from "./pages/Auth/Signup.jsx";
import Profile from "./pages/Common/Profile.jsx";
import Verify from "./pages/Common/Verify.jsx";
import OwnerDashboard from "./pages/Owner/OwnerDashboard.jsx";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "./redux/authThunks";
import { authCheckFinished } from "./redux/authSlice";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

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

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
