import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import API from '../../api/axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function CourseStats() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/progress/${id}/stats`)
      .then(r => setData(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <><Navbar /><p style={{padding:'3rem',textAlign:'center',color:'var(--text-muted)'}}>Loading...</p></>;
  if (!data) return <><Navbar /><p style={{padding:'3rem',textAlign:'center',color:'var(--text-muted)'}}>Failed to load statistics.</p></>;

  const { course, overallProgress, totalLectures, completedLectures, totalQuizzes, quizzesPassed, avgScore, bestScore, totalAttempts, moduleBreakdown, quizHistory } = data;
  const colors = { development:'#6366f1', science:'#0f766e', business:'#f59e0b', design:'#9333ea', marketing:'#ef4444' };
  const heroColor = colors[course.category] || '#6366f1';

  const statCards = [
    { label:'Avg Score', value:`${avgScore}%`, icon:'📊', color:'#6366f1' },
    { label:'Best Score', value:`${bestScore}%`, icon:'🏆', color:'#16a34a' },
    { label:'Quizzes Passed', value:`${quizzesPassed}/${totalQuizzes}`, icon:'✅', color:'#0f766e' },
    { label:'Lectures Done', value:`${completedLectures}/${totalLectures}`, icon:'📚', color:'#f59e0b' },
  ];

  // Chart data
  const chartData = quizHistory.map((q, i) => ({
    attempt: `#${i + 1}`,
    score: q.score,
    date: new Date(q.date).toLocaleDateString(),
  }));

  return (
    <><Navbar />
      <div style={{maxWidth:'900px',margin:'0 auto',padding:'0 2rem 3rem',textAlign:'left'}}>
        {/* Hero */}
        <div style={{background:`linear-gradient(135deg,${heroColor},${heroColor}cc)`,borderRadius:'16px',padding:'2rem',margin:'2rem 0',color:'#fff'}}>
          <Link to="/dashboard" style={{color:'rgba(255,255,255,0.7)',textDecoration:'none',fontSize:'0.82rem'}}>← Back to Dashboard</Link>
          <h1 style={{margin:'0.75rem 0 0.25rem',fontSize:'1.8rem',color:'#fff'}}>{course.title}</h1>
          <p style={{margin:0,opacity:0.85,fontSize:'0.9rem'}}>By {course.instructor?.name || 'Instructor'} · {course.category} · {course.difficulty}</p>
          <div style={{marginTop:'1.25rem',display:'flex',alignItems:'center',gap:'1rem'}}>
            <div style={{flex:1,height:'8px',background:'rgba(255,255,255,0.2)',borderRadius:'4px',overflow:'hidden'}}>
              <div style={{width:`${overallProgress}%`,height:'100%',background:'#fff',borderRadius:'4px',transition:'width 0.5s'}} />
            </div>
            <span style={{fontWeight:700,fontSize:'1.1rem'}}>{overallProgress}%</span>
          </div>
        </div>

        {/* Stats */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'1rem',marginBottom:'2rem'}}>
          {statCards.map(s => (
            <div key={s.label} style={{background:'var(--bg-card)',padding:'1.25rem',borderRadius:'14px',border:'1px solid var(--border)',borderLeft:`4px solid ${s.color}`,transition:'background 0.25s'}}>
              <p style={{margin:0,fontSize:'0.82rem',color:'var(--text-muted)'}}>{s.icon} {s.label}</p>
              <h2 style={{margin:'0.25rem 0 0',fontSize:'1.6rem',color:'var(--text-heading)'}}>{s.value}</h2>
            </div>
          ))}
        </div>

        {/* Quiz Score Chart */}
        {chartData.length > 0 && (
          <div style={{background:'var(--bg-card)',padding:'1.5rem',borderRadius:'14px',border:'1px solid var(--border)',marginBottom:'2rem',transition:'background 0.25s'}}>
            <h3 style={{margin:'0 0 1rem',color:'var(--text-heading)',fontSize:'1rem'}}>Quiz Score History</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="attempt" fontSize={11} stroke="var(--text-muted)" />
                <YAxis domain={[0, 100]} fontSize={11} stroke="var(--text-muted)" />
                <Tooltip contentStyle={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:'8px',color:'var(--text-primary)'}} />
                <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} dot={{fill:'#6366f1',r:4}} activeDot={{r:6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Module Breakdown */}
        <h3 style={{color:'var(--text-heading)',margin:'0 0 1rem',fontSize:'1.1rem'}}>Module Progress</h3>
        <div style={{display:'flex',flexDirection:'column',gap:'0.75rem',marginBottom:'2rem'}}>
          {moduleBreakdown.map(m => (
            <div key={m.moduleId} style={{background:'var(--bg-card)',padding:'1.25rem',borderRadius:'14px',border:'1px solid var(--border)',transition:'background 0.25s'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.75rem'}}>
                <h4 style={{margin:0,fontSize:'0.95rem',color:'var(--text-heading)'}}>{m.title}</h4>
                <span style={{fontSize:'0.78rem',fontWeight:600,color:m.lectureProgress === 100 ? 'var(--success)' : 'var(--text-muted)'}}>{m.lectureProgress}%</span>
              </div>
              <div style={{height:'6px',background:'var(--bg-muted)',borderRadius:'3px',overflow:'hidden',marginBottom:'0.75rem'}}>
                <div style={{width:`${m.lectureProgress}%`,height:'100%',background:m.lectureProgress === 100 ? '#16a34a' : '#6366f1',borderRadius:'3px',transition:'width 0.3s'}} />
              </div>
              <div style={{display:'flex',gap:'1.5rem',fontSize:'0.8rem',color:'var(--text-secondary)'}}>
                <span>📚 Lectures: {m.completedLectures}/{m.totalLectures}</span>
                {m.hasQuiz && (
                  <>
                    <span style={{color: m.quizPassed ? 'var(--success)' : 'var(--text-muted)'}}>{m.quizPassed ? '✅ Quiz Passed' : '❌ Quiz Not Passed'}</span>
                    {m.bestScore !== null && <span>Best: {m.bestScore}%</span>}
                    <span>Attempts: {m.attempts}</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
