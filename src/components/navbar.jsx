import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { logout } from "../store/slices/authSlice";
import { fetchNotifications, markAsRead, markAllAsRead } from "../store/slices/notificationSlice";
import ThemeToggle from "./ThemeToggle";
import "./navbar.css";

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

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function Navbar() {
  const { user, token } = useSelector((state) => state.auth);
  const { notifications, unreadCount } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    if (token) dispatch(fetchNotifications());
  }, [token, dispatch]);

  useEffect(() => {
    const handleClick = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false); };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [window.location.pathname]);

  const handleLogout = () => { dispatch(logout()); navigate("/login"); };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

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
      { to: "/teacher/students", label: "My Students" },
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
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">EduLearn</Link>

        {/* Search bar for students */}
        {user?.role === 'student' && (
          <form onSubmit={handleSearch} className="navbar-search-form">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="navbar-search-input"
            />
          </form>
        )}

        {/* Desktop Links */}
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
          <ThemeToggle />
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
          {/* Hamburger for mobile */}
          <button className="hamburger-btn" aria-label="Menu" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          {user?.role === 'student' && (
            <form onSubmit={handleSearch} className="mobile-search-form">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="navbar-search-input"
              />
            </form>
          )}
          <ul className="mobile-links">
            {getLinks().map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `mobile-link ${isActive ? "active" : ""}`}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
          {token && (
            <button className="mobile-logout" onClick={handleLogout}>
              <LogoutIcon /> Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
