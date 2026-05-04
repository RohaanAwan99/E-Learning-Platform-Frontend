import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, clearError } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import './stylesheets/loginpage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Please fill in all fields"); return; }
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      const role = result.payload.user.role;
      toast.success("Login successful!");
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'teacher') navigate('/teacher/dashboard');
      else navigate('/dashboard');
    } else {
      toast.error(result.payload || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="logo-container">
            <svg className="logo-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
            </svg>
            <span className="logo-text">EduLearn</span>
          </div>
          <h1 className="hero-title">Welcome to your<br />digital sanctuary<br />for learning.</h1>
          <p className="hero-subtitle">A streamlined, accessible platform designed<br />to reduce cognitive load and support your<br />academic journey.</p>
        </div>
      </div>
      <div className="form-section">
        <div className="form-wrapper">
          <h2 className="form-title">Log in</h2>
          <p className="form-subtitle">Enter your credentials to access your account.</p>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <input type="email" id="email" placeholder="student@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="input-group">
              <div className="password-header">
                <label htmlFor="password">Password</label>
              </div>
              <div className="input-wrapper">
                <input type={showPassword ? "text" : "password"} id="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Logging in..." : "Login to Account"}
              {!loading && <svg className="arrow-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>}
            </button>
          </form>
          <p className="signup-text">Don't have an account yet? <Link to="/signup">Sign up as a Student or Teacher</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
