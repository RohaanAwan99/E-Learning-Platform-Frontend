import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import API from '../api/axios';

export default function BlogDetail() {
  const { id } = useParams();
  const { user } = useSelector(s => s.auth);
  const [blog, setBlog] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    API.get('/blogs').then(r => { const b = (r.data.data || []).find(b => b._id === id); setBlog(b); }).catch(console.error);
  }, [id]);

  const addComment = async () => {
    if (!comment.trim()) return;
    try {
      const { data } = await API.post(`/blogs/${id}/comments`, { content: comment });
      setBlog(data.data);
      setComment('');
      toast.success('Comment added!');
    } catch (err) { toast.error('Failed to add comment'); }
  };

  if (!blog) return <><Navbar /><p style={{padding:'3rem',textAlign:'center'}}>Loading...</p></>;

  return (
    <><Navbar />
      <div style={{maxWidth:'750px',margin:'2rem auto',padding:'0 2rem'}}>
        <h1 style={{fontSize:'1.8rem',color:'#1a1a2e'}}>{blog.title}</h1>
        <div style={{display:'flex',gap:'1rem',fontSize:'0.82rem',color:'#888',marginBottom:'2rem'}}>
          <span>👤 {blog.author?.name}</span>
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
        </div>
        <div style={{lineHeight:1.8,color:'#333'}} dangerouslySetInnerHTML={{__html: blog.content}} />
        <hr style={{margin:'2rem 0',border:'none',borderTop:'1px solid #eee'}} />
        <h3 style={{color:'#1a1a2e'}}>Comments ({blog.comments?.length || 0})</h3>
        {(blog.comments || []).map((c, i) => (
          <div key={i} style={{background:'#f8f9ff',padding:'1rem',borderRadius:'10px',marginBottom:'0.75rem'}}>
            <strong style={{fontSize:'0.85rem'}}>{c.author?.name || 'User'}</strong>
            <p style={{margin:'0.25rem 0 0',fontSize:'0.85rem',color:'#555'}}>{c.content}</p>
          </div>
        ))}
        {user && (
          <div style={{display:'flex',gap:'0.5rem',marginTop:'1rem'}}>
            <input style={{flex:1,padding:'0.7rem',border:'1px solid #e0e0e0',borderRadius:'10px',fontSize:'0.9rem',outline:'none'}} placeholder="Write a comment..." value={comment} onChange={e => setComment(e.target.value)} />
            <button onClick={addComment} style={{background:'#6366f1',color:'#fff',border:'none',padding:'0.7rem 1.5rem',borderRadius:'10px',fontWeight:600,cursor:'pointer'}}>Post</button>
          </div>
        )}
      </div>
    </>
  );
}
