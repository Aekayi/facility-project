import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import ChangePasswordPage from "./pages/login/ChangePasswordPage";
import MeetingRoom from "./pages/meetingRoom/MeetingRoom";
import PublicRoute from "./utils/PublicRoute";
// import BookingDate from "./pages/booking-date/bookingDate";
import BookingDate from "./pages/booking-date/BookingDate";
import BookingRecords from "./pages/Records/BookingRecords";
import { ToastContainer } from "react-toastify";
import BookingsForApprove from "./components/BookedListForManager/BookingsForApprove";
import ReservationMap from "./pages/ReservationMap/ReservationMap";
import OneSignal from "react-onesignal";
import { useEffect } from "react";

function App() {
  // useEffect(() => {
  //   // Ensure this code runs only on the client side
  //   if (typeof window !== "undefined") {
  //     OneSignal.init({
  //       appId: "c50253fe-1594-46ee-8ba3-c1f53f2601cd",
  //       // You can add other initialization options here
  //       notifyButton: {
  //         enable: true,
  //       },
  //     });
  //   }
  // }, []);

  return (
    <div className="layout h-full bg-[#d4f1f4]">
      <div className="flex flex-col justify-center items-center">
        <Router future={{ v7_relativeSplatPath: true }}>
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />

            <Route
              path="/"
              element={
                <ProtectedRoutes>
                  <Dashboard />
                </ProtectedRoutes>
              }
            />

            <Route
              path="/:facilityName"
              element={
                <ProtectedRoutes>
                  <MeetingRoom />
                </ProtectedRoutes>
              }
            />

            <Route
              path="/:facilityName/:facilityByRoomId"
              element={
                <ProtectedRoutes>
                  <BookingDate />
                </ProtectedRoutes>
              }
            />

            <Route
              path="/change-password"
              element={
                <ProtectedRoutes>
                  <ChangePasswordPage />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/records"
              element={
                <ProtectedRoutes>
                  <BookingRecords />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/approver-records"
              element={
                <ProtectedRoutes>
                  <BookingsForApprove />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/reservation-map"
              element={
                <ProtectedRoutes>
                  <ReservationMap />
                </ProtectedRoutes>
              }
            />
            {/* <Route path="/" element={<Layout />}>
              <Route
                path="bookings-for-approve"
                element={<BookingsForApprove />}
              />
              <Route path="reservation-map" element={<ReservationMap />} />
            </Route> */}
          </Routes>
        </Router>
      </div>
      <ToastContainer
        position="bottom-center"
        hideProgressBar={false}
        autoClose={2000}
      />
    </div>
  );
}

export default App;
