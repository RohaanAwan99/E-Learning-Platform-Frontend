import Navbar from '../components/Navbar';

export default function ContactPage() {
  return (
    <><Navbar />
      <div style={{maxWidth:'600px',margin:'2rem auto',padding:'0 2rem'}}>
        <h1 style={{fontSize:'1.8rem',color:'#1a1a2e'}}>Contact Us</h1>
        <p style={{color:'#666',marginBottom:'2rem'}}>Have questions? Reach out and we'll get back to you.</p>
        <form onSubmit={e => { e.preventDefault(); alert('Message sent!'); }} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
          <input placeholder="Your Name" style={{padding:'0.7rem 1rem',border:'1px solid #e0e0e0',borderRadius:'10px',fontSize:'0.9rem'}} />
          <input type="email" placeholder="Your Email" style={{padding:'0.7rem 1rem',border:'1px solid #e0e0e0',borderRadius:'10px',fontSize:'0.9rem'}} />
          <textarea placeholder="Your Message" style={{padding:'0.7rem 1rem',border:'1px solid #e0e0e0',borderRadius:'10px',fontSize:'0.9rem',minHeight:'150px',resize:'vertical'}} />
          <button type="submit" style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',border:'none',padding:'0.85rem',borderRadius:'10px',fontWeight:700,cursor:'pointer'}}>Send Message</button>
        </form>
      </div>
    </>
  );
}
