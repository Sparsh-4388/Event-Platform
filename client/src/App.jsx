import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateEvent from "./pages/CreateEvents";
import EditEvent from "./pages/EditEvents";
import MyEvents from "./pages/MyEvents";

export default function App() {
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/create-event" element={<CreateEvent />} />
      <Route path="/edit-event/:id" element={<EditEvent />} />
      <Route path="/my-events" element={<MyEvents />} />
    </Routes>
  );
}
