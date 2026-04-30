import React from 'react';
import './stylesheets/homescreen.css';
import Navbar from '../components/Navbar';

const mockCourses = [
  {
    id: 1,
    subject: 'Computer Science',
    topic: 'Data Structures & Algorithms',
    badge: 'In Progress',
    progress: 60,
    iconColor: '#2563eb',
    textColor: '#ffffff',
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
    iconColor: '#9333ea',
    textColor: '#ffffff',
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
    badge: 'New Content',
    progress: 15,
    iconColor: '#0f766e',
    textColor: '#ffffff',
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
    iconColor: '#f1f5f9',
    textColor: '#475569',
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
    badge: 'Review Pending',
    progress: 100,
    iconColor: '#f1f5f9',
    textColor: '#475569',
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
    <>
    <Navbar activeLink = "Home" />
    <div className="dashboard-wrapper">
      <div className="dashboard-header">
        <h1>Welcome back, Student</h1>
        <p>Continue your learning journey.</p>
      </div>

      <div className="dashboard-grid">
        {mockCourses.map((course) => (
          <div key={course.id} className="course-card">
            <div className="card-top">
              <div 
                className="course-icon" 
                style={{ backgroundColor: course.iconColor, color: course.textColor }}
              >
                {course.icon}
              </div>
              {course.badge && <span className="course-badge">{course.badge}</span>}
            </div>
            
            <h2 className="course-subject">{course.subject}</h2>
            <p className="course-topic">{course.topic}</p>

            <div className="card-bottom">
              {course.progress !== undefined ? (
                <div className="progress-container">
                  <div className="progress-track">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {course.progress === 100 ? 'Completed' : `${course.progress}% Complete`}
                  </span>
                </div>
              ) : (
                <button className={`btn btn-${course.actionType}`}>
                  {course.action}
                </button>
              )}
            </div>
          </div>
        ))}

        <div className="course-card explore-card">
          <div className="explore-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </div>
          <h2 className="explore-title">Explore Courses</h2>
          <p className="explore-subtitle">Find new subjects to master.</p>
        </div>
      </div>
    </div>
    </>
  );
};

export default HomeScreen;