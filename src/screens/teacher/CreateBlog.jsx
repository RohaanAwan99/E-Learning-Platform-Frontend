import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import API from '../../api/axios';

export default function CreateBlog() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '', tags: '', isPublished: true });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content) { toast.error('Title and content required'); return; }
    setLoading(true);
    try {
      const payload = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
      await API.post('/blogs', payload);
      toast.success('Blog published!');
      navigate('/blogs');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    setLoading(false);
  };

  const inputStyle = { width: '100%', padding: '0.7rem 1rem', border: '1px solid #e0e0e0', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' };

  return (
    <><Navbar />
      <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '0 2rem' }}>
        <h1 style={{ fontSize: '1.6rem', color: '#1a1a2e' }}>Write a Blog Post</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.5rem' }}>
          <input style={inputStyle} placeholder="Blog title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          <textarea style={{...inputStyle, minHeight:'300px', resize:'vertical'}} placeholder="Write your content here... (HTML supported)" value={form.content} onChange={e => setForm({...form, content: e.target.value})} />
          <input style={inputStyle} placeholder="Tags (comma-separated)" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} />
          <button type="submit" disabled={loading} style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',border:'none',padding:'0.85rem',borderRadius:'10px',fontWeight:700,cursor:'pointer'}}>{loading ? 'Publishing...' : 'Publish Blog'}</button>
        </form>
      </div>
    </>
  );
}
