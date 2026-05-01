import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import axiosInstance from '../api/axios';
import './stylesheets/homescreen.css';
import Navbar from '../components/Navbar';

const HomeScreen = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get('/courses');
        const coursesData = response.data.data || response.data || [];
        setCourses(Array.isArray(coursesData) ? coursesData : []);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch courses');
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="homescreen-container">
      <Navbar activeLink="Home" />
      <div className="dashboard-wrapper">
        <div className="dashboard-header">
          <h1>Welcome back, {user?.name ? user.name.split(' ')[0] : 'Student'}</h1>
          <p>Select a course to continue your learning journey.</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading courses...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</div>
        ) : (
          <div className="dashboard-grid">
            {courses.length === 0 ? (
              <div style={{ padding: '2rem' }}>No courses found.</div>
            ) : (
              courses.map((course) => (
                <div key={course._id || course.id} className="course-card">
                  <div className="card-top">
                    <div 
                      className="course-icon" 
                      style={{ backgroundColor: '#e0e7ff', color: '#0033cc' }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="16 18 22 12 16 6"></polyline>
                        <polyline points="8 6 2 12 8 18"></polyline>
                      </svg>
                    </div>
                    {course.category && (
                      <span className="course-badge" style={{ backgroundColor: '#ccfbf1', color: '#0f766e', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                        {course.category.toUpperCase()}
                      </span>
                    )}
                  </div>
                  
                  <h2 className="course-subject">{course.title || course.subject}</h2>
                  <p className="course-topic">{course.description ? (course.description.length > 50 ? course.description.substring(0, 50) + '...' : course.description) : course.topic}</p>

                  <div className="card-bottom">
                    <button className="btn btn-primary" onClick={() => navigate(`/course/${course._id || course.id}`)}>
                      View Course
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '8px'}}>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}

            <div className="course-card explore-card" onClick={() => navigate('/courses')}>
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
        )}
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
