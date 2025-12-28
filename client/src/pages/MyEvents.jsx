import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import "../App.css";

export default function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [eventStatus, setEventStatus] = useState({});

  const { token, user } = useAuth();
  const navigate = useNavigate();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data.filter((e) => e.joined));
    } catch (err) {
      console.error("FETCH ERROR:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchEvents();
  }, [token]);

  const handleLeave = async (eventId) => {
    try {
      setActionLoading((p) => ({ ...p, [eventId]: true }));
      await api.post(`/api/rsvp/${eventId}/leave`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEventStatus((p) => ({
        ...p,
        [eventId]: { type: "success", text: "Left" },
      }));

      await fetchEvents();
    } catch {
      setEventStatus((p) => ({
        ...p,
        [eventId]: { type: "error", text: "Failed" },
      }));
    } finally {
      setActionLoading((p) => ({ ...p, [eventId]: false }));
      setTimeout(() => {
        setEventStatus((p) => {
          const copy = { ...p };
          delete copy[eventId];
          return copy;
        });
      }, 1500);
    }
  };

  return (
    <DashboardLayout loading={loading} user={user}>
      <div className="dashboard">
        <h2 className="event-page-title">My Events</h2>
        {events.length === 0 ? (
          <div className="dashboard-empty">
            <p>You haven't joined any events yet.</p>
            <button className="btn-success" onClick={() => navigate("/dashboard")}>
              Browse Events
            </button>
          </div>
        ) : (
          <div className="grid-layout">
            {events.map((event) => (
              <div key={event._id} className="grid-box">
                {eventStatus[event._id] && (
                  <span className={`status-text ${eventStatus[event._id].type}`}>
                    {eventStatus[event._id].text}
                  </span>
                )}
                <h3>{event.title}</h3>
                <p className="grid-content">{event.description}</p>
                <p className="location-info">
                  {new Date(event.datetime).toLocaleString()} — {event.location}
                </p>
                <p className="attendee-info">
                  Attendees: {event.attendeesCount} / {event.capacity}
                </p>

                <div className="event-actions">
                  <button
                    className="btn-warning"
                    disabled={actionLoading[event._id]}
                    onClick={() => handleLeave(event._id)}
                  >
                    Leave
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}