import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import Navbar from '../../components/Navbar';
import API from '../../api/axios';
import '../stylesheets/lectureContent.css';

export default function AddModule() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', order: 1, lectureTitle: '', content: '', videoUrl: '' });
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

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'blockquote', 'code-block',
    'link', 'image', 'align',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.lectureTitle || !form.content) { toast.error('Fill in all required fields'); return; }
    setLoading(true);
    try {
      await API.post(`/courses/${id}/modules/lectures`, {
        title: form.title, order: form.order,
        lecture: { title: form.lectureTitle, content: form.content, order: 1, videoUrl: form.videoUrl },
      });
      toast.success('Module created!');
      navigate(`/teacher/courses/${id}`);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    setLoading(false);
  };

  const inputStyle = {
    width: '100%',
    padding: '0.7rem 1rem',
    border: '1px solid var(--input-border)',
    borderRadius: '10px',
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box',
    background: 'var(--input-bg)',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-sans)',
  };
  const labelStyle = { display: 'block', marginBottom: '0.35rem', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)' };

  return (
    <><Navbar />
      <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '0 2rem' }}>
        <h1 style={{ fontSize: '1.6rem', color: 'var(--text-heading)' }}>Add Module</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.5rem' }}>
          <div><label style={labelStyle}>Module Title *</label><input style={inputStyle} value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Introduction to Arrays" /></div>
          <div><label style={labelStyle}>Module Order</label><input type="number" min="1" style={inputStyle} value={form.order} onChange={e => setForm({...form, order: parseInt(e.target.value)})} /></div>
          <div><label style={labelStyle}>Lecture Title *</label><input style={inputStyle} value={form.lectureTitle} onChange={e => setForm({...form, lectureTitle: e.target.value})} placeholder="e.g. Understanding Arrays" /></div>
          <div>
            <label style={labelStyle}>Lecture Content *</label>
            <div className="quill-editor">
              <ReactQuill
                theme="snow"
                value={form.content}
                onChange={(value) => setForm({...form, content: value})}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Start writing your lecture content..."
              />
            </div>
          </div>
          <div><label style={labelStyle}>Video URL (optional)</label><input style={inputStyle} value={form.videoUrl} onChange={e => setForm({...form, videoUrl: e.target.value})} placeholder="https://..." /></div>
          <button type="submit" disabled={loading} style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',border:'none',padding:'0.85rem',borderRadius:'10px',fontWeight:700,fontSize:'1rem',cursor:'pointer'}}>{loading ? 'Creating...' : 'Add Module'}</button>
        </form>
      </div>
    </>
  );
}
