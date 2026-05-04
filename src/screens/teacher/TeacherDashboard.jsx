import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/navbar';
import API from '../../api/axios';
import '../stylesheets/studentDashboard.css';

export default function TeacherDashboard() {
  const [courses, setCourses] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/profile/me').then(async (profileRes) => {
      const user = profileRes.data.data.user;
      // Always fetch by instructor ID to catch all courses
      const cRes = await API.get(`/courses?instructor=${user._id}`);
      setCourses(cRes.data.data || []);
      // Fetch teacher's blogs
      try {
        const bRes = await API.get(`/blogs?author=${user._id}`);
        setBlogs(bRes.data.data || []);
      } catch { setBlogs([]); }
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const totalStudents = courses.reduce((sum, c) => sum + (c.totalEnrolments || 0), 0);

  return (
    <><Navbar />
      <div className="dashboard-wrapper">
        <div className="dashboard-header">
          <h1>Teacher Dashboard</h1>
          <p>Manage your courses and content.</p>
        </div>

        {/* Stats Row */}
        <div className="stats-row" style={{gridTemplateColumns:'repeat(4, 1fr)'}}>
          <div style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',padding:'1.5rem',borderRadius:'14px'}}>
            <p style={{opacity:0.8,margin:0,fontSize:'0.85rem'}}>Total Courses</p>
            <h2 style={{margin:'0.25rem 0 0',fontSize:'2rem',color:'#fff'}}>{courses.length}</h2>
          </div>
          <div style={{background:'linear-gradient(135deg,#0f766e,#14b8a6)',color:'#fff',padding:'1.5rem',borderRadius:'14px'}}>
            <p style={{opacity:0.8,margin:0,fontSize:'0.85rem'}}>Total Students</p>
            <h2 style={{margin:'0.25rem 0 0',fontSize:'2rem',color:'#fff'}}>{totalStudents}</h2>
          </div>
          <Link to="/teacher/courses/new" style={{background:'linear-gradient(135deg,#f59e0b,#f97316)',color:'#fff',padding:'1.5rem',borderRadius:'14px',textDecoration:'none',display:'flex',flexDirection:'column',justifyContent:'center'}}>
            <p style={{margin:0,fontSize:'0.85rem',opacity:0.8}}>Quick Action</p>
            <h2 style={{margin:'0.25rem 0 0',fontSize:'1.2rem',color:'#fff'}}>+ Create Course</h2>
          </Link>
          <Link to="/teacher/blogs/new" style={{background:'linear-gradient(135deg,#ec4899,#f43f5e)',color:'#fff',padding:'1.5rem',borderRadius:'14px',textDecoration:'none',display:'flex',flexDirection:'column',justifyContent:'center'}}>
            <p style={{margin:0,fontSize:'0.85rem',opacity:0.8}}>Quick Action</p>
            <h2 style={{margin:'0.25rem 0 0',fontSize:'1.2rem',color:'#fff'}}>+ Create Blog</h2>
          </Link>
        </div>

        {/* Courses */}
        <div className="section-header">
          <h2>📚 Your Courses</h2>
        </div>
        <div className="course-progress-grid">
          {loading ? <p style={{color:'var(--text-muted)'}}>Loading...</p> : courses.length === 0 ? <p style={{color:'var(--text-muted)'}}>No courses yet. Create your first!</p> :
            courses.map(c => (
              <Link to={`/teacher/courses/${c._id}`} key={c._id} className="course-progress-card">
                <h3 className="course-title">{c.title}</h3>
                <span className="course-meta">{c.category} · {c.difficulty}</span>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.82rem',color:'var(--text-muted)'}}>
                  <span>👥 {c.totalEnrolments} students</span>
                  <span style={{color: c.isPublished ? 'var(--success)' : 'var(--warning)', fontWeight:600}}>{c.isPublished ? '✅ Published' : '📝 Draft'}</span>
                </div>
              </Link>
            ))
          }
        </div>

        {/* Blog Posts */}
        {blogs.length > 0 && (
          <>
            <div className="section-header" style={{marginTop:'1rem'}}>
              <h2>📝 Your Blog Posts</h2>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
              {blogs.map(b => (
                <Link to={`/blogs/${b._id}`} key={b._id} style={{textDecoration:'none',color:'inherit',background:'var(--bg-card)',padding:'1rem 1.25rem',borderRadius:'12px',border:'1px solid var(--border)',boxShadow:'var(--shadow-sm)',display:'flex',justifyContent:'space-between',alignItems:'center',transition:'background 0.25s,border-color 0.25s'}}>
                  <div>
                    <h3 style={{margin:0,fontSize:'0.95rem',color:'var(--text-heading)'}}>{b.title}</h3>
                    <p style={{margin:'0.25rem 0 0',fontSize:'0.78rem',color:'var(--text-muted)'}}>💬 {b.comments?.length || 0} comments · {b.tags?.join(', ')}</p>
                  </div>
                  <span style={{fontSize:'0.75rem',color:b.isPublished?'var(--success)':'var(--warning)',fontWeight:600}}>{b.isPublished ? '✅ Published' : '📝 Draft'}</span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

