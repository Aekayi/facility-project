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

function App() {
  return (
    <div className="layout h-full bg-[#d4f1f4]">
      <div className="container mx-auto flex flex-col justify-center items-center">
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
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
