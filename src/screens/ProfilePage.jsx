import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
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
    API.get('/profile/me').then(r => { setProfile(r.data.data); setForm({ name: r.data.data.user.name, headline: r.data.data.profile?.headline || '', bio: r.data.data.profile?.bio || '' }); }).catch(console.error);
    if (user?.role === 'student') API.get('/certificates/my').then(r => setCerts(r.data.data)).catch(() => {});
  }, [user]);

  const handleSave = async () => {
    try {
      await API.put('/profile/me', form);
      toast.success('Profile updated!');
      setEditing(false);
      const r = await API.get('/profile/me');
      setProfile(r.data.data);
    } catch (err) { toast.error('Failed to update'); }
  };

  if (!profile) return <><Navbar /><p style={{padding:'3rem',textAlign:'center'}}>Loading...</p></>;
  const { user: u, profile: p } = profile;

  const inputStyle = { width: '100%', padding: '0.7rem 1rem', border: '1px solid #e0e0e0', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' };

  return (
    <><Navbar />
      <div style={{maxWidth:'700px',margin:'2rem auto',padding:'0 2rem'}}>
        <div style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',padding:'2rem',borderRadius:'16px',color:'#fff',marginBottom:'2rem'}}>
          <div style={{width:'64px',height:'64px',borderRadius:'50%',background:'rgba(255,255,255,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.8rem',marginBottom:'1rem'}}>{u.name?.charAt(0).toUpperCase()}</div>
          <h1 style={{margin:'0 0 0.25rem',fontSize:'1.6rem'}}>{u.name}</h1>
          <p style={{margin:0,opacity:0.85}}>{u.email} · {u.role.charAt(0).toUpperCase() + u.role.slice(1)}</p>
          {p?.headline && <p style={{margin:'0.5rem 0 0',opacity:0.9,fontSize:'0.9rem'}}>{p.headline}</p>}
        </div>
        <div style={{background:'#fff',padding:'1.5rem',borderRadius:'14px',boxShadow:'0 2px 8px rgba(0,0,0,0.05)',marginBottom:'1.5rem'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
            <h2 style={{margin:0,fontSize:'1.1rem',color:'#1a1a2e'}}>Profile Details</h2>
            <button onClick={() => editing ? handleSave() : setEditing(true)} style={{background:editing?'#16a34a':'#6366f1',color:'#fff',border:'none',padding:'0.5rem 1.25rem',borderRadius:'8px',fontWeight:600,cursor:'pointer'}}>{editing ? 'Save' : 'Edit'}</button>
          </div>
          {editing ? (
            <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
              <input style={inputStyle} value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Name" />
              {u.role === 'teacher' && <><input style={inputStyle} value={form.headline} onChange={e => setForm({...form, headline: e.target.value})} placeholder="Headline" /><textarea style={{...inputStyle,minHeight:'100px'}} value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} placeholder="Bio" /></>}
            </div>
          ) : (
            <div style={{fontSize:'0.9rem',color:'#555',lineHeight:1.8}}>
              <p><strong>Name:</strong> {u.name}</p>
              <p><strong>Email:</strong> {u.email}</p>
              <p><strong>Role:</strong> {u.role}</p>
              <p><strong>Joined:</strong> {new Date(u.createdAt).toLocaleDateString()}</p>
              {p?.bio && <p><strong>Bio:</strong> {p.bio}</p>}
              {u.role === 'student' && <p><strong>Enrolled Courses:</strong> {p?.enrolledCourses?.length || 0}</p>}
            </div>
          )}
        </div>
        {user?.role === 'student' && certs.length > 0 && (
          <div style={{background:'#fff',padding:'1.5rem',borderRadius:'14px',boxShadow:'0 2px 8px rgba(0,0,0,0.05)'}}>
            <h2 style={{margin:'0 0 1rem',fontSize:'1.1rem',color:'#1a1a2e'}}>🏆 My Certificates</h2>
            {certs.map(c => (
              <div key={c._id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0.75rem 0',borderBottom:'1px solid #f0f0f0'}}>
                <div><strong style={{fontSize:'0.9rem'}}>{c.course?.title}</strong><p style={{margin:0,fontSize:'0.78rem',color:'#888'}}>Score: {c.score}% · {new Date(c.completedAt).toLocaleDateString()}</p></div>
                <button onClick={async () => { const r = await API.get(`/certificates/${c.course?._id}/download`,{responseType:'blob'}); const url=URL.createObjectURL(new Blob([r.data])); const a=document.createElement('a'); a.href=url; a.download='certificate.pdf'; a.click(); }} style={{color:'#6366f1',background:'none',border:'none',cursor:'pointer',fontWeight:600,fontSize:'0.82rem'}}>Download PDF</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
