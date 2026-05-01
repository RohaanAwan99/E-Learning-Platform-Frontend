import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../api/axios';

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  useEffect(() => { API.get('/blogs').then(r => setBlogs(r.data.data || [])).catch(console.error); }, []);

  return (
    <><Navbar />
      <div style={{maxWidth:'900px',margin:'2rem auto',padding:'0 2rem'}}>
        <h1 style={{fontSize:'1.8rem',color:'#1a1a2e'}}>Blog Posts</h1>
        <p style={{color:'#666',marginBottom:'2rem'}}>Insights and articles from our instructors.</p>
        <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
          {blogs.map(b => (
            <Link to={`/blogs/${b._id}`} key={b._id} style={{textDecoration:'none',color:'inherit',background:'#fff',padding:'1.5rem',borderRadius:'14px',boxShadow:'0 2px 8px rgba(0,0,0,0.05)',transition:'transform 0.2s'}}>
              <h2 style={{fontSize:'1.15rem',color:'#1a1a2e',margin:'0 0 0.5rem'}}>{b.title}</h2>
              <p style={{fontSize:'0.85rem',color:'#666',margin:'0 0 0.5rem'}}>{b.content?.replace(/<[^>]*>/g,'').slice(0,150)}...</p>
              <div style={{display:'flex',gap:'1rem',fontSize:'0.78rem',color:'#999'}}>
                <span>👤 {b.author?.name || 'Author'}</span>
                <span>💬 {b.comments?.length || 0} comments</span>
                <span>{b.tags?.join(', ')}</span>
              </div>
            </Link>
          ))}
          {blogs.length === 0 && <p style={{color:'#999',textAlign:'center'}}>No blog posts yet.</p>}
        </div>
      </div>
    </>
  );
}
