import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import ChangePasswordPage from "./pages/login/ChangePasswordPage";
import Fleet from "./pages/Fleet/Fleet";
import MeetingRoom from "./pages/meetingRoom/MeetingRoom";
import PublicRoute from "./utils/PublicRoute";
import MeetingRoomById from "./pages/meetingRoom/MeetingRoomById";
import FleetById from "./pages/Fleet/FleetById";

function App() {
  return (
    <div className="layout bg-blue-300 h-screen">
      <div className="container mx-auto flex flex-col justify-center items-center h-screen w-1/2">
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
              path="/Fleet"
              element={
                <ProtectedRoutes>
                  <Fleet />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/Meeting Room/"
              element={
                <ProtectedRoutes>
                  <MeetingRoom />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/Meeting Room/:id"
              element={
                <ProtectedRoutes>
                  <MeetingRoomById />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/Fleet/:id"
              element={
                <ProtectedRoutes>
                  <FleetById />
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
