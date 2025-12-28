import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import "../App.css";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventStatus, setEventStatus] = useState({});
  const [actionLoading, setActionLoading] = useState({});

  const { logout, user, token } = useAuth();
  const navigate = useNavigate();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data);
    } catch (err) {
      console.error("EVENT FETCH ERROR:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchEvents();
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };



  const handleJoin = async (eventId) => {
    try {
      setActionLoading((p) => ({ ...p, [eventId]: true }));
      await api.post(`/api/rsvp/${eventId}/join`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setEventStatus((p) => ({ ...p, [eventId]: { type: "success", text: "Joined ✓" } }));
      await fetchEvents();
    } catch {
      setEventStatus((p) => ({ ...p, [eventId]: { type: "error", text: "Failed" } }));
    } finally {
      setActionLoading((p) => ({ ...p, [eventId]: false }));
      clearStatusAfterDelay(eventId);
    }
  };

  const handleLeave = async (eventId) => {
    try {
      setActionLoading((p) => ({ ...p, [eventId]: true }));
      await api.post(`/api/rsvp/${eventId}/leave`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setEventStatus((p) => ({ ...p, [eventId]: { type: "success", text: "Left" } }));
      await fetchEvents();
    } catch {
      setEventStatus((p) => ({ ...p, [eventId]: { type: "error", text: "Failed" } }));
    } finally {
      setActionLoading((p) => ({ ...p, [eventId]: false }));
      clearStatusAfterDelay(eventId);
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await api.delete(`/api/events/${eventId}`, { headers: { Authorization: `Bearer ${token}` } });
      setEvents((p) => p.filter((e) => e._id !== eventId));
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

  const clearStatusAfterDelay = (eventId) => {
    setTimeout(() => {
      setEventStatus((p) => {
        const copy = { ...p };
        delete copy[eventId];
        return copy;
      });
    }, 1500);
  };


  const totalEvents = events.length;
  const upcomingEvents = events.filter(e => new Date(e.datetime) > new Date()).length;
  const joinedEvents = events.filter(e => e.joined).length;

  return (
    <DashboardLayout loading={loading} user={user} logout={handleLogout}>
      <div className="dashboard">
        <div className="stats-row">
          <div className="stat-card">
            <h3>{totalEvents}</h3>
            <p>Total Events</p>
          </div>
          <div className="stat-card">
            <h3>{upcomingEvents}</h3>
            <p>Upcoming Events</p>
          </div>
          <div className="stat-card">
            <h3>{joinedEvents}</h3>
            <p>Joined Events</p>
          </div>
        </div>
        {events.length === 0 ? (
          <div className="dashboard-empty">
            <h3>No events yet..</h3>
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
                  {event.joined ? (
                    <button
                      className="btn-warning"
                      disabled={actionLoading[event._id]}
                      onClick={() => handleLeave(event._id)}
                    >
                      Leave
                    </button>
                  ) : (
                    <button
                      className={`btn-success ${!event.available ? "disabled" : ""}`}
                      disabled={actionLoading[event._id] || !event.available}
                      onClick={() => handleJoin(event._id)}
                    >
                      {event.available ? "Join" : "Full"}
                    </button>
                  )}

                  {user?.role === "admin" && event.createdBy?._id === user.id && (
                    <>
                      <button
                        className="btn-info"
                        onClick={() => navigate(`/edit-event/${event._id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-danger"
                        onClick={() => handleDelete(event._id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}