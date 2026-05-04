import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';

export default function CertificateVerify() {
  const { uuid } = useParams();
  const [cert, setCert] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    API.get(`/certificates/verify/${uuid}`)
      .then(r => setCert(r.data.data))
      .catch(err => setError(err.response?.data?.message || 'Invalid certificate'));
  }, [uuid]);

  return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',minHeight:'100vh',background:'#f8f9ff'}}>
      <div style={{background:'#fff',padding:'3rem',borderRadius:'16px',boxShadow:'0 4px 24px rgba(0,0,0,0.08)',maxWidth:'500px',textAlign:'center',width:'100%'}}>
        {error ? (
          <><div style={{fontSize:'3rem'}}>❌</div><h1 style={{color:'#dc2626'}}>Invalid Certificate</h1><p style={{color:'#666'}}>{error}</p></>
        ) : cert ? (
          <><div style={{fontSize:'3rem'}}>✅</div><h1 style={{color:'#16a34a',fontSize:'1.5rem'}}>Certificate Verified</h1>
          <div style={{textAlign:'left',margin:'1.5rem 0',fontSize:'0.9rem',lineHeight:2,color:'#555'}}>
            <p><strong>Student:</strong> {cert.student}</p>
            <p><strong>Course:</strong> {cert.course}</p>
            <p><strong>Score:</strong> {cert.score}%</p>
            <p><strong>Completed:</strong> {new Date(cert.completedAt).toLocaleDateString()}</p>
          </div></>
        ) : <p style={{color:'#999'}}>Verifying...</p>}
      </div>
    </div>
  );
}

