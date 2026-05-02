import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
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

  if (!course) return <><Navbar /><div style={{padding:'3rem',textAlign:'center'}}>Loading...</div></>;

  const filteredStudents = students.filter(s =>
    !studentSearch || s.name?.toLowerCase().includes(studentSearch.toLowerCase()) || s.email?.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const cardStyle = { background:'#fff', borderRadius:'12px', padding:'1.25rem', boxShadow:'0 2px 8px rgba(0,0,0,0.05)', marginBottom:'0.75rem', display:'flex', justifyContent:'space-between', alignItems:'center' };

  return (
    <><Navbar />
      <div style={{maxWidth:'900px',margin:'2rem auto',padding:'0 2rem'}}>
        {/* Header */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem',flexWrap:'wrap',gap:'1rem'}}>
          <div>
            <h1 style={{fontSize:'1.6rem',color:'#1a1a2e',margin:0}}>{course.title}</h1>
            <p style={{color:'#666',margin:'0.25rem 0 0'}}>{course.category} · {course.difficulty} · {course.totalEnrolments} students</p>
          </div>
          <button onClick={togglePublish} style={{padding:'0.6rem 1.5rem',borderRadius:'8px',border:'none',fontWeight:600,cursor:'pointer',background:course.isPublished?'#fee2e2':'#dcfce7',color:course.isPublished?'#dc2626':'#16a34a'}}>
            {course.isPublished ? 'Unpublish' : 'Publish'}
          </button>
        </div>

        {/* Modules Section */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
          <h2 style={{fontSize:'1.2rem',color:'#1a1a2e',margin:0}}>Modules ({modules.length})</h2>
          <Link to={`/teacher/courses/${id}/modules/new`} style={{background:'#6366f1',color:'#fff',padding:'0.5rem 1.25rem',borderRadius:'8px',textDecoration:'none',fontWeight:600,fontSize:'0.85rem'}}>+ Add Module</Link>
        </div>
        {modules.length === 0 ? <p style={{color:'#999'}}>No modules yet.</p> :
          modules.map((item, idx) => {
            const mod = item.module || item;
            const hasQuiz = item.quiz != null;
            return (
              <div key={mod._id} style={cardStyle}>
                <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
                  <div style={{width:'36px',height:'36px',borderRadius:'8px',background:'#f0f4ff',color:'#6366f1',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700}}>{idx+1}</div>
                  <div>
                    <h3 style={{margin:0,fontSize:'0.95rem'}}>{mod.title}</h3>
                    <span style={{fontSize:'0.78rem',color:'#888'}}>{hasQuiz ? '📝 Has Quiz' : 'No Quiz'}</span>
                  </div>
                </div>
                <div style={{display:'flex',gap:'0.5rem'}}>
                  <Link to={`/teacher/courses/${id}/modules/${mod._id}/quiz`} style={{fontSize:'0.8rem',color:'#6366f1',textDecoration:'none',fontWeight:600}}>
                    {hasQuiz ? 'Edit Quiz' : 'Add Quiz'}
                  </Link>
                  <button onClick={() => deleteModule(mod._id)} style={{fontSize:'0.8rem',color:'#dc2626',background:'none',border:'none',cursor:'pointer',fontWeight:600}}>Delete</button>
                </div>
              </div>
            );
          })
        }

        {/* Enrolled Students Section */}
        <div style={{marginTop:'2rem',borderTop:'1px solid #e5e7eb',paddingTop:'1.5rem'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
            <h2 style={{fontSize:'1.2rem',color:'#1a1a2e',margin:0}}>👥 Enrolled Students</h2>
            {!showStudents ? (
              <button onClick={loadStudents} style={{background:'#f0f4ff',color:'#6366f1',border:'none',padding:'0.5rem 1.25rem',borderRadius:'8px',fontWeight:600,fontSize:'0.85rem',cursor:'pointer'}}>
                View Students
              </button>
            ) : (
              <span style={{fontSize:'0.85rem',color:'#666'}}>{totalEnrolled} total</span>
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
                  style={{width:'100%',padding:'0.6rem 1rem',border:'1px solid #e0e0e0',borderRadius:'10px',fontSize:'0.85rem',outline:'none',boxSizing:'border-box',marginBottom:'1rem'}}
                />
              )}

              {filteredStudents.length === 0 ? (
                <p style={{color:'#999',fontSize:'0.85rem'}}>No students enrolled yet.</p>
              ) : (
                <div style={{overflowX:'auto'}}>
                  <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.85rem'}}>
                    <thead>
                      <tr style={{borderBottom:'2px solid #e5e7eb'}}>
                        <th style={{textAlign:'left',padding:'0.6rem 0.75rem',color:'#555',fontWeight:600}}>Student</th>
                        <th style={{textAlign:'left',padding:'0.6rem 0.75rem',color:'#555',fontWeight:600}}>Email</th>
                        <th style={{textAlign:'center',padding:'0.6rem 0.75rem',color:'#555',fontWeight:600}}>Progress</th>
                        <th style={{textAlign:'center',padding:'0.6rem 0.75rem',color:'#555',fontWeight:600}}>Quiz Score</th>
                        <th style={{textAlign:'center',padding:'0.6rem 0.75rem',color:'#555',fontWeight:600}}>Quizzes Passed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map(s => (
                        <tr key={s._id} style={{borderBottom:'1px solid #f1f5f9'}}>
                          <td style={{padding:'0.6rem 0.75rem'}}>
                            <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                              <div style={{width:'28px',height:'28px',borderRadius:'50%',background:'#f0f4ff',color:'#6366f1',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.7rem',fontWeight:700}}>
                                {s.name?.charAt(0)?.toUpperCase() || '?'}
                              </div>
                              <span style={{fontWeight:600,color:'#1a1a2e'}}>{s.name}</span>
                            </div>
                          </td>
                          <td style={{padding:'0.6rem 0.75rem',color:'#666'}}>{s.email}</td>
                          <td style={{padding:'0.6rem 0.75rem',textAlign:'center'}}>
                            <div style={{display:'flex',alignItems:'center',gap:'0.5rem',justifyContent:'center'}}>
                              <div style={{width:'60px',height:'5px',borderRadius:'999px',background:'#e2e8f0',overflow:'hidden'}}>
                                <div style={{width:`${s.progressPercent}%`,height:'100%',borderRadius:'999px',background: s.progressPercent === 100 ? '#22c55e' : '#6366f1'}}></div>
                              </div>
                              <span style={{fontSize:'0.78rem',color:'#666',fontWeight:600}}>{s.progressPercent}%</span>
                            </div>
                          </td>
                          <td style={{padding:'0.6rem 0.75rem',textAlign:'center',fontWeight:600,color: s.bestScore >= 60 ? '#16a34a' : '#f59e0b'}}>{s.bestScore}%</td>
                          <td style={{padding:'0.6rem 0.75rem',textAlign:'center',color:'#666'}}>{s.quizzesPassed}</td>
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
