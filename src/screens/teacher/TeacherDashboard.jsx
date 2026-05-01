import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import API from '../../api/axios';
import '../stylesheets/homescreen.css';

export default function TeacherDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/profile/me').then(async (res) => {
      const profile = res.data.data.profile;
      if (profile?.publishedCourses?.length) {
        const results = await Promise.all(profile.publishedCourses.map(id => API.get(`/courses/${id}`).catch(() => null)));
        setCourses(results.filter(r => r).map(r => r.data.data));
      }
      // If no publishedCourses field, try fetching by instructor
      if (!profile?.publishedCourses) {
        const user = res.data.data.user;
        const cRes = await API.get(`/courses?instructor=${user._id}`);
        setCourses(cRes.data.data || []);
      }
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
        <div style={{display:'flex',gap:'1rem',marginBottom:'2rem',flexWrap:'wrap'}}>
          <div style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',padding:'1.5rem',borderRadius:'14px',flex:1,minWidth:'180px'}}>
            <p style={{opacity:0.8,margin:0,fontSize:'0.85rem'}}>Total Courses</p>
            <h2 style={{margin:'0.25rem 0 0',fontSize:'2rem'}}>{courses.length}</h2>
          </div>
          <div style={{background:'linear-gradient(135deg,#0f766e,#14b8a6)',color:'#fff',padding:'1.5rem',borderRadius:'14px',flex:1,minWidth:'180px'}}>
            <p style={{opacity:0.8,margin:0,fontSize:'0.85rem'}}>Total Students</p>
            <h2 style={{margin:'0.25rem 0 0',fontSize:'2rem'}}>{totalStudents}</h2>
          </div>
          <Link to="/teacher/courses/new" style={{background:'linear-gradient(135deg,#f59e0b,#f97316)',color:'#fff',padding:'1.5rem',borderRadius:'14px',flex:1,minWidth:'180px',textDecoration:'none',display:'flex',flexDirection:'column',justifyContent:'center'}}>
            <p style={{margin:0,fontSize:'0.85rem',opacity:0.8}}>Quick Action</p>
            <h2 style={{margin:'0.25rem 0 0',fontSize:'1.2rem'}}>+ Create Course</h2>
          </Link>
        </div>
        <h2 style={{fontSize:'1.2rem',color:'#1a1a2e',marginBottom:'1rem'}}>Your Courses</h2>
        <div className="dashboard-grid">
          {loading ? <p style={{color:'#999'}}>Loading...</p> : courses.length === 0 ? <p style={{color:'#999'}}>No courses yet. Create your first!</p> :
            courses.map(c => (
              <Link to={`/teacher/courses/${c._id}`} key={c._id} className="course-card" style={{textDecoration:'none'}}>
                <h2 className="course-subject">{c.title}</h2>
                <p className="course-topic">{c.category} · {c.difficulty}</p>
                <div className="card-bottom">
                  <span style={{fontSize:'0.82rem',color:'#666'}}>{c.totalEnrolments} students · {c.isPublished ? '✅ Published' : '📝 Draft'}</span>
                </div>
              </Link>
            ))
          }
        </div>
      </div>
    </>
  );
}
