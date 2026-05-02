import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import API from '../api/axios';

export default function BlogDetail() {
  const { id } = useParams();
  const { user } = useSelector(s => s.auth);
  const [blog, setBlog] = useState(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = () => API.get(`/blogs/${id}`).then(r => setBlog(r.data.data)).catch(console.error);
  useEffect(() => { load(); }, [id]);

  const readTime = (content) => {
    const text = content?.replace(/<[^>]*>/g, '') || '';
    return Math.max(1, Math.ceil(text.split(/\s+/).length / 200));
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      await API.post(`/blogs/${id}/comments`, { content: comment });
      setComment('');
      toast.success('Comment posted!');
      load();
    } catch { toast.error('Failed to post comment'); }
    setSubmitting(false);
  };

  if (!blog) return <><Navbar /><p style={{padding:'3rem',textAlign:'center',color:'var(--text-muted)'}}>Loading...</p></>;

  const tagColors = { cs:'#6366f1', beginner:'#16a34a', algorithms:'#0f766e', math:'#f59e0b', education:'#8b5cf6', science:'#0ea5e9', ml:'#ec4899', ai:'#ef4444', future:'#14b8a6', technology:'#2563eb' };

  return (
    <><Navbar />
      <article style={{maxWidth:'720px',margin:'0 auto',padding:'2rem',textAlign:'left'}}>
        {/* Back */}
        <Link to="/blogs" style={{color:'var(--accent)',textDecoration:'none',fontSize:'0.85rem',fontWeight:600}}>← All Posts</Link>

        {/* Title */}
        <h1 style={{fontSize:'2.2rem',color:'var(--text-heading)',margin:'1.5rem 0 1rem',lineHeight:1.25,letterSpacing:'-0.5px'}}>{blog.title}</h1>

        {/* Tags */}
        <div style={{display:'flex',gap:'0.4rem',flexWrap:'wrap',marginBottom:'1.5rem'}}>
          {(blog.tags || []).map(tag => (
            <span key={tag} style={{background:tagColors[tag]?`${tagColors[tag]}18`:'var(--bg-muted)',color:tagColors[tag]||'var(--text-muted)',padding:'0.2rem 0.6rem',borderRadius:'6px',fontSize:'0.72rem',fontWeight:600}}>#{tag}</span>
          ))}
        </div>

        {/* Author Card */}
        <div style={{display:'flex',alignItems:'center',gap:'1rem',padding:'1rem',background:'var(--bg-card)',borderRadius:'14px',border:'1px solid var(--border)',marginBottom:'2rem',transition:'background 0.25s'}}>
          <div style={{width:'48px',height:'48px',borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'1.2rem',fontWeight:700,flexShrink:0}}>
            {blog.author?.avatar ? <img src={blog.author.avatar} alt="" style={{width:'100%',height:'100%',borderRadius:'50%',objectFit:'cover'}} /> : blog.author?.name?.charAt(0)}
          </div>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,color:'var(--text-heading)',fontSize:'0.95rem'}}>{blog.author?.name}</div>
            <div style={{fontSize:'0.78rem',color:'var(--text-muted)'}}>{blog.author?.role === 'teacher' ? 'Instructor' : blog.author?.role}</div>
          </div>
          <div style={{textAlign:'right',fontSize:'0.78rem',color:'var(--text-muted)'}}>
            <div>{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</div>
            <div>📖 {readTime(blog.content)} min read</div>
          </div>
        </div>

        {/* Content */}
        <div className="lecture-content" dangerouslySetInnerHTML={{__html: blog.content}} style={{marginBottom:'2.5rem'}} />

        {/* Separator */}
        <hr style={{border:'none',borderTop:'1px solid var(--border)',margin:'2rem 0'}} />

        {/* Comments */}
        <div style={{marginBottom:'2rem'}}>
          <h3 style={{color:'var(--text-heading)',fontSize:'1.1rem',margin:'0 0 1.25rem'}}>💬 Comments ({blog.comments?.length || 0})</h3>

          {/* Comment Form */}
          {user && (
            <form onSubmit={handleComment} style={{display:'flex',gap:'0.75rem',marginBottom:'1.5rem',alignItems:'flex-start'}}>
              <div style={{width:'36px',height:'36px',borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'0.8rem',fontWeight:700,flexShrink:0}}>{user.name?.charAt(0)}</div>
              <div style={{flex:1}}>
                <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Write a comment..." rows={3} style={{width:'100%',padding:'0.75rem',border:'1px solid var(--input-border)',borderRadius:'10px',fontSize:'0.88rem',resize:'vertical',outline:'none',background:'var(--input-bg)',color:'var(--text-primary)',fontFamily:'var(--font-sans)',boxSizing:'border-box'}} />
                <button type="submit" disabled={submitting || !comment.trim()} style={{marginTop:'0.5rem',background:'var(--accent)',color:'#fff',border:'none',padding:'0.5rem 1.25rem',borderRadius:'8px',fontWeight:600,cursor:'pointer',fontSize:'0.82rem',opacity:submitting?0.6:1}}>Post Comment</button>
              </div>
            </form>
          )}

          {/* Comment List */}
          <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            {(blog.comments || []).map((c, i) => (
              <div key={c._id || i} style={{display:'flex',gap:'0.75rem',padding:'1rem',background:'var(--bg-card)',borderRadius:'12px',border:'1px solid var(--border)',transition:'background 0.25s'}}>
                <div style={{width:'32px',height:'32px',borderRadius:'50%',background:'var(--accent-light)',color:'var(--accent)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.72rem',fontWeight:700,flexShrink:0}}>{c.author?.name?.charAt(0) || '?'}</div>
                <div style={{flex:1}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.35rem'}}>
                    <span style={{fontWeight:600,color:'var(--text-heading)',fontSize:'0.88rem'}}>{c.author?.name || 'Anonymous'}</span>
                    <span style={{fontSize:'0.72rem',color:'var(--text-muted)'}}>{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p style={{margin:0,color:'var(--text-secondary)',fontSize:'0.88rem',lineHeight:1.5}}>{c.content}</p>
                </div>
              </div>
            ))}
          </div>
          {(!blog.comments || blog.comments.length === 0) && <p style={{color:'var(--text-muted)',fontSize:'0.88rem',textAlign:'center',padding:'1rem'}}>No comments yet. Be the first!</p>}
        </div>
      </article>
    </>
  );
}
