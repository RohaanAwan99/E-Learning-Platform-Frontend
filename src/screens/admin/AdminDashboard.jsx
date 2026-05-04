import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/navbar';
import API from '../../api/axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#6366f1','#8b5cf6','#0f766e','#14b8a6','#f59e0b','#ef4444','#ec4899','#2563eb','#06b6d4','#84cc16'];

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [topCourses, setTopCourses] = useState([]);
  const [passRates, setPassRates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
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
    }).catch(console.error).finally(() => setLoading(false));
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
      <div style={{maxWidth:'1100px',margin:'2rem auto',padding:'0 2rem',textAlign:'left'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'2rem',flexWrap:'wrap',gap:'1rem'}}>
          <div><h1 style={{fontSize:'1.8rem',color:'var(--text-heading)',margin:0}}>Admin Dashboard</h1><p style={{color:'var(--text-muted)',margin:'0.25rem 0 0'}}>Platform analytics & insights</p></div>
          <Link to="/admin/users" style={{background:'var(--accent)',color:'#fff',padding:'0.6rem 1.5rem',borderRadius:'8px',textDecoration:'none',fontWeight:600}}>Manage Users</Link>
        </div>
        {loading && (
          <div style={{padding:'2rem',textAlign:'center',color:'var(--text-muted)'}}>Loading analytics...</div>
        )}
        {/* Stats */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'1rem',marginBottom:'2rem'}}>
          {statCards.map(s => (
            <div key={s.label} style={{background:'var(--bg-card)',padding:'1.25rem',borderRadius:'14px',boxShadow:'var(--shadow-sm)',border:'1px solid var(--border)',borderLeft:`4px solid ${s.color}`,transition:'background 0.25s,border-color 0.25s'}}>
              <p style={{margin:0,fontSize:'0.82rem',color:'var(--text-muted)'}}>{s.label}</p>
              <h2 style={{margin:'0.25rem 0 0',fontSize:'1.8rem',color:'var(--text-heading)'}}>{s.value}</h2>
            </div>
          ))}
        </div>
        {/* Charts */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem'}}>
          <div style={{background:'var(--bg-card)',padding:'1.5rem',borderRadius:'14px',boxShadow:'var(--shadow-sm)',border:'1px solid var(--border)',transition:'background 0.25s,border-color 0.25s'}}>
            <h3 style={{margin:'0 0 1rem',color:'var(--text-heading)',fontSize:'1rem'}}>New Registrations</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={registrations}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="period" fontSize={11} stroke="var(--text-muted)" /><YAxis fontSize={11} stroke="var(--text-muted)" /><Tooltip contentStyle={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:'8px'}} /><Bar dataKey="total" fill="#6366f1" radius={[4,4,0,0]} /></BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{background:'var(--bg-card)',padding:'1.5rem',borderRadius:'14px',boxShadow:'var(--shadow-sm)',border:'1px solid var(--border)',transition:'background 0.25s,border-color 0.25s'}}>
            <h3 style={{margin:'0 0 1rem',color:'var(--text-heading)',fontSize:'1rem'}}>Quiz Pass Rates</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={passRates}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="courseTitle" fontSize={10} stroke="var(--text-muted)" /><YAxis fontSize={11} stroke="var(--text-muted)" /><Tooltip contentStyle={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:'8px'}} /><Bar dataKey="passRate" radius={[4,4,0,0]}>{passRates.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Bar></BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Top Courses */}
        <div style={{background:'var(--bg-card)',padding:'1.5rem',borderRadius:'14px',boxShadow:'var(--shadow-sm)',border:'1px solid var(--border)',marginTop:'1.5rem',transition:'background 0.25s,border-color 0.25s'}}>
          <h3 style={{margin:'0 0 1rem',color:'var(--text-heading)'}}>Top Courses by Enrollment</h3>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.88rem'}}>
            <thead><tr style={{textAlign:'left',borderBottom:'2px solid var(--border)'}}><th style={{padding:'0.75rem',color:'var(--text-secondary)'}}>Rank</th><th style={{padding:'0.75rem',color:'var(--text-secondary)'}}>Course</th><th style={{padding:'0.75rem',color:'var(--text-secondary)'}}>Category</th><th style={{padding:'0.75rem',color:'var(--text-secondary)'}}>Enrollments</th></tr></thead>
            <tbody>{topCourses.map((c, i) => (
              <tr key={c._id} style={{borderBottom:'1px solid var(--border-light)'}}><td style={{padding:'0.75rem',fontWeight:600,color:'var(--text-heading)'}}>#{i+1}</td><td style={{padding:'0.75rem',color:'var(--text-primary)'}}>{c.title}</td><td style={{padding:'0.75rem',color:'var(--text-muted)'}}>{c.category}</td><td style={{padding:'0.75rem',fontWeight:600,color:'var(--accent)'}}>{c.totalEnrolments}</td></tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </>
  );
}

