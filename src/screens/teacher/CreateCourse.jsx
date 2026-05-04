import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../../components/navbar';
import API from '../../api/axios';

export default function CreateCourse() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', category: 'development', difficulty: 'beginner', tags: '', isPublished: false });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) { toast.error('Title and description required'); return; }
    setLoading(true);
    try {
      const payload = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
      const { data } = await API.post('/courses', payload);
      toast.success('Course created!');
      navigate(`/teacher/courses/${data.data._id}`);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    setLoading(false);
  };

  const inputStyle = { width: '100%', padding: '0.7rem 1rem', border: '1px solid var(--input-border)', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', background: 'var(--input-bg)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' };
  const labelStyle = { display: 'block', marginBottom: '0.35rem', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)' };

  return (
    <><Navbar />
      <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '0 2rem', textAlign: 'left' }}>
        <h1 style={{ fontSize: '1.6rem', color: 'var(--text-heading)' }}>Create New Course</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.5rem' }}>
          <div><label style={labelStyle}>Title</label><input style={inputStyle} value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Course title" /></div>
          <div><label style={labelStyle}>Description</label><textarea style={{...inputStyle, minHeight:'120px', resize:'vertical'}} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Course description" /></div>
          <div style={{display:'flex',gap:'1rem'}}>
            <div style={{flex:1}}><label style={labelStyle}>Category</label><select style={inputStyle} value={form.category} onChange={e => setForm({...form, category: e.target.value})}><option value="development">Development</option><option value="science">Science</option><option value="business">Business</option><option value="design">Design</option><option value="marketing">Marketing</option></select></div>
            <div style={{flex:1}}><label style={labelStyle}>Difficulty</label><select style={inputStyle} value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value})}><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></div>
          </div>
          <div><label style={labelStyle}>Tags (comma-separated)</label><input style={inputStyle} value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} placeholder="react, javascript, web" /></div>
          <label style={{display:'flex',alignItems:'center',gap:'0.5rem',cursor:'pointer',color:'var(--text-secondary)',fontSize:'0.9rem'}}><input type="checkbox" checked={form.isPublished} onChange={e => setForm({...form, isPublished: e.target.checked})} style={{accentColor:'var(--accent)'}} /> Publish immediately</label>
          <button type="submit" disabled={loading} style={{background:'linear-gradient(135deg,var(--accent),var(--accent-hover, #4f46e5))',color:'#fff',border:'none',padding:'0.85rem',borderRadius:'10px',fontWeight:700,fontSize:'1rem',cursor:'pointer',fontFamily:'var(--font-sans)'}}>{loading ? 'Creating...' : 'Create Course'}</button>
        </form>
      </div>
    </>
  );
}

