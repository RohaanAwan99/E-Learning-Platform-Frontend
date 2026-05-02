import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../api/axios';
import './stylesheets/studentDashboard.css';

const HomeScreen = () => {
  const { user } = useSelector((state) => state.auth);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const { data } = await API.get('/progress/dashboard');
        setDashboard(data.data);
      } catch (err) {
        console.error('Dashboard load error:', err);
      }
      setLoading(false);
    };
    loadDashboard();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const inProgressCourses = dashboard?.courses?.filter(c => !c.isCompleted && c.lectureProgress > 0) || [];
  const notStartedCourses = dashboard?.courses?.filter(c => !c.isCompleted && c.lectureProgress === 0) || [];
  const completedCourses = dashboard?.courses?.filter(c => c.isCompleted) || [];

  return (
    <>
      <Navbar />
      <div className="dashboard-wrapper">
        <div className="dashboard-header">
          <h1>Welcome back, {user?.name?.split(' ')[0] || 'Student'} 👋</h1>
          <p>Here's an overview of your learning journey.</p>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <>
            <div className="stats-row">
              {[1,2,3,4].map(i => (
                <div key={i} className="skeleton-card stat-card">
                  <div className="skeleton-line short"></div>
                  <div className="skeleton-line medium"></div>
                </div>
              ))}
            </div>
            <div className="course-progress-grid">
              {[1,2].map(i => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line short"></div>
                  <div className="skeleton-line medium"></div>
                </div>
              ))}
            </div>
          </>
        ) : !dashboard || dashboard.totalEnrolled === 0 ? (
          /* Empty State */
          <div className="empty-state">
            <p style={{fontSize:'2.5rem',marginBottom:'0.5rem'}}>📚</p>
            <p>You haven't enrolled in any courses yet.</p>
            <Link to="/courses">Explore Courses</Link>
          </div>
        ) : (
          <>
            {/* Stats Row */}
            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-icon" style={{background:'#eff6ff',color:'#3b82f6'}}>📘</div>
                <div className="stat-value">{dashboard.totalEnrolled}</div>
                <div className="stat-label">Enrolled Courses</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{background:'#f0fdf4',color:'#22c55e'}}>✅</div>
                <div className="stat-value">{dashboard.totalCompleted}</div>
                <div className="stat-label">Completed</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{background:'#fef3c7',color:'#f59e0b'}}>📝</div>
                <div className="stat-value">{dashboard.quizzesPassed}/{dashboard.quizzesAttempted || 0}</div>
                <div className="stat-label">Quizzes Passed</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{background:'#f5f3ff',color:'#8b5cf6'}}>🎓</div>
                <div className="stat-value">{dashboard.certificatesEarned}</div>
                <div className="stat-label">Certificates</div>
              </div>
            </div>

            {/* Continue Learning */}
            {inProgressCourses.length > 0 && (
              <>
                <div className="section-header">
                  <h2>📖 Continue Learning</h2>
                </div>
                <div className="course-progress-grid">
                  {inProgressCourses.map(course => (
                    <div key={course.courseId} className="course-progress-card">
                      <Link to={`/courses/${course.courseId}`} style={{textDecoration:'none',color:'inherit'}}>
                        <div className="card-top-row">
                          <h3 className="course-title">{course.title}</h3>
                          <span style={{fontSize:'0.72rem',padding:'0.2rem 0.5rem',borderRadius:'6px',background:'var(--bg-muted)',color:'var(--text-muted)',fontWeight:600,whiteSpace:'nowrap'}}>{course.difficulty || 'Beginner'}</span>
                        </div>
                        <span className="course-meta">{course.category} · {course.completedLectures}/{course.totalLectures} lectures</span>
                        <div className="progress-bar-container">
                          <div className="progress-bar-bg">
                            <div className="progress-bar-fill" style={{width:`${course.lectureProgress}%`}}></div>
                          </div>
                          <div className="progress-bar-label">
                            <span>{course.lectureProgress}% complete</span>
                            <span>{course.quizzesPassed}/{course.totalQuizzes} quizzes</span>
                          </div>
                        </div>
                      </Link>
                      <Link to={`/courses/${course.courseId}/stats`} style={{display:'inline-block',marginTop:'0.5rem',fontSize:'0.8rem',color:'var(--accent)',fontWeight:600,textDecoration:'none'}}>📊 View Stats →</Link>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Not Started */}
            {notStartedCourses.length > 0 && (
              <>
                <div className="section-header">
                  <h2>🆕 Get Started</h2>
                </div>
                <div className="course-progress-grid">
                  {notStartedCourses.map(course => (
                    <Link to={`/courses/${course.courseId}`} key={course.courseId} className="course-progress-card">
                      <h3 className="course-title">{course.title}</h3>
                      <span className="course-meta">{course.category} · {course.totalLectures} lectures · {course.totalQuizzes} quizzes</span>
                      <div className="progress-bar-container">
                        <div className="progress-bar-bg">
                          <div className="progress-bar-fill" style={{width:'0%'}}></div>
                        </div>
                        <div className="progress-bar-label">
                          <span>Not started</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}

            {/* Recent Activity */}
            {dashboard.recentActivity?.length > 0 && (
              <>
                <div className="section-header">
                  <h2>⚡ Recent Activity</h2>
                </div>
                <div className="activity-feed" style={{background:'var(--bg-card, #fff)',borderRadius:'14px',padding:'0.5rem 1.25rem',border:'1px solid var(--border, #e2e8f0)',marginBottom:'2rem'}}>
                  {dashboard.recentActivity.map((activity, i) => (
                    <div key={i} className="activity-item">
                      <div className="activity-icon" style={{
                        background: activity.type === 'lecture_completed' ? '#f0fdf4' : activity.passed ? '#f0fdf4' : '#fef2f2'
                      }}>
                        {activity.type === 'lecture_completed' ? '📖' : activity.passed ? '✅' : '❌'}
                      </div>
                      <div className="activity-text">
                        <strong>
                          {activity.type === 'lecture_completed'
                            ? 'Completed a lecture'
                            : `Quiz ${activity.passed ? 'passed' : 'attempted'} — ${activity.score}%`
                          }
                        </strong>
                        <span>{formatDate(activity.timestamp)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Completed Courses */}
            {completedCourses.length > 0 && (
              <>
                <div className="section-header">
                  <h2>🏆 Completed</h2>
                  <Link to="/certificates">View Certificates →</Link>
                </div>
                <div className="completed-grid">
                  {completedCourses.map(course => (
                    <Link to={`/courses/${course.courseId}`} key={course.courseId} className="completed-card">
                      <div className="completed-badge">🎉</div>
                      <div className="completed-info">
                        <h3>{course.title}</h3>
                        <p>{course.category} · {course.quizzesPassed}/{course.totalQuizzes} quizzes passed</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}

            {/* Explore More */}
            <div style={{textAlign:'center',marginTop:'1rem'}}>
              <Link to="/courses" style={{
                display:'inline-flex',alignItems:'center',gap:'0.4rem',
                color:'var(--accent, #6366f1)',fontWeight:600,fontSize:'0.9rem',textDecoration:'none'
              }}>
                Explore more courses →
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default HomeScreen;