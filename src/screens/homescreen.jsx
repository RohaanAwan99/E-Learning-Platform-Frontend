import React from 'react';
import { Link } from "react-router-dom";
import './stylesheets/homescreen.css';
import Navbar from '../components/Navbar';

const mockCourses = [
  {
    id: 1,
    subject: 'Computer Science',
    topic: 'Data Structures & Algorithms',
    badge: 'IN PROGRESS',
    progress: 60,
    moduleInfo: 'Module 4 of 7',
    iconBgColor: '#e0e7ff',
    iconColor: '#0033cc',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      </svg>
    )
  },
  {
    id: 2,
    subject: 'Mathematics',
    topic: 'Advanced Calculus II',
    action: 'Start Next Module',
    actionType: 'primary',
    iconBgColor: '#f3e8ff',
    iconColor: '#9333ea',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
        <line x1="9" y1="9" x2="15" y2="15"></line>
        <line x1="15" y1="9" x2="9" y2="15"></line>
      </svg>
    )
  },
  {
    id: 3,
    subject: 'Economics',
    topic: 'Macroeconomic Theory',
    badge: 'NEW CONTENT',
    progress: 15,
    moduleInfo: 'Module 1 of 8',
    iconBgColor: '#ccfbf1',
    iconColor: '#0f766e',
    badgeStyle: 'new-content',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
      </svg>
    )
  },
  {
    id: 4,
    subject: 'Literature',
    topic: 'Modern European Fiction',
    action: 'View Syllabus',
    actionType: 'secondary',
    iconBgColor: '#f1f5f9',
    iconColor: '#475569',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
      </svg>
    )
  },
  {
    id: 5,
    subject: 'Physics',
    topic: 'Quantum Mechanics Introduction',
    badge: 'REVIEW PENDING',
    progress: 100,
    iconBgColor: '#f1f5f9',
    iconColor: '#475569',
    badgeStyle: 'review-pending',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 2v4"></path>
        <path d="M15 2v4"></path>
        <path d="M3 10h18"></path>
        <rect x="3" y="6" width="18" height="16" rx="2"></rect>
      </svg>
    )
  }
];

const HomeScreen = () => {
  return (
    <div className="homescreen-container">
      <Navbar activeLink="Home" />
      <div className="dashboard-wrapper">
        <div className="dashboard-header">
          <h1>Welcome back, Student</h1>
          <p>Select a course to continue your learning journey.</p>
        </div>

        <div className="dashboard-grid">
          {mockCourses.map((course) => (
            <div key={course.id} className="course-card">
              <div className="card-top">
                <div 
                  className="course-icon" 
                  style={{ backgroundColor: course.iconBgColor, color: course.iconColor }}
                >
                  {course.icon}
                </div>
                {course.badge && (
                  <span className={`course-badge ${course.badgeStyle || ''}`}>
                    {course.badge}
                  </span>
                )}
              </div>
              
              <h2 className="course-subject">{course.subject}</h2>
              <p className="course-topic">{course.topic}</p>

              <div className="card-bottom">
                {course.progress !== undefined ? (
                  <div className="progress-container">
                    <div className="progress-header">
                      {course.progress === 100 ? (
                        <span className="progress-text completed-text">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '4px'}}>
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                          Completed
                        </span>
                      ) : (
                        <span className="progress-text" style={{ color: course.iconColor }}>
                          {`${course.progress}% Complete`}
                        </span>
                      )}
                      {course.moduleInfo && (
                        <span className="module-info">{course.moduleInfo}</span>
                      )}
                    </div>
                    <div className="progress-track">
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${course.progress}%`,
                          backgroundColor: course.progress === 100 ? '#94a3b8' : course.iconColor
                        }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <button className={`btn btn-${course.actionType}`}>
                    {course.action}
                    {course.actionType === 'primary' && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '8px'}}>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}

          <div className="course-card explore-card">
            <div className="explore-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </div>
            <h2 className="explore-title">Explore Courses</h2>
            <p className="explore-subtitle">Discover new subjects and<br/>expand your horizons.</p>
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">EduSanctuary</div>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Support</a>
          </div>
          <div className="footer-copyright">
            © 2026 EduLearn
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeScreen;