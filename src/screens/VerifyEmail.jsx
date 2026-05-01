import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import './stylesheets/loginpage.css';

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    API.get(`/auth/verify-email/${token}`)
      .then((res) => { setStatus('success'); setMessage('Email verified! You can now log in.'); })
      .catch((err) => { setStatus('error'); setMessage(err.response?.data?.message || 'Verification failed'); });
  }, [token]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f8f9ff' }}>
      <div style={{ textAlign: 'center', background: '#fff', padding: '3rem', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', maxWidth: '420px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          {status === 'verifying' ? '⏳' : status === 'success' ? '✅' : '❌'}
        </div>
        <h1 style={{ fontSize: '1.5rem', color: '#1a1a2e', marginBottom: '0.5rem' }}>
          {status === 'verifying' ? 'Verifying...' : status === 'success' ? 'Success!' : 'Error'}
        </h1>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>{message || 'Please wait while we verify your email.'}</p>
        {status !== 'verifying' && <Link to="/login" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Go to Login →</Link>}
      </div>
    </div>
  );
}
