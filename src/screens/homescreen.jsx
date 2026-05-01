import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../api/axios';
import './stylesheets/homescreen.css';

const HomeScreen = () => {
  const { user } = useSelector((state) => state.auth);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await API.get('/profile/me');
        const profile = data.data.profile;
        if (profile?.enrolledCourses?.length) {
          // enrolledCourses are ObjectId strings — fetch full course details
          const coursePromises = profile.enrolledCourses.map((id) => {
            const courseId = typeof id === 'object' ? id._id : id;
            return API.get(`/courses/${courseId}`).catch(() => null);
          });
          const results = await Promise.all(coursePromises);
          const courses = results.filter(r => r).map(r => r.data.data);
          setEnrolledCourses(courses);
        }
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    loadProfile();
  }, []);

  const iconColors = ['#2563eb', '#9333ea', '#0f766e', '#f59e0b', '#ef4444', '#06b6d4'];

  return (
    <>
      <Navbar />
      <div className="dashboard-wrapper">
        <div className="dashboard-header">
          <h1>Welcome back, {user?.name?.split(' ')[0] || 'Student'}</h1>
          <p>Continue your learning journey.</p>
        </div>
        <div className="dashboard-grid">
          {loading ? (
            <div className="course-card"><p style={{ color: '#999', padding: '2rem' }}>Loading your courses...</p></div>
          ) : enrolledCourses.length === 0 ? (
            <div className="course-card">
              <p style={{ color: '#999', padding: '2rem' }}>You haven't enrolled in any courses yet.</p>
            </div>
          ) : (
            enrolledCourses.map((course, idx) => (
              <Link to={`/courses/${course._id}`} key={course._id} className="course-card" style={{ textDecoration: 'none' }}>
                <div className="card-top">
                  <div className="course-icon" style={{ backgroundColor: iconColors[idx % iconColors.length], color: '#fff' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                  </div>
                  <span className="course-badge">{course.difficulty || 'beginner'}</span>
                </div>
                <h2 className="course-subject">{course.title}</h2>
                <p className="course-topic">{course.category}</p>
                <div className="card-bottom">
                  <button className="btn btn-primary">Continue Learning</button>
                </div>
              </Link>
            ))
          )}
          <Link to="/courses" className="course-card explore-card" style={{ textDecoration: 'none' }}>
            <div className="explore-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
            </div>
            <h2 className="explore-title">Explore Courses</h2>
            <p className="explore-subtitle">Find new subjects to master.</p>
          </Link>
        </div>
      </div>
    </>
  );
};

export default HomeScreen;