import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../../components/navbar';
import API from '../../api/axios';

export default function ManageCourse() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [students, setStudents] = useState([]);
  const [totalEnrolled, setTotalEnrolled] = useState(0);
  const [studentSearch, setStudentSearch] = useState('');
  const [showStudents, setShowStudents] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [cRes, mRes] = await Promise.all([API.get(`/courses/${id}`), API.get(`/courses/${id}/modules`)]);
        setCourse(cRes.data.data);
        setModules(mRes.data.data || []);
      } catch (err) { console.error(err); }
    };
    load();
  }, [id]);

  const loadStudents = async () => {
    try {
      const { data } = await API.get(`/courses/${id}/enrolled-students`);
      setStudents(data.data.students || []);
      setTotalEnrolled(data.data.totalEnrolled || 0);
      setShowStudents(true);
    } catch (err) {
      toast.error('Failed to load students');
    }
  };

  const togglePublish = async () => {
    try {
      const { data } = await API.put(`/courses/${id}`, { isPublished: !course.isPublished });
      setCourse(data.data);
      toast.success(data.data.isPublished ? 'Published!' : 'Unpublished — enrolled students retain access');
    } catch (err) { toast.error('Failed to update'); }
  };

  const deleteModule = async (moduleId) => {
    if (!confirm('Delete this module and all its content?')) return;
    try {
      await API.delete(`/courses/${id}/modules/${moduleId}`);
      setModules(modules.filter(item => {
        const mod = item.module || item;
        return mod._id !== moduleId;
      }));
      toast.success('Module deleted');
    } catch (err) { toast.error('Failed to delete'); }
  };

  if (!course) return <><Navbar /><div style={{padding:'3rem',textAlign:'center',color:'var(--text-muted)'}}>Loading...</div></>;

  const filteredStudents = students.filter(s =>
    !studentSearch || s.name?.toLowerCase().includes(studentSearch.toLowerCase()) || s.email?.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const enrolledCount = showStudents
    ? totalEnrolled
    : (course?.totalEnrolments ?? totalEnrolled);

  return (
    <><Navbar />
      <div style={{maxWidth:'1000px',margin:'0 auto',padding:'2rem'}}>
        {/* Hero Header */}
        <div style={{background:`linear-gradient(135deg, #6366f1, #8b5cf6)`,borderRadius:'16px',padding:'2rem',marginBottom:'2rem',color:'#fff'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'1rem',flexWrap:'wrap'}}>
            <div>
              <h1 style={{margin:'0 0 0.5rem',fontSize:'2rem',fontWeight:700,color:'#fff'}}>{course.title}</h1>
              <p style={{margin:0,fontSize:'0.95rem',opacity:0.9}}>{course.category} · {course.difficulty} · {course.totalEnrolments} students enrolled</p>
            </div>
            <button onClick={togglePublish} style={{padding:'0.75rem 1.5rem',borderRadius:'10px',border:'none',fontWeight:600,cursor:'pointer',background:course.isPublished?'#fecaca':'#86efac',color:course.isPublished?'#7f1d1d':'#166534',transition:'all 0.2s',fontSize:'0.9rem',whiteSpace:'nowrap'}}>
              {course.isPublished ? '✓ Published' : '◯ Unpublished'}
            </button>
          </div>
        </div>

        {/* Modules Section */}
        <div style={{background:'var(--bg-card)',borderRadius:'14px',border:'1px solid var(--border)',padding:'1.5rem',marginBottom:'2rem',transition:'background 0.25s'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem',flexWrap:'wrap',gap:'1rem'}}>
            <h2 style={{fontSize:'1.3rem',color:'var(--text-heading)',margin:0,fontWeight:700}}>📚 Modules ({modules.length})</h2>
            <a href={`/teacher/courses/${id}/modules/new`} style={{background:'var(--accent)',color:'#fff',padding:'0.6rem 1.25rem',borderRadius:'8px',textDecoration:'none',fontWeight:600,fontSize:'0.85rem',transition:'opacity 0.2s'}}>+ Add Module</a>
          </div>
          {modules.length === 0 ? 
            <div style={{textAlign:'center',padding:'2rem',color:'var(--text-muted)'}}>
              <p style={{fontSize:'1rem'}}>No modules yet. Create your first module to get started!</p>
            </div>
            :
            <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
              {modules.map((item, idx) => {
                const mod = item.module || item;
                const hasQuiz = item.quiz != null;
                const hasLecture = item.lecture != null;
                return (
                  <div key={mod._id} style={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:'12px',padding:'1.25rem',display:'flex',justifyContent:'space-between',alignItems:'center',gap:'1rem',flexWrap:'wrap',transition:'background 0.2s'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'1rem',flex:1,minWidth:'200px'}}>
                      <div style={{width:'40px',height:'40px',borderRadius:'10px',background:'var(--accent)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:'1rem'}}>{idx+1}</div>
                      <div>
                        <h3 style={{margin:0,fontSize:'0.95rem',color:'var(--text-heading)',fontWeight:600}}>{mod.title}</h3>
                        <span style={{fontSize:'0.78rem',color:'var(--text-muted)'}}>{hasQuiz ? '📝 Has Quiz' : '⭕ No Quiz Yet'}</span>
                      </div>
                    </div>
                    <div style={{display:'flex',gap:'0.75rem',flexWrap:'wrap'}}>
                      {hasLecture ? (
                        <a href={`/teacher/courses/${id}/modules/${mod._id}/edit`} style={{fontSize:'0.8rem',color:'#e2e8f0',textDecoration:'none',fontWeight:600,padding:'0.4rem 0.75rem',borderRadius:'6px',border:'1px solid #94a3b8',transition:'all 0.2s'}}>
                          Edit Lecture
                        </a>
                      ) : (
                        <span style={{fontSize:'0.78rem',color:'var(--text-muted)',alignSelf:'center'}}>No lecture</span>
                      )}
                      <a href={`/teacher/courses/${id}/modules/${mod._id}/quiz`} style={{fontSize:'0.8rem',color:'var(--accent)',textDecoration:'none',fontWeight:600,padding:'0.4rem 0.75rem',borderRadius:'6px',border:'1px solid var(--accent)',transition:'all 0.2s'}}>
                        {hasQuiz ? 'Edit Quiz' : 'Add Quiz'}
                      </a>
                      <button onClick={() => deleteModule(mod._id)} style={{fontSize:'0.8rem',color:'#ef4444',background:'none',border:'1px solid #ef4444',cursor:'pointer',fontWeight:600,padding:'0.4rem 0.75rem',borderRadius:'6px',transition:'all 0.2s'}}>Delete</button>
                    </div>
                  </div>
                );
              })}
            </div>
          }
        </div>

        {/* Enrolled Students Section */}
        <div style={{background:'var(--bg-card)',borderRadius:'14px',border:'1px solid var(--border)',padding:'1.5rem',transition:'background 0.25s'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem',flexWrap:'wrap',gap:'1rem'}}>
            <h2 style={{fontSize:'1.3rem',color:'var(--text-heading)',margin:0,fontWeight:700}}>👥 Enrolled Students</h2>
            {!showStudents ? (
              <button onClick={loadStudents} style={{background:'var(--accent)',color:'#fff',border:'none',padding:'0.6rem 1.25rem',borderRadius:'8px',fontWeight:600,fontSize:'0.85rem',cursor:'pointer',transition:'opacity 0.2s'}}>
                View Students ({enrolledCount})
              </button>
            ) : (
              <span style={{fontSize:'0.85rem',color:'var(--text-muted)',fontWeight:600}}>{enrolledCount} enrolled</span>
            )}
          </div>

          {showStudents && (
            <>
              {students.length > 5 && (
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={studentSearch}
                  onChange={e => setStudentSearch(e.target.value)}
                  style={{width:'100%',padding:'0.6rem 1rem',border:'1px solid var(--border)',borderRadius:'10px',fontSize:'0.85rem',outline:'none',boxSizing:'border-box',marginBottom:'1.25rem',background:'var(--bg-card)',color:'var(--text-heading)',transition:'border 0.2s'}}
                />
              )}

              {filteredStudents.length === 0 ? (
                <p style={{color:'var(--text-muted)',fontSize:'0.85rem',textAlign:'center',padding:'2rem'}}>No students enrolled yet.</p>
              ) : (
                <div style={{overflowX:'auto'}}>
                  <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.85rem'}}>
                    <thead>
                      <tr style={{borderBottom:'2px solid var(--border)'}}>
                        <th style={{textAlign:'left',padding:'0.75rem',color:'var(--text-heading)',fontWeight:600,fontSize:'0.8rem'}}>Student</th>
                        <th style={{textAlign:'left',padding:'0.75rem',color:'var(--text-heading)',fontWeight:600,fontSize:'0.8rem'}}>Email</th>
                        <th style={{textAlign:'center',padding:'0.75rem',color:'var(--text-heading)',fontWeight:600,fontSize:'0.8rem'}}>Progress</th>
                        <th style={{textAlign:'center',padding:'0.75rem',color:'var(--text-heading)',fontWeight:600,fontSize:'0.8rem'}}>Quiz Score</th>
                        <th style={{textAlign:'center',padding:'0.75rem',color:'var(--text-heading)',fontWeight:600,fontSize:'0.8rem'}}>Quizzes Passed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map(s => (
                        <tr key={s._id} style={{borderBottom:'1px solid var(--border)'}}>
                          <td style={{padding:'0.75rem'}}>
                            <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                              <div style={{width:'32px',height:'32px',borderRadius:'50%',background:'var(--accent)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.75rem',fontWeight:700}}>
                                {s.name?.charAt(0)?.toUpperCase() || '?'}
                              </div>
                              <span style={{fontWeight:600,color:'var(--text-heading)'}}>{s.name}</span>
                            </div>
                          </td>
                          <td style={{padding:'0.75rem',color:'var(--text-heading)'}}>{s.email}</td>
                          <td style={{padding:'0.75rem',textAlign:'center'}}>
                            <div style={{display:'flex',alignItems:'center',gap:'0.5rem',justifyContent:'center'}}>
                              <div style={{width:'60px',height:'5px',borderRadius:'999px',background:'var(--border)',overflow:'hidden'}}>
                                <div style={{width:`${s.progressPercent}%`,height:'100%',borderRadius:'999px',background: s.progressPercent === 100 ? '#22c55e' : 'var(--accent)'}}></div>
                              </div>
                              <span style={{fontSize:'0.78rem',color:'var(--text-muted)',fontWeight:600}}>{s.progressPercent}%</span>
                            </div>
                          </td>
                          <td style={{padding:'0.75rem',textAlign:'center',fontWeight:600,color: s.bestScore >= 60 ? '#16a34a' : '#f59e0b'}}>{s.bestScore}%</td>
                          <td style={{padding:'0.75rem',textAlign:'center',color:'var(--text-heading)',fontWeight:600}}>{s.quizzesPassed}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

