import React, { useState } from 'react';
import './stylesheets/signuppage.css';

const SignupPage = () => {
  const [role, setRole] = useState('student');

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="header-section">
          <div className="logo-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
            </svg>
          </div>
          <h1 className="title">Create your account</h1>
          <p className="subtitle">Join EduPortal and start your learning journey.</p>
        </div>

        <div className="role-selection">
          <label className="section-label">I am a...</label>
          <div className="role-cards">
            <div 
              className={`role-card ${role === 'student' ? 'active' : ''}`}
              onClick={() => setRole('student')}
            >
              {role === 'student' && (
                <div className="check-badge">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              )}
              <svg className="role-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                <path d="M8 7h6"></path>
                <path d="M8 11h8"></path>
              </svg>
              <span>Student</span>
            </div>
            
            <div 
              className={`role-card ${role === 'teacher' ? 'active' : ''}`}
              onClick={() => setRole('teacher')}
            >
               {role === 'teacher' && (
                <div className="check-badge">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              )}
              <svg className="role-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>Teacher</span>
            </div>
          </div>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="signup-form">
          <div className="input-group">
            <label htmlFor="fullName">Full Name</label>
            <input type="text" id="fullName" placeholder="Jane Doe" />
          </div>

          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" placeholder="janedoe99" />
          </div>

          <div className="input-row">
            <div className="input-group">
              <label htmlFor="age">Age</label>
              <input type="number" id="age" placeholder="18" />
            </div>
            <div className="input-group">
              <label htmlFor="gender">Gender</label>
              <div className="select-wrapper">
                <select id="gender" defaultValue="">
                  <option value="" disabled>Select...</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
                <svg className="select-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" placeholder="jane@example.com" />
          </div>

          <div className="input-row">
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" placeholder="••••••••" />
            </div>
            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input type="password" id="confirmPassword" placeholder="••••••••" />
            </div>
          </div>

          <div className="terms-group">
            <input type="checkbox" id="terms" />
            <label htmlFor="terms">
              I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
            </label>
          </div>

          <button type="submit" className="submit-button">
            Create Account
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </form>

        <p className="login-prompt">
          Already have an account? <a href="#">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;