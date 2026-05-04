import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import Navbar from '../../components/navbar';
import API from '../../api/axios';
import '../stylesheets/lectureContent.css';

export default function CreateBlog() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '', tags: '', isPublished: true });
  const [loading, setLoading] = useState(false);

  const quillModules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      [{ align: [] }],
      ['clean'],
    ],
  }), []);

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

  const inputStyle = { width: '100%', padding: '0.7rem 1rem', border: '1px solid var(--input-border)', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', background: 'var(--input-bg)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' };

  return (
    <><Navbar />
      <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '0 2rem', textAlign: 'left' }}>
        <h1 style={{ fontSize: '1.6rem', color: 'var(--text-heading)' }}>Write a Blog Post</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.5rem' }}>
          <input style={inputStyle} placeholder="Blog title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          <div className="quill-editor">
            <ReactQuill
              theme="snow"
              value={form.content}
              onChange={(value) => setForm({...form, content: value})}
              modules={quillModules}
              placeholder="Write your blog content..."
            />
          </div>
          <input style={inputStyle} placeholder="Tags (comma-separated)" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} />
          <button type="submit" disabled={loading} style={{background:'linear-gradient(135deg,var(--accent),var(--accent-hover, #4f46e5))',color:'#fff',border:'none',padding:'0.85rem',borderRadius:'10px',fontWeight:700,cursor:'pointer',fontFamily:'var(--font-sans)'}}>{loading ? 'Publishing...' : 'Publish Blog'}</button>
        </form>
      </div>
    </>
  );
}

