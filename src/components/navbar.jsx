import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { logout } from "../store/slices/authSlice";
import { fetchNotifications, markAsRead, markAllAsRead } from "../store/slices/notificationSlice";
import "./Navbar.css";

const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export default function Navbar() {
  const { user, token } = useSelector((state) => state.auth);
  const { notifications, unreadCount } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    if (token) dispatch(fetchNotifications());
  }, [token, dispatch]);

  useEffect(() => {
    const handleClick = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false); };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => { dispatch(logout()); navigate("/login"); };

  const getLinks = () => {
    if (!user) return [];
    if (user.role === "student") return [
      { to: "/dashboard", label: "Home" },
      { to: "/courses", label: "Courses" },
      { to: "/blogs", label: "Blogs" },
      { to: "/certificates", label: "Certificates" },
      { to: "/profile", label: "Profile" },
    ];
    if (user.role === "teacher") return [
      { to: "/teacher/dashboard", label: "Dashboard" },
      { to: "/blogs", label: "Blogs" },
      { to: "/profile", label: "Profile" },
    ];
    if (user.role === "admin") return [
      { to: "/admin/dashboard", label: "Analytics" },
      { to: "/admin/users", label: "Users" },
    ];
    return [];
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">EduLearn</Link>
      <ul className="navbar-links">
        {getLinks().map((link) => (
          <li key={link.to}>
            <NavLink to={link.to} className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}>
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="navbar-icons">
        {token && (
          <div className="notif-wrapper" ref={notifRef}>
            <button className="icon-btn" aria-label="Notifications" onClick={() => setShowNotif(!showNotif)}>
              <BellIcon />
              {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
            </button>
            {showNotif && (
              <div className="notif-dropdown">
                <div className="notif-header">
                  <span>Notifications</span>
                  {unreadCount > 0 && <button className="notif-mark-all" onClick={() => dispatch(markAllAsRead())}>Mark all read</button>}
                </div>
                {notifications.length === 0 ? (
                  <p className="notif-empty">No notifications</p>
                ) : (
                  notifications.slice(0, 10).map((n) => (
                    <div key={n._id} className={`notif-item ${n.isRead ? "" : "unread"}`} onClick={() => { dispatch(markAsRead(n._id)); if (n.link) navigate(n.link); setShowNotif(false); }}>
                      <p className="notif-title">{n.type?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</p>
                      <p className="notif-msg">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
        {user && (
          <span className="navbar-user">{user.name?.split(" ")[0]}</span>
        )}
        {token && (
          <button className="icon-btn" aria-label="Logout" onClick={handleLogout}>
            <LogoutIcon />
          </button>
        )}
      </div>
    </nav>
  );
}