import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import axiosInstance from '../api/axios';
import Navbar from "../components/Navbar";
import "./stylesheets/tutorialscreen.css";

function Sidebar({ course, title, isEnrolled, onEnroll }) {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <p className="sidebar-title">{title}</p>
        <p className="sidebar-subtitle">{course ? course.category : 'Course'}</p>
        {isEnrolled ? (
          <button onClick={() => navigate("/quiz")} className="quiz-start-btn">Attempt Quiz</button>
        ) : (
          <button onClick={onEnroll} className="quiz-start-btn" style={{ backgroundColor: '#2b5a9e' }}>Enroll Now</button>
        )}
      </div>
      <nav className="sidebar-nav">
        <a href="#" className="sidebar-item active">
          <span className="sidebar-item-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 21V9" />
            </svg>
          </span>
          Introduction
        </a>
      </nav>
    </aside>
  );
}

export default function TutorialScreen() {
  const { id } = useParams();
  const { user } = useSelector(state => state.auth);
  const [course, setCourse] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, profileRes] = await Promise.all([
          axiosInstance.get(`/courses/${id}`),
          axiosInstance.get('/profile/me')
        ]);
        setCourse(courseRes.data.data || courseRes.data);
        setProfile(profileRes.data.data?.profile || profileRes.data.profile);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      await axiosInstance.post(`/courses/${id}/enroll`);
      // Update local state to reflect enrollment
      const profileRes = await axiosInstance.get('/profile/me');
      setProfile(profileRes.data.data?.profile || profileRes.data.profile);
      alert('Successfully enrolled!');
    } catch (err) {
      alert('Failed to enroll: ' + (err.response?.data?.message || err.message));
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <div><Navbar /><div style={{padding: '2rem'}}>Loading course...</div></div>;
  if (!course) return <div><Navbar /><div style={{padding: '2rem'}}>Course not found.</div></div>;

  const isEnrolled = profile?.enrolledCourses?.includes(course._id) || false;

  return (
    <div className="app">
      <Navbar activeLink="Tutorials" />
      <div className="layout">
        <Sidebar course={course} title={course.title} isEnrolled={isEnrolled} onEnroll={handleEnroll} />
        <main className="main-content">
          <article>
            <h1>{course.title}</h1>
            <p className="intro">
              {course.description}
            </p>
            {!isEnrolled ? (
              <div style={{ marginTop: '2rem', padding: '2rem', border: '1px solid #e2e8f0', borderRadius: '8px', textAlign: 'center' }}>
                <h2>Enroll to view course concepts</h2>
                <p>Register for this course to gain full access to all materials and quizzes.</p>
                <button onClick={handleEnroll} disabled={enrolling} style={{ padding: '0.75rem 1.5rem', background: '#2b5a9e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '1rem' }}>
                  {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </button>
              </div>
            ) : (
              <div>
                <section className="article-section">
                  <h2>Course Overview</h2>
                  <p className="body-text">Welcome to {course.title}. Here you will learn about {course.category}.</p>
                  <ul className="feature-list">
                    <li><strong>Difficulty:</strong> {course.difficulty || 'All Levels'}</li>
                    {course.tags && course.tags.length > 0 && <li><strong>Tags:</strong> {course.tags.join(', ')}</li>}
                  </ul>
                </section>
                <p style={{ marginTop: '2rem', color: '#64748b' }}>Modules and videos will appear here...</p>
              </div>
            )}
          </article>
        </main>
      </div>
    </div>
  );
}
