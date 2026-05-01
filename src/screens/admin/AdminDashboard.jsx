import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import API from '../../api/axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#6366f1','#8b5cf6','#0f766e','#14b8a6','#f59e0b','#ef4444','#ec4899','#2563eb','#06b6d4','#84cc16'];

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [topCourses, setTopCourses] = useState([]);
  const [passRates, setPassRates] = useState([]);

  useEffect(() => {
    Promise.all([
      API.get('/admin/analytics/overview'),
      API.get('/admin/analytics/registrations?period=daily'),
      API.get('/admin/analytics/top-courses'),
      API.get('/admin/analytics/quiz-pass-rates'),
    ]).then(([o, r, t, p]) => {
      setOverview(o.data.data);
      setRegistrations(r.data.data);
      setTopCourses(t.data.data);
      setPassRates(p.data.data);
    }).catch(console.error);
  }, []);

  const statCards = overview ? [
    { label: 'Students', value: overview.totalStudents, color: '#6366f1' },
    { label: 'Teachers', value: overview.totalTeachers, color: '#0f766e' },
    { label: 'Courses', value: overview.totalCourses, color: '#f59e0b' },
    { label: 'Enrollments', value: overview.totalEnrollments, color: '#ef4444' },
    { label: 'Quiz Attempts', value: overview.totalAttempts, color: '#8b5cf6' },
  ] : [];

  return (
    <><Navbar />
      <div style={{maxWidth:'1100px',margin:'2rem auto',padding:'0 2rem'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'2rem'}}>
          <div><h1 style={{fontSize:'1.8rem',color:'#1a1a2e',margin:0}}>Admin Dashboard</h1><p style={{color:'#666',margin:'0.25rem 0 0'}}>Platform analytics & insights</p></div>
          <Link to="/admin/users" style={{background:'#6366f1',color:'#fff',padding:'0.6rem 1.5rem',borderRadius:'8px',textDecoration:'none',fontWeight:600}}>Manage Users</Link>
        </div>
        {/* Stats */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'1rem',marginBottom:'2rem'}}>
          {statCards.map(s => (
            <div key={s.label} style={{background:'#fff',padding:'1.25rem',borderRadius:'14px',boxShadow:'0 2px 8px rgba(0,0,0,0.05)',borderLeft:`4px solid ${s.color}`}}>
              <p style={{margin:0,fontSize:'0.82rem',color:'#888'}}>{s.label}</p>
              <h2 style={{margin:'0.25rem 0 0',fontSize:'1.8rem',color:'#1a1a2e'}}>{s.value}</h2>
            </div>
          ))}
        </div>
        {/* Charts */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem'}}>
          <div style={{background:'#fff',padding:'1.5rem',borderRadius:'14px',boxShadow:'0 2px 8px rgba(0,0,0,0.05)'}}>
            <h3 style={{margin:'0 0 1rem',color:'#1a1a2e',fontSize:'1rem'}}>New Registrations</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={registrations}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="period" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="total" fill="#6366f1" radius={[4,4,0,0]} /></BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{background:'#fff',padding:'1.5rem',borderRadius:'14px',boxShadow:'0 2px 8px rgba(0,0,0,0.05)'}}>
            <h3 style={{margin:'0 0 1rem',color:'#1a1a2e',fontSize:'1rem'}}>Quiz Pass Rates</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={passRates}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="courseTitle" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="passRate" radius={[4,4,0,0]}>{passRates.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Bar></BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Top Courses */}
        <div style={{background:'#fff',padding:'1.5rem',borderRadius:'14px',boxShadow:'0 2px 8px rgba(0,0,0,0.05)',marginTop:'1.5rem'}}>
          <h3 style={{margin:'0 0 1rem',color:'#1a1a2e'}}>Top Courses by Enrollment</h3>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.88rem'}}>
            <thead><tr style={{textAlign:'left',borderBottom:'2px solid #f0f0f0'}}><th style={{padding:'0.75rem'}}>Rank</th><th style={{padding:'0.75rem'}}>Course</th><th style={{padding:'0.75rem'}}>Category</th><th style={{padding:'0.75rem'}}>Enrollments</th></tr></thead>
            <tbody>{topCourses.map((c, i) => (
              <tr key={c._id} style={{borderBottom:'1px solid #f8f8f8'}}><td style={{padding:'0.75rem',fontWeight:600}}>#{i+1}</td><td style={{padding:'0.75rem'}}>{c.title}</td><td style={{padding:'0.75rem',color:'#888'}}>{c.category}</td><td style={{padding:'0.75rem',fontWeight:600,color:'#6366f1'}}>{c.totalEnrolments}</td></tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </>
  );
}
