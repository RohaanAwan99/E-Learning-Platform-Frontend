import { useEffect, useState } from 'react';
import Navbar from '../../components/navbar';
import API from '../../api/axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#6366f1','#8b5cf6','#0f766e','#14b8a6','#f59e0b','#ef4444','#ec4899','#2563eb'];

export default function TeacherStudents() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [expandedStudent, setExpandedStudent] = useState(null);

  useEffect(() => {
    API.get('/courses/teacher/my-students')
      .then(r => setData(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <><Navbar /><p style={{padding:'3rem',textAlign:'center',color:'var(--text-muted)'}}>Loading...</p></>;
  if (!data) return <><Navbar /><p style={{padding:'3rem',textAlign:'center',color:'var(--text-muted)'}}>Failed to load data.</p></>;

  const { courses, students, summary } = data;

  const filtered = students.filter(s => {
    const matchesSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
    const matchesCourse = !courseFilter || s.courseDetails.some(d => d.courseId === courseFilter);
    return matchesSearch && matchesCourse;
  });

  const statCards = [
    { label: 'Total Students', value: summary.totalStudents, icon: '👥', color: '#6366f1' },
    { label: 'Avg Completion', value: `${summary.avgCompletionRate}%`, icon: '📊', color: '#0f766e' },
    { label: 'Avg Quiz Score', value: `${summary.avgQuizScore}%`, icon: '📝', color: '#f59e0b' },
    { label: 'Certificates', value: summary.certificatesIssued, icon: '🏆', color: '#ec4899' },
  ];

  const courseOptions = courses.map(c => c.courseTitle);

  const inputStyle = { padding:'0.6rem 1rem', border:'1px solid var(--input-border)', borderRadius:'8px', fontSize:'0.85rem', outline:'none', background:'var(--input-bg)', color:'var(--text-primary)', fontFamily:'var(--font-sans)' };

  return (
    <><Navbar />
      <div style={{maxWidth:'1100px',margin:'2rem auto',padding:'0 2rem',textAlign:'left'}}>
        <h1 style={{fontSize:'1.8rem',color:'var(--text-heading)',margin:'0 0 0.25rem'}}>My Students</h1>
        <p style={{color:'var(--text-muted)',margin:'0 0 2rem'}}>Student analytics across all your courses</p>

        {/* Stats */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'1rem',marginBottom:'2rem'}}>
          {statCards.map(s => (
            <div key={s.label} style={{background:'var(--bg-card)',padding:'1.25rem',borderRadius:'14px',border:'1px solid var(--border)',borderLeft:`4px solid ${s.color}`,transition:'background 0.25s'}}>
              <p style={{margin:0,fontSize:'0.82rem',color:'var(--text-muted)'}}>{s.icon} {s.label}</p>
              <h2 style={{margin:'0.25rem 0 0',fontSize:'1.8rem',color:'var(--text-heading)'}}>{s.value}</h2>
            </div>
          ))}
        </div>

        {/* Chart */}
        {courses.length > 0 && (
          <div style={{background:'var(--bg-card)',padding:'1.5rem',borderRadius:'14px',border:'1px solid var(--border)',marginBottom:'2rem',transition:'background 0.25s'}}>
            <h3 style={{margin:'0 0 1rem',color:'var(--text-heading)',fontSize:'1rem'}}>Students per Course</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={courses}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="courseTitle" fontSize={11} stroke="var(--text-muted)" />
                <YAxis fontSize={11} stroke="var(--text-muted)" />
                <Tooltip contentStyle={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:'8px',color:'var(--text-primary)'}} />
                <Bar dataKey="students" radius={[4,4,0,0]}>{courses.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Filters */}
        <div style={{display:'flex',gap:'1rem',marginBottom:'1.5rem',flexWrap:'wrap'}}>
          <input style={{...inputStyle,flex:1,minWidth:'200px'}} placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
          <select style={inputStyle} value={courseFilter} onChange={e => setCourseFilter(e.target.value)}>
            <option value="">All Courses</option>
            {courses.map(c => <option key={c.courseTitle} value={students.find(s => s.courseDetails.some(d => d.courseTitle === c.courseTitle))?.courseDetails.find(d => d.courseTitle === c.courseTitle)?.courseId || ''}>{c.courseTitle}</option>)}
          </select>
        </div>

        {/* Student Table */}
        <div style={{background:'var(--bg-card)',borderRadius:'14px',border:'1px solid var(--border)',overflow:'hidden',transition:'background 0.25s'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.88rem'}}>
            <thead>
              <tr style={{background:'var(--bg-muted)',textAlign:'left'}}>
                <th style={{padding:'0.85rem 1rem',color:'var(--text-secondary)',fontWeight:600}}>Student</th>
                <th style={{padding:'0.85rem',color:'var(--text-secondary)',fontWeight:600}}>Courses</th>
                <th style={{padding:'0.85rem',color:'var(--text-secondary)',fontWeight:600}}>Progress</th>
                <th style={{padding:'0.85rem',color:'var(--text-secondary)',fontWeight:600}}>Avg Score</th>
                <th style={{padding:'0.85rem',color:'var(--text-secondary)',fontWeight:600}}>Quizzes</th>
                <th style={{padding:'0.85rem',color:'var(--text-secondary)',fontWeight:600}}>Certs</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <>
                  <tr key={s._id} onClick={() => setExpandedStudent(expandedStudent === s._id ? null : s._id)} style={{borderBottom:'1px solid var(--border-light)',cursor:'pointer',transition:'background 0.15s'}}>
                    <td style={{padding:'0.85rem 1rem'}}>
                      <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
                        <div style={{width:'32px',height:'32px',borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.75rem',fontWeight:700,flexShrink:0}}>{s.name?.charAt(0)}</div>
                        <div><div style={{fontWeight:600,color:'var(--text-heading)'}}>{s.name}</div><div style={{fontSize:'0.75rem',color:'var(--text-muted)'}}>{s.email}</div></div>
                      </div>
                    </td>
                    <td style={{padding:'0.85rem',color:'var(--text-primary)'}}>{s.coursesEnrolled}</td>
                    <td style={{padding:'0.85rem'}}>
                      <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                        <div style={{flex:1,height:'6px',background:'var(--bg-muted)',borderRadius:'3px',overflow:'hidden',maxWidth:'80px'}}>
                          <div style={{width:`${s.overallProgress}%`,height:'100%',background:s.overallProgress >= 80 ? '#16a34a' : s.overallProgress >= 50 ? '#f59e0b' : '#ef4444',borderRadius:'3px'}} />
                        </div>
                        <span style={{fontSize:'0.82rem',fontWeight:600,color:'var(--text-primary)'}}>{s.overallProgress}%</span>
                      </div>
                    </td>
                    <td style={{padding:'0.85rem',fontWeight:600,color:s.avgScore >= 70 ? 'var(--success)' : 'var(--text-primary)'}}>{s.avgScore}%</td>
                    <td style={{padding:'0.85rem',color:'var(--text-primary)'}}>{s.totalQuizzesPassed}</td>
                    <td style={{padding:'0.85rem',color:'var(--accent)',fontWeight:600}}>{s.certificatesEarned}</td>
                  </tr>
                  {expandedStudent === s._id && s.courseDetails.length > 0 && (
                    <tr key={`${s._id}-details`}><td colSpan={6} style={{padding:'0',background:'var(--bg-muted)'}}>
                      <div style={{padding:'1rem 1.5rem'}}>
                        <p style={{margin:'0 0 0.5rem',fontSize:'0.82rem',fontWeight:600,color:'var(--text-secondary)'}}>Per-Course Breakdown</p>
                        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'0.75rem'}}>
                          {s.courseDetails.map(d => (
                            <div key={d.courseId} style={{background:'var(--bg-card)',padding:'0.85rem',borderRadius:'10px',border:'1px solid var(--border)'}}>
                              <h4 style={{margin:'0 0 0.5rem',fontSize:'0.88rem',color:'var(--text-heading)'}}>{d.courseTitle}</h4>
                              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.25rem',fontSize:'0.78rem',color:'var(--text-secondary)'}}>
                                <span>📚 Lectures: {d.completedLectures}/{d.totalLectures}</span>
                                <span>📝 Quizzes: {d.quizzesPassed}/{d.totalQuizzes}</span>
                                <span>📊 Avg: {d.avgScore}%</span>
                                <span>🏆 Best: {d.bestScore}%</span>
                              </div>
                              <div style={{marginTop:'0.5rem',height:'4px',background:'var(--bg-muted)',borderRadius:'2px',overflow:'hidden'}}>
                                <div style={{width:`${d.progressPercent}%`,height:'100%',background:'var(--accent)',borderRadius:'2px'}} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </td></tr>
                  )}
                </>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} style={{padding:'2rem',textAlign:'center',color:'var(--text-muted)'}}>No students found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

