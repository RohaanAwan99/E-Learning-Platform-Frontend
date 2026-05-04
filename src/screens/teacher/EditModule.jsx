import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import Navbar from '../../components/navbar';
import API from '../../api/axios';
import '../stylesheets/lectureContent.css';

export default function EditModule() {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({
    moduleTitle: '',
    moduleOrder: 1,
    lectureTitle: '',
    content: '',
    videoUrl: '',
  });

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

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await API.get(`/courses/${courseId}/modules/${moduleId}`);
        const moduleData = data.data?.module;
        const lectureData = data.data?.lecture;

        if (!moduleData || !lectureData) {
          toast.error('Lecture data not found for this module.');
          return;
        }

        setForm({
          moduleTitle: moduleData.title || '',
          moduleOrder: moduleData.order || 1,
          lectureTitle: lectureData.title || '',
          content: lectureData.content || '',
          videoUrl: lectureData.videoUrl || '',
        });
      } catch (err) {
        toast.error('Failed to load module data.');
      }
      setFetching(false);
    };

    load();
  }, [courseId, moduleId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.moduleTitle || !form.lectureTitle || !form.content) {
      toast.error('Fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await API.put(`/courses/${courseId}/modules/${moduleId}`, {
        title: form.moduleTitle,
        order: form.moduleOrder,
        lecture: {
          title: form.lectureTitle,
          content: form.content,
          videoUrl: form.videoUrl,
        },
      });
      toast.success('Lecture updated!');
      navigate(`/teacher/courses/${courseId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update lecture');
    }
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

  const labelStyle = {
    display: 'block',
    marginBottom: '0.35rem',
    fontWeight: 600,
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
  };

  if (fetching) {
    return (
      <>
        <Navbar />
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '760px', margin: '2rem auto', padding: '0 2rem' }}>
        <h1 style={{ fontSize: '1.6rem', color: 'var(--text-heading)' }}>Edit Lecture</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.5rem' }}>
          <div>
            <label style={labelStyle}>Module Title *</label>
            <input
              style={inputStyle}
              value={form.moduleTitle}
              onChange={(event) => setForm({ ...form, moduleTitle: event.target.value })}
            />
          </div>
          <div>
            <label style={labelStyle}>Module Order</label>
            <input
              type="number"
              min="1"
              style={inputStyle}
              value={form.moduleOrder}
              onChange={(event) => setForm({ ...form, moduleOrder: parseInt(event.target.value, 10) || 1 })}
            />
          </div>
          <div>
            <label style={labelStyle}>Lecture Title *</label>
            <input
              style={inputStyle}
              value={form.lectureTitle}
              onChange={(event) => setForm({ ...form, lectureTitle: event.target.value })}
            />
          </div>
          <div>
            <label style={labelStyle}>Lecture Content *</label>
            <div className="quill-editor">
              <ReactQuill
                theme="snow"
                value={form.content}
                onChange={(value) => setForm({ ...form, content: value })}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Update your lecture content..."
              />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Video URL (optional)</label>
            <input
              style={inputStyle}
              value={form.videoUrl}
              onChange={(event) => setForm({ ...form, videoUrl: event.target.value })}
              placeholder="https://..."
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              color: '#fff',
              border: 'none',
              padding: '0.85rem',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </>
  );
}

