import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import API from '../../api/axios';
import './MyCertificates.css';

export default function MyCertificates() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/certificates/my').then(r => setCerts(r.data.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleDownload = async (courseId) => {
    try {
      const res = await API.get(`/certificates/${courseId}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a'); a.href = url; a.download = `certificate.pdf`; a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) { console.error(err); }
  };

  return (
    <><Navbar />
      <div className="certs-wrapper">
        <h1>My Certificates</h1>
        <p className="certs-sub">Your earned achievements</p>
        {loading ? <p>Loading...</p> : certs.length === 0 ? <p className="certs-empty">No certificates yet. Complete all quizzes in a course to earn one!</p> : (
          <div className="certs-grid">
            {certs.map(c => (
              <div key={c._id} className="cert-card">
                <div className="cert-icon">🏆</div>
                <h3>{c.course?.title || 'Course'}</h3>
                <p>Score: {c.score}%</p>
                <p className="cert-date">{new Date(c.completedAt).toLocaleDateString()}</p>
                <button className="cert-download" onClick={() => handleDownload(c.course?._id)}>Download PDF</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
