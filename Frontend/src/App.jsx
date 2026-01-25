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
import FeedBack from "./pages/Common/Feedback.jsx";
import SubscriptionPlans from "./pages/Common/SubscriptionPlans.jsx";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "./redux/authThunks";
import { authCheckFinished } from "./redux/authSlice";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AboutUs from "./pages/Common/About_Us.jsx";
import PrivacyPolicy from "./pages/Common/PrivacyPolicy.jsx";
import PageLoader from "./components/PageLoader.jsx";
import Property from "./pages/Owner/Property.jsx";
import AddProperty from "./pages/Owner/AddProperty.jsx";
import Rooms from "./pages/Owner/Rooms.jsx";
import EditProperty from "./pages/Owner/EditProperty.jsx";
import Bookings from "./pages/Common/Bookings.jsx";
import Settings from "./pages/Common/Settings.jsx";
import ManageServices from "./pages/Common/ManageServices.jsx";
import ManageRequests from "./pages/Owner/ManageRequests.jsx";
import EditRooms from "./pages/Owner/EditRooms.jsx";
import AddTenant from "./pages/Owner/AddTanent.jsx";
import RoomDetails from "./pages/Common/RoomDetails.jsx";
import ViewTenant from "./pages/Owner/ViewTenat.jsx";
import Contact from "./pages/Support/Contact.jsx";
import SupportBot from "./components/SupportBot.jsx";
import HelpCenter from "./pages/Support/HelpCenter.jsx";
import CreateTicket from "./pages/Support/CreateTicket.jsx";
import BookingHelp from "./pages/Support/BookingHelp.jsx";
import PaymentHelp from "./pages/Support/PaymentHelp.jsx";
import TenantHelp from "./pages/Support/TenantHelp.jsx";
import AccountHelp from "./pages/Support/AccountHelp.jsx";
import StayIssues from "./pages/Support/StaysHelp.jsx";
import MyTickets from "./pages/Support/MyTickets.jsx";
import TicketDetails from "./pages/Support/TicketDetails.jsx";
import Public_Property from "./pages/Common/Public_Property.jsx";
import Public_Rooms from "./pages/Common/Public_Rooms.jsx";
import RoomVisitRequestForm from "./pages/Common/RoomVisitRequestForm.jsx";
// Import ToastContainer if using react-toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      dispatch(authCheckFinished());
      return;
    }

    dispatch(fetchCurrentUser());
  }, [dispatch]);

  if (loading) {
    return <PageLoader text="Checking your session..." />;
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
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
        <Route path="/contact_support" element={<Contact />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/create_ticket" element={<CreateTicket />} />
        <Route path="/help-center/booking-issues" element={<BookingHelp />} />
        <Route path="/help-center/payment-issues" element={<PaymentHelp />} />
        <Route path="/help-center/tenant-issues" element={<TenantHelp />} />
        <Route path="/help-center/account-profile" element={<AccountHelp />} />
        <Route path="/help-center/stay-issues" element={<StayIssues />} />
        <Route path="/explore_properties" element={<Public_Property />} />
        <Route path="/property/:propertyId/rooms" element={<Public_Rooms />} />

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
        <Route
          path="/Feedback"
          element={
            <ProtectedRoute>
              <FeedBack />
            </ProtectedRoute>
          }
        />
        <Route
          path="/SubscriptionPlans"
          element={
            <ProtectedRoute>
              <SubscriptionPlans />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Owner/properties"
          element={
            <ProtectedRoute>
              <Property />
            </ProtectedRoute>
          }
        />
        <Route
          path="Owner/add-property"
          element={
            <ProtectedRoute>
              <AddProperty />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Owner/property/:propertyId/rooms"
          element={
            <ProtectedRoute>
              <Rooms />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Owner/property/:propertyId/editproperty"
          element={
            <ProtectedRoute>
              <EditProperty />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <Bookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Owner/ManageServices"
          element={
            <ProtectedRoute>
              <ManageServices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Owner/ManageRequests"
          element={
            <ProtectedRoute>
              <ManageRequests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-requests"
          element={
            <ProtectedRoute>
              <ManageRequests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Owner/edit-room/:roomId"
          element={
            <ProtectedRoute>
              <EditRooms />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Owner/add-tenant/:roomId"
          element={
            <ProtectedRoute>
              <AddTenant />
            </ProtectedRoute>
          }
        />

        <Route
          path="/view-details/:roomId"
          element={
            <ProtectedRoute>
              <RoomDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rooms/:roomId/tenants"
          element={
            <ProtectedRoute>
              <ViewTenant />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets"
          element={
            <ProtectedRoute>
              <MyTickets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets/:ticketId"
          element={
            <ProtectedRoute>
              <TicketDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/saved-rooms"
          element={
            <ProtectedRoute>
              <Public_Rooms />
            </ProtectedRoute>
          }
        />

        <Route
          path="/book/:roomId"
          element={
            <ProtectedRoute>
              <RoomVisitRequestForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/review/:requestId"
          element={
            <ProtectedRoute>
              <FeedBack />
            </ProtectedRoute>
          }
        />

        {/* 404 Page Not Found */}

        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <SupportBot />
    </>
  );
}

export default App;
