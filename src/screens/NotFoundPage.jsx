import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',minHeight:'100vh',background:'#f8f9ff',textAlign:'center'}}>
      <div>
        <h1 style={{fontSize:'6rem',color:'#6366f1',margin:0}}>404</h1>
        <h2 style={{color:'#1a1a2e',margin:'0.5rem 0'}}>Page Not Found</h2>
        <p style={{color:'#666',marginBottom:'1.5rem'}}>The page you're looking for doesn't exist.</p>
        <Link to="/" style={{color:'#fff',background:'#6366f1',padding:'0.75rem 2rem',borderRadius:'10px',textDecoration:'none',fontWeight:600}}>Go Home</Link>
      </div>
    </div>
  );
}

