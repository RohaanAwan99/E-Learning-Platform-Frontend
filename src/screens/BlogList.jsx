import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../api/axios';

const tagColors = {
  cs:'#6366f1', beginner:'#16a34a', algorithms:'#0f766e', math:'#f59e0b',
  education:'#8b5cf6', science:'#0ea5e9', ml:'#ec4899', ai:'#ef4444',
  future:'#14b8a6', technology:'#2563eb', web:'#f97316', default:'#64748b',
};

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [activeTag, setActiveTag] = useState('');
  useEffect(() => { API.get('/blogs').then(r => setBlogs(r.data.data || [])).catch(console.error); }, []);

  const allTags = [...new Set(blogs.flatMap(b => b.tags || []))];
  const filtered = activeTag ? blogs.filter(b => b.tags?.includes(activeTag)) : blogs;
  const featured = filtered[0];
  const rest = filtered.slice(1);

  const readTime = (content) => {
    const text = content?.replace(/<[^>]*>/g, '') || '';
    return Math.max(1, Math.ceil(text.split(/\s+/).length / 200));
  };

  return (
    <><Navbar />
      <div style={{maxWidth:'960px',margin:'0 auto',padding:'2rem',textAlign:'left'}}>
        <div style={{marginBottom:'2rem'}}>
          <h1 style={{fontSize:'2rem',color:'var(--text-heading)',margin:'0 0 0.5rem',letterSpacing:'-0.5px'}}>Blog & Articles</h1>
          <p style={{color:'var(--text-muted)',margin:0,fontSize:'0.95rem'}}>Insights and articles from our instructors</p>
        </div>

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div style={{display:'flex',gap:'0.5rem',marginBottom:'2rem',flexWrap:'wrap'}}>
            <button onClick={() => setActiveTag('')} style={{padding:'0.35rem 0.85rem',borderRadius:'20px',border:'1px solid var(--border)',background:!activeTag?'var(--accent)':'var(--bg-card)',color:!activeTag?'#fff':'var(--text-secondary)',fontSize:'0.78rem',fontWeight:600,cursor:'pointer',transition:'all 0.15s'}}>All</button>
            {allTags.map(tag => (
              <button key={tag} onClick={() => setActiveTag(tag === activeTag ? '' : tag)} style={{padding:'0.35rem 0.85rem',borderRadius:'20px',border:'1px solid var(--border)',background:tag===activeTag?'var(--accent)':'var(--bg-card)',color:tag===activeTag?'#fff':'var(--text-secondary)',fontSize:'0.78rem',fontWeight:600,cursor:'pointer',transition:'all 0.15s'}}>#{tag}</button>
            ))}
          </div>
        )}

        {/* Featured Blog */}
        {featured && (
          <Link to={`/blogs/${featured._id}`} style={{textDecoration:'none',color:'inherit',display:'block',marginBottom:'2rem'}}>
            <div style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',borderRadius:'20px',padding:'2.5rem',color:'#fff',position:'relative',overflow:'hidden',transition:'transform 0.2s'}}>
              <div style={{position:'absolute',top:'-30px',right:'-30px',width:'160px',height:'160px',borderRadius:'50%',background:'rgba(255,255,255,0.08)'}} />
              <span style={{background:'rgba(255,255,255,0.2)',padding:'0.25rem 0.75rem',borderRadius:'20px',fontSize:'0.72rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.5px'}}>Featured</span>
              <h2 style={{fontSize:'1.6rem',margin:'1rem 0 0.75rem',lineHeight:1.3,color:'#fff'}}>{featured.title}</h2>
              <p style={{opacity:0.85,margin:'0 0 1.25rem',lineHeight:1.6,fontSize:'0.92rem',maxWidth:'600px'}}>{featured.content?.replace(/<[^>]*>/g,'').slice(0,180)}...</p>
              <div style={{display:'flex',alignItems:'center',gap:'1rem',fontSize:'0.82rem',opacity:0.8}}>
                <div style={{display:'flex',alignItems:'center',gap:'0.4rem'}}>
                  <div style={{width:'24px',height:'24px',borderRadius:'50%',background:'rgba(255,255,255,0.25)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.65rem',fontWeight:700}}>{featured.author?.name?.charAt(0)}</div>
                  <span>{featured.author?.name}</span>
                </div>
                <span>·</span>
                <span>{readTime(featured.content)} min read</span>
                <span>·</span>
                <span>💬 {featured.comments?.length || 0}</span>
              </div>
            </div>
          </Link>
        )}

        {/* Blog Grid */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'1.25rem'}}>
          {rest.map(b => (
            <Link to={`/blogs/${b._id}`} key={b._id} style={{textDecoration:'none',color:'inherit'}}>
              <div style={{background:'var(--bg-card)',borderRadius:'16px',border:'1px solid var(--border)',overflow:'hidden',transition:'transform 0.2s, box-shadow 0.2s, background 0.25s',height:'100%',display:'flex',flexDirection:'column'}}>
                {/* Color header bar */}
                <div style={{height:'4px',background:`linear-gradient(90deg,${tagColors[b.tags?.[0]] || tagColors.default},${tagColors[b.tags?.[1]] || tagColors.default})`}} />
                <div style={{padding:'1.25rem',flex:1,display:'flex',flexDirection:'column'}}>
                  {/* Tags */}
                  <div style={{display:'flex',gap:'0.35rem',flexWrap:'wrap',marginBottom:'0.75rem'}}>
                    {(b.tags || []).slice(0,3).map(tag => (
                      <span key={tag} style={{background:tagColors[tag]?`${tagColors[tag]}18`:'var(--bg-muted)',color:tagColors[tag] || 'var(--text-muted)',padding:'0.15rem 0.5rem',borderRadius:'6px',fontSize:'0.68rem',fontWeight:600}}>#{tag}</span>
                    ))}
                  </div>
                  <h3 style={{fontSize:'1.05rem',color:'var(--text-heading)',margin:'0 0 0.5rem',lineHeight:1.35}}>{b.title}</h3>
                  <p style={{fontSize:'0.83rem',color:'var(--text-secondary)',margin:'0 0 1rem',lineHeight:1.5,flex:1}}>{b.content?.replace(/<[^>]*>/g,'').slice(0,120)}...</p>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:'0.75rem',color:'var(--text-muted)',borderTop:'1px solid var(--border)',paddingTop:'0.75rem',marginTop:'auto'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'0.4rem'}}>
                      <div style={{width:'22px',height:'22px',borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.6rem',fontWeight:700}}>{b.author?.name?.charAt(0)}</div>
                      <span>{b.author?.name}</span>
                    </div>
                    <div style={{display:'flex',gap:'0.75rem'}}>
                      <span>📖 {readTime(b.content)} min</span>
                      <span>💬 {b.comments?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && <p style={{color:'var(--text-muted)',textAlign:'center',padding:'3rem'}}>No blog posts found.</p>}
      </div>
    </>
  );
}
