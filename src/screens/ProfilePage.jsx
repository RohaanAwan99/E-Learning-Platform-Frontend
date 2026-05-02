import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import API from '../api/axios';

export default function ProfilePage() {
  const { user } = useSelector(s => s.auth);
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [certs, setCerts] = useState([]);

  useEffect(() => {
    API.get('/profile/me').then(r => {
      setProfile(r.data.data);
      const u = r.data.data.user;
      const p = r.data.data.profile;
      setForm({
        name: u.name || '',
        avatar: u.avatar || '',
        headline: p?.headline || '',
        bio: p?.bio || '',
        linkedin: p?.socialLinks?.linkedin || '',
        twitter: p?.socialLinks?.twitter || '',
        website: p?.socialLinks?.website || '',
      });
    }).catch(console.error);
    if (user?.role === 'student') API.get('/certificates/my').then(r => setCerts(r.data.data)).catch(() => {});
  }, [user]);

  const handleSave = async () => {
    try {
      const payload = { name: form.name, avatar: form.avatar };
      if (user?.role === 'teacher') {
        payload.headline = form.headline;
        payload.bio = form.bio;
        payload.socialLinks = { linkedin: form.linkedin, twitter: form.twitter, website: form.website };
      }
      await API.put('/profile/me', payload);
      toast.success('Profile updated!');
      setEditing(false);
      const r = await API.get('/profile/me');
      setProfile(r.data.data);
    } catch (err) { toast.error('Failed to update'); }
  };

  if (!profile) return <><Navbar /><p style={{padding:'3rem',textAlign:'center',color:'var(--text-muted)'}}>Loading...</p></>;
  const { user: u, profile: p } = profile;
  const enrolledCourses = p?.enrolledCourses || [];

  const inputStyle = { width:'100%', padding:'0.7rem 1rem', border:'1px solid var(--input-border)', borderRadius:'10px', fontSize:'0.9rem', outline:'none', boxSizing:'border-box', background:'var(--input-bg)', color:'var(--text-primary)', fontFamily:'var(--font-sans)', transition:'border-color 0.2s' };
  const labelStyle = { display:'block', marginBottom:'0.35rem', fontWeight:600, fontSize:'0.82rem', color:'var(--text-secondary)' };

  return (
    <><Navbar />
      <div style={{maxWidth:'750px',margin:'0 auto',padding:'2rem'}}>
        {/* Hero Card */}
        <div style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',padding:'2.5rem',borderRadius:'20px',color:'#fff',marginBottom:'1.5rem',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',top:'-40px',right:'-40px',width:'180px',height:'180px',borderRadius:'50%',background:'rgba(255,255,255,0.08)'}} />
          <div style={{position:'absolute',bottom:'-20px',left:'-20px',width:'120px',height:'120px',borderRadius:'50%',background:'rgba(255,255,255,0.05)'}} />
          <div style={{position:'relative',zIndex:1,display:'flex',alignItems:'center',gap:'1.5rem',flexWrap:'wrap'}}>
            <div style={{width:'80px',height:'80px',borderRadius:'50%',background:'rgba(255,255,255,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2.2rem',fontWeight:700,flexShrink:0,border:'3px solid rgba(255,255,255,0.3)'}}>
              {u.avatar ? <img src={u.avatar} alt="" style={{width:'100%',height:'100%',borderRadius:'50%',objectFit:'cover'}} /> : u.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{flex:1}}>
              <h1 style={{margin:'0 0 0.25rem',fontSize:'1.6rem',color:'#fff'}}>{u.name}</h1>
              <p style={{margin:0,opacity:0.85,fontSize:'0.9rem'}}>{u.email}</p>
              <div style={{display:'flex',gap:'0.5rem',marginTop:'0.75rem',flexWrap:'wrap'}}>
                <span style={{background:'rgba(255,255,255,0.2)',padding:'0.25rem 0.75rem',borderRadius:'20px',fontSize:'0.75rem',fontWeight:600}}>{u.role.charAt(0).toUpperCase() + u.role.slice(1)}</span>
                <span style={{background:'rgba(255,255,255,0.15)',padding:'0.25rem 0.75rem',borderRadius:'20px',fontSize:'0.75rem'}}>Joined {new Date(u.createdAt).toLocaleDateString('en-US',{month:'long',year:'numeric'})}</span>
              </div>
              {p?.headline && <p style={{margin:'0.75rem 0 0',opacity:0.9,fontSize:'0.88rem',fontStyle:'italic'}}>{p.headline}</p>}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        {user?.role === 'student' && (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:'0.75rem',marginBottom:'1.5rem'}}>
            {[
              {label:'Enrolled',value:enrolledCourses.length,icon:'📚',color:'#6366f1'},
              {label:'Completed',value:certs.length,icon:'✅',color:'#16a34a'},
              {label:'Certificates',value:certs.length,icon:'🏆',color:'#f59e0b'},
            ].map(s => (
              <div key={s.label} style={{background:'var(--bg-card)',padding:'1rem',borderRadius:'12px',border:'1px solid var(--border)',textAlign:'center',transition:'background 0.25s'}}>
                <div style={{fontSize:'1.5rem'}}>{s.icon}</div>
                <div style={{fontSize:'1.4rem',fontWeight:700,color:'var(--text-heading)'}}>{s.value}</div>
                <div style={{fontSize:'0.75rem',color:'var(--text-muted)'}}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Profile Details Card */}
        <div style={{background:'var(--bg-card)',padding:'1.5rem',borderRadius:'16px',border:'1px solid var(--border)',marginBottom:'1.5rem',transition:'background 0.25s'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.25rem'}}>
            <h2 style={{margin:0,fontSize:'1.1rem',color:'var(--text-heading)'}}>Profile Details</h2>
            <div style={{display:'flex',gap:'0.5rem'}}>
              {editing && <button onClick={() => setEditing(false)} style={{background:'var(--bg-muted)',color:'var(--text-primary)',border:'1px solid var(--border)',padding:'0.45rem 1rem',borderRadius:'8px',fontWeight:600,cursor:'pointer',fontSize:'0.82rem'}}>Cancel</button>}
              <button onClick={() => editing ? handleSave() : setEditing(true)} style={{background:editing?'#16a34a':'var(--accent)',color:'#fff',border:'none',padding:'0.45rem 1.25rem',borderRadius:'8px',fontWeight:600,cursor:'pointer',fontSize:'0.82rem'}}>{editing ? '✓ Save' : '✎ Edit'}</button>
            </div>
          </div>
          {editing ? (
            <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
              <div><label style={labelStyle}>Full Name</label><input style={inputStyle} value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
              <div><label style={labelStyle}>Avatar URL</label><input style={inputStyle} value={form.avatar} onChange={e => setForm({...form, avatar: e.target.value})} placeholder="https://example.com/avatar.jpg" /></div>
              {u.role === 'teacher' && (
                <>
                  <div><label style={labelStyle}>Headline</label><input style={inputStyle} value={form.headline} onChange={e => setForm({...form, headline: e.target.value})} placeholder="e.g. Computer Science Professor" /></div>
                  <div><label style={labelStyle}>Bio</label><textarea style={{...inputStyle,minHeight:'100px',resize:'vertical'}} value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} placeholder="Tell students about yourself..." /></div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                    <div><label style={labelStyle}>LinkedIn</label><input style={inputStyle} value={form.linkedin} onChange={e => setForm({...form, linkedin: e.target.value})} placeholder="https://linkedin.com/in/..." /></div>
                    <div><label style={labelStyle}>Twitter</label><input style={inputStyle} value={form.twitter} onChange={e => setForm({...form, twitter: e.target.value})} placeholder="https://twitter.com/..." /></div>
                  </div>
                  <div><label style={labelStyle}>Website</label><input style={inputStyle} value={form.website} onChange={e => setForm({...form, website: e.target.value})} placeholder="https://yoursite.com" /></div>
                </>
              )}
            </div>
          ) : (
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem 2rem',fontSize:'0.9rem'}}>
              <div><span style={{color:'var(--text-muted)',fontSize:'0.78rem',display:'block',marginBottom:'0.15rem'}}>Name</span><span style={{color:'var(--text-heading)',fontWeight:600}}>{u.name}</span></div>
              <div><span style={{color:'var(--text-muted)',fontSize:'0.78rem',display:'block',marginBottom:'0.15rem'}}>Email</span><span style={{color:'var(--text-heading)',fontWeight:600}}>{u.email}</span></div>
              <div><span style={{color:'var(--text-muted)',fontSize:'0.78rem',display:'block',marginBottom:'0.15rem'}}>Role</span><span style={{color:'var(--text-heading)',fontWeight:600}}>{u.role.charAt(0).toUpperCase() + u.role.slice(1)}</span></div>
              <div><span style={{color:'var(--text-muted)',fontSize:'0.78rem',display:'block',marginBottom:'0.15rem'}}>Joined</span><span style={{color:'var(--text-heading)',fontWeight:600}}>{new Date(u.createdAt).toLocaleDateString()}</span></div>
              {p?.bio && <div style={{gridColumn:'1/-1'}}><span style={{color:'var(--text-muted)',fontSize:'0.78rem',display:'block',marginBottom:'0.15rem'}}>Bio</span><span style={{color:'var(--text-secondary)',lineHeight:1.6}}>{p.bio}</span></div>}
              {(p?.socialLinks?.linkedin || p?.socialLinks?.twitter || p?.socialLinks?.website) && (
                <div style={{gridColumn:'1/-1',display:'flex',gap:'1rem',flexWrap:'wrap'}}>
                  {p.socialLinks.linkedin && <a href={p.socialLinks.linkedin} target="_blank" rel="noreferrer" style={{color:'var(--accent)',fontSize:'0.85rem',fontWeight:600,textDecoration:'none'}}>🔗 LinkedIn</a>}
                  {p.socialLinks.twitter && <a href={p.socialLinks.twitter} target="_blank" rel="noreferrer" style={{color:'var(--accent)',fontSize:'0.85rem',fontWeight:600,textDecoration:'none'}}>🐦 Twitter</a>}
                  {p.socialLinks.website && <a href={p.socialLinks.website} target="_blank" rel="noreferrer" style={{color:'var(--accent)',fontSize:'0.85rem',fontWeight:600,textDecoration:'none'}}>🌐 Website</a>}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Enrolled Courses (Students) */}
        {user?.role === 'student' && enrolledCourses.length > 0 && (
          <div style={{background:'var(--bg-card)',padding:'1.5rem',borderRadius:'16px',border:'1px solid var(--border)',marginBottom:'1.5rem',transition:'background 0.25s'}}>
            <h2 style={{margin:'0 0 1rem',fontSize:'1.1rem',color:'var(--text-heading)'}}>📚 Enrolled Courses</h2>
            <div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
              {enrolledCourses.map(c => (
                <Link to={`/courses/${c._id}`} key={c._id} style={{display:'flex',alignItems:'center',gap:'0.75rem',padding:'0.75rem',borderRadius:'10px',border:'1px solid var(--border)',textDecoration:'none',color:'inherit',transition:'background 0.15s'}}>
                  <div style={{width:'36px',height:'36px',borderRadius:'8px',background:'var(--accent-light)',color:'var(--accent)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:'0.85rem',flexShrink:0}}>📖</div>
                  <span style={{fontWeight:600,color:'var(--text-heading)',fontSize:'0.9rem'}}>{c.title}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Certificates */}
        {user?.role === 'student' && certs.length > 0 && (
          <div style={{background:'var(--bg-card)',padding:'1.5rem',borderRadius:'16px',border:'1px solid var(--border)',transition:'background 0.25s'}}>
            <h2 style={{margin:'0 0 1rem',fontSize:'1.1rem',color:'var(--text-heading)'}}>🏆 Certificates</h2>
            {certs.map(c => (
              <div key={c._id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0.75rem 0',borderBottom:'1px solid var(--border)'}}>
                <div>
                  <strong style={{fontSize:'0.9rem',color:'var(--text-heading)'}}>{c.course?.title}</strong>
                  <p style={{margin:0,fontSize:'0.78rem',color:'var(--text-muted)'}}>Score: {c.score}% · {new Date(c.completedAt).toLocaleDateString()}</p>
                </div>
                <button onClick={async () => { const r = await API.get(`/certificates/${c.course?._id}/download`,{responseType:'blob'}); const url=URL.createObjectURL(new Blob([r.data])); const a=document.createElement('a'); a.href=url; a.download='certificate.pdf'; a.click(); }} style={{color:'var(--accent)',background:'none',border:'none',cursor:'pointer',fontWeight:600,fontSize:'0.82rem'}}>Download PDF</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
