import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import API from '../../api/axios';

export default function ManageCourse() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [cRes, mRes] = await Promise.all([API.get(`/courses/${id}`), API.get(`/courses/${id}/modules`)]);
        setCourse(cRes.data.data);
        // Backend returns [{ module, lecture, quiz }]
        setModules(mRes.data.data || []);
      } catch (err) { console.error(err); }
    };
    load();
  }, [id]);

  const togglePublish = async () => {
    try {
      const { data } = await API.put(`/courses/${id}`, { isPublished: !course.isPublished });
      setCourse(data.data);
      toast.success(data.data.isPublished ? 'Published!' : 'Unpublished');
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

  const cardStyle = { background:'#fff', borderRadius:'12px', padding:'1.25rem', boxShadow:'0 2px 8px rgba(0,0,0,0.05)', marginBottom:'0.75rem', display:'flex', justifyContent:'space-between', alignItems:'center' };

  return (
    <><Navbar />
      <div style={{maxWidth:'800px',margin:'2rem auto',padding:'0 2rem'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
          <div>
            <h1 style={{fontSize:'1.6rem',color:'#1a1a2e',margin:0}}>{course.title}</h1>
            <p style={{color:'#666',margin:'0.25rem 0 0'}}>{course.category} · {course.difficulty} · {course.totalEnrolments} students</p>
          </div>
          <button onClick={togglePublish} style={{padding:'0.6rem 1.5rem',borderRadius:'8px',border:'none',fontWeight:600,cursor:'pointer',background:course.isPublished?'#fee2e2':'#dcfce7',color:course.isPublished?'#dc2626':'#16a34a'}}>
            {course.isPublished ? 'Unpublish' : 'Publish'}
          </button>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
          <h2 style={{fontSize:'1.2rem',color:'#1a1a2e',margin:0}}>Modules ({modules.length})</h2>
          <Link to={`/teacher/courses/${id}/modules/new`} style={{background:'#6366f1',color:'#fff',padding:'0.5rem 1.25rem',borderRadius:'8px',textDecoration:'none',fontWeight:600,fontSize:'0.85rem'}}>+ Add Module</Link>
        </div>
        {modules.length === 0 ? <p style={{color:'#999'}}>No modules yet.</p> :
          modules.map((item, idx) => {
            // item is { module: {...}, lecture: {...}, quiz: {...} }
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
      </div>
    </>
  );
}
