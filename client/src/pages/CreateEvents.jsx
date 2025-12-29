import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/DashboardLayout";
import "../App.css";

export default function CreateEvent() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    datetime: "",
    location: "",
    capacity: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post(
        "/api/events",
        { ...form, capacity: Number(form.capacity) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="create-event">
        <div className="create-event-card">
          <h2>Create Event</h2>
          <p className="subtext">Fill in the details to publish a new event</p>

          {error && <p className="error-text">{error}</p>}

          <form className="create-event-form" onSubmit={handleSubmit}>
            <input
              name="title"
              placeholder="Event Title"
              value={form.title}
              onChange={handleChange}
              required
            />

            <textarea
              name="description"
              placeholder="Event Description"
              value={form.description}
              onChange={handleChange}
              required
            />

            <input
              type="datetime-local"
              name="datetime"
              value={form.datetime}
              onChange={handleChange}
              required
            />

            <input
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="capacity"
              placeholder="Capacity"
              value={form.capacity}
              onChange={handleChange}
              required
              min="1"
            />

            <div className="form-actions">
              <button type="button" className="btn btn-danger" onClick={() => navigate("/dashboard")}>
                Cancel
              </button>

              <button type="submit" className="btn-success" disabled={loading}>
                {loading ? "Creating..." : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
