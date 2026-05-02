import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import API from '../../api/axios';
import './CourseDetail.css';

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useSelector((s) => s.auth);
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  // Progress
  const [completedLectures, setCompletedLectures] = useState(new Set());
  // Comments
  const [comments, setComments] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [courseRes, modulesRes, profileRes] = await Promise.all([
          API.get(`/courses/${id}`),
          API.get(`/courses/${id}/modules`),
          API.get('/profile/me'),
        ]);
        setCourse(courseRes.data.data);

        const rawModules = modulesRes.data.data || [];
        setModules(rawModules);

        const enrolled = profileRes.data.data.profile?.enrolledCourses || [];
        const enrolledStatus = enrolled.some((c) => {
          const cId = typeof c === 'object' ? c._id : c;
          return cId?.toString() === id;
        });
        setIsEnrolled(enrolledStatus);

        // Load progress if enrolled
        if (enrolledStatus) {
          try {
            const progRes = await API.get(`/progress/${id}`);
            const completed = new Set((progRes.data.data || []).map(p => p.lecture));
            setCompletedLectures(completed);
          } catch { /* ignore */ }
        }

        // Load comments
        try {
          const commRes = await API.get(`/courses/${id}/comments`);
          setComments(commRes.data.data.comments || []);
          setAvgRating(commRes.data.data.avgRating || 0);
          setReviewCount(commRes.data.data.reviewCount || 0);
        } catch { /* ignore */ }
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    load();
  }, [id]);

  const handleEnroll = async () => {
    try {
      await API.post(`/courses/${id}/enroll`);
      setIsEnrolled(true);
      toast.success('Enrolled successfully!');
    } catch (err) { toast.error(err.response?.data?.message || 'Enrollment failed'); }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) { toast.error('Please write a comment'); return; }
    setSubmitting(true);
    try {
      const { data } = await API.post(`/courses/${id}/comments`, { content: newComment, rating: newRating });
      setComments([data.data, ...comments]);
      setNewComment('');
      setNewRating(5);
      toast.success('Review posted!');
      // Refresh ratings
      const commRes = await API.get(`/courses/${id}/comments`);
      setAvgRating(commRes.data.data.avgRating || 0);
      setReviewCount(commRes.data.data.reviewCount || 0);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to post review'); }
    setSubmitting(false);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await API.delete(`/courses/${id}/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
      toast.success('Comment deleted');
    } catch { toast.error('Failed to delete'); }
  };

  // Count total lectures and completed
  const totalLectures = modules.filter(m => m.lecture).length;
  const completedCount = [...completedLectures].filter(lId =>
    modules.some(m => m.lecture && (m.lecture._id === lId || m.lecture === lId))
  ).length;
  const progressPercent = totalLectures > 0 ? Math.round((completedCount / totalLectures) * 100) : 0;

  if (loading) return <><Navbar /><div className="cd-wrapper"><p>Loading...</p></div></>;
  if (!course) return <><Navbar /><div className="cd-wrapper"><p>Course not found.</p></div></>;

  return (
    <>
      <Navbar />
      <div className="cd-wrapper">
        <div className="cd-hero" style={{ background: `linear-gradient(135deg, #6366f1, #8b5cf6)` }}>
          <div className="cd-hero-content">
            <span className="cd-badge">{course.category}</span>
            <h1>{course.title}</h1>
            <p>{course.description}</p>
            <div className="cd-meta">
              <span>👤 {course.instructor?.name || 'Instructor'}</span>
              <span>📊 {course.difficulty}</span>
              <span>📚 {course.totalEnrolments} enrolled</span>
              {reviewCount > 0 && <span>⭐ {avgRating}/5 ({reviewCount} reviews)</span>}
            </div>
            {!isEnrolled ? (
              <button className="cd-enroll-btn" onClick={handleEnroll}>Enroll Now — Free</button>
            ) : (
              <span className="cd-enrolled-badge">✓ Enrolled</span>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {isEnrolled && totalLectures > 0 && (
          <div style={{background:'#fff',padding:'1.25rem 1.5rem',borderRadius:'14px',boxShadow:'0 2px 8px rgba(0,0,0,0.05)',margin:'1.5rem auto',maxWidth:'800px'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.5rem',fontSize:'0.85rem',fontWeight:600}}>
              <span style={{color:'#1a1a2e'}}>Your Progress</span>
              <span style={{color:'#6366f1'}}>{completedCount}/{totalLectures} lectures · {progressPercent}%</span>
            </div>
            <div style={{width:'100%',height:'8px',borderRadius:'999px',background:'#e5e7eb'}}>
              <div style={{width:`${progressPercent}%`,height:'100%',borderRadius:'999px',background:'linear-gradient(90deg,#6366f1,#8b5cf6)',transition:'width 0.5s ease'}} />
            </div>
          </div>
        )}

        <div className="cd-modules">
          <h2>Course Modules ({modules.length})</h2>
          {modules.length === 0 ? <p className="cd-empty">No modules yet.</p> : (
            <div className="cd-module-list">
              {modules.map((item, idx) => {
                const mod = item.module || item;
                const lectureId = item.lecture?._id || item.lecture;
                const isCompleted = lectureId && completedLectures.has(lectureId);
                return (
                  <div key={mod._id} className="cd-module-item">
                    <div className="cd-module-num" style={isCompleted ? {background:'#16a34a',color:'#fff'} : {}}>
                      {isCompleted ? '✓' : idx + 1}
                    </div>
                    <div className="cd-module-info">
                      <h3>{mod.title}</h3>
                      <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.78rem', color: '#888' }}>
                        {item.lecture && <span>📖 Lecture</span>}
                        {item.quiz && <span>📝 Quiz</span>}
                        {isCompleted && <span style={{color:'#16a34a',fontWeight:600}}>✅ Completed</span>}
                      </div>
                      {isEnrolled ? (
                        <Link to={`/courses/${id}/modules/${mod._id}`} className="cd-module-link">
                          {isCompleted ? 'Review →' : 'Start Learning →'}
                        </Link>
                      ) : (
                        <span className="cd-module-locked">Enroll to access</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Comments & Reviews */}
        <div style={{maxWidth:'800px',margin:'2rem auto'}}>
          <h2 style={{fontSize:'1.2rem',color:'#1a1a2e',marginBottom:'1rem'}}>
            Reviews & Ratings {reviewCount > 0 && `(${reviewCount})`}
          </h2>

          {/* Add review form — only for enrolled students */}
          {isEnrolled && user?.role === 'student' && (
            <div style={{background:'#fff',padding:'1.5rem',borderRadius:'14px',boxShadow:'0 2px 8px rgba(0,0,0,0.05)',marginBottom:'1.5rem'}}>
              <div style={{display:'flex',gap:'0.5rem',marginBottom:'0.75rem'}}>
                {[1,2,3,4,5].map(star => (
                  <button key={star} onClick={() => setNewRating(star)}
                    style={{background:'none',border:'none',fontSize:'1.5rem',cursor:'pointer',opacity: star <= newRating ? 1 : 0.3}}>
                    ⭐
                  </button>
                ))}
              </div>
              <textarea
                style={{width:'100%',padding:'0.7rem 1rem',border:'1px solid #e0e0e0',borderRadius:'10px',fontSize:'0.9rem',outline:'none',boxSizing:'border-box',minHeight:'80px',resize:'vertical'}}
                placeholder="Share your experience with this course..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button onClick={handleAddComment} disabled={submitting}
                style={{marginTop:'0.75rem',background:'#6366f1',color:'#fff',border:'none',padding:'0.6rem 1.5rem',borderRadius:'8px',fontWeight:600,cursor:'pointer'}}>
                {submitting ? 'Posting...' : 'Post Review'}
              </button>
            </div>
          )}

          {/* Comments list */}
          {comments.length === 0 ? (
            <p style={{color:'#999',textAlign:'center'}}>No reviews yet. Be the first!</p>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
              {comments.map(c => (
                <div key={c._id} style={{background:'#fff',padding:'1.25rem',borderRadius:'12px',boxShadow:'0 2px 8px rgba(0,0,0,0.05)'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.5rem'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                      <div style={{width:'32px',height:'32px',borderRadius:'50%',background:'#6366f1',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.75rem',fontWeight:700}}>
                        {c.student?.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <strong style={{fontSize:'0.88rem'}}>{c.student?.name || 'Student'}</strong>
                      <span style={{fontSize:'0.78rem',color:'#888'}}>{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:'0.25rem'}}>
                      {'⭐'.repeat(c.rating)}
                      {c.student?._id === user?._id && (
                        <button onClick={() => handleDeleteComment(c._id)}
                          style={{marginLeft:'0.5rem',background:'none',border:'none',color:'#ef4444',cursor:'pointer',fontSize:'0.75rem'}}>
                          🗑
                        </button>
                      )}
                    </div>
                  </div>
                  <p style={{margin:0,fontSize:'0.88rem',color:'#555',lineHeight:1.6}}>{c.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
