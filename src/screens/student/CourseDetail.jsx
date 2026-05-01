import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import API from '../../api/axios';
import './CourseDetail.css';

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [courseRes, modulesRes, profileRes] = await Promise.all([
          API.get(`/courses/${id}`),
          API.get(`/courses/${id}/modules`),
          API.get('/profile/me'),
        ]);
        setCourse(courseRes.data.data);

        // Backend returns [{ module, lecture, quiz }] — extract properly
        const rawModules = modulesRes.data.data || [];
        setModules(rawModules);

        // Check enrollment — handle both ObjectId strings and populated objects
        const enrolled = profileRes.data.data.profile?.enrolledCourses || [];
        setIsEnrolled(enrolled.some((c) => {
          const cId = typeof c === 'object' ? c._id : c;
          return cId?.toString() === id;
        }));
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
            </div>
            {!isEnrolled ? (
              <button className="cd-enroll-btn" onClick={handleEnroll}>Enroll Now — Free</button>
            ) : (
              <span className="cd-enrolled-badge">✓ Enrolled</span>
            )}
          </div>
        </div>
        <div className="cd-modules">
          <h2>Course Modules ({modules.length})</h2>
          {modules.length === 0 ? <p className="cd-empty">No modules yet.</p> : (
            <div className="cd-module-list">
              {modules.map((item, idx) => {
                // item is { module: {...}, lecture: {...}, quiz: {...} }
                const mod = item.module || item;
                return (
                  <div key={mod._id} className="cd-module-item">
                    <div className="cd-module-num">{idx + 1}</div>
                    <div className="cd-module-info">
                      <h3>{mod.title}</h3>
                      <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.78rem', color: '#888' }}>
                        {item.lecture && <span>📖 Lecture</span>}
                        {item.quiz && <span>📝 Quiz</span>}
                      </div>
                      {isEnrolled ? (
                        <Link to={`/courses/${id}/modules/${mod._id}`} className="cd-module-link">Start Learning →</Link>
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
      </div>
    </>
  );
}
