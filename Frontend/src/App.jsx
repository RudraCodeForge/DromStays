import { Routes, Route } from "react-router-dom";
import PageNotFound from "./pages/Common/Page_Not_Found.jsx";
import Home from "./pages/Common/Home.jsx";
import Login from "./pages/Auth/Login.jsx";
import Signup from "./pages/Auth/Signup.jsx";
import Profile from "./pages/Common/Profile.jsx";
import Verify from "./pages/Common/Verify.jsx";
import OwnerDashboard from "./pages/Owner/OwnerDashboard.jsx";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Owner/dashboard" element={<OwnerDashboard />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}
export default App;
