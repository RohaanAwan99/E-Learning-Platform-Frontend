import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import API from '../api/axios';
import './stylesheets/tutorialscreen.css';
import './stylesheets/lectureContent.css';

export default function TutorialScreen() {
  const { courseId, moduleId } = useParams();
  const [modules, setModules] = useState([]);
  const [currentModule, setCurrentModule] = useState(null);
  const [course, setCourse] = useState(null);
  const [completedLectures, setCompletedLectures] = useState(new Set());
  const [marking, setMarking] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState('');
  const messagesRef = useRef(null);

  const quickPrompts = [
    'Summarize this lecture in 5 bullet points.',
    'Explain this lecture as if I am new to the topic.',
    'Give me 3 practice questions with answers.',
    'Highlight the key terms I should remember.',
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const [courseRes, modsRes, modRes, profileRes] = await Promise.all([
          API.get(`/courses/${courseId}`),
          API.get(`/courses/${courseId}/modules`),
          API.get(`/courses/${courseId}/modules/${moduleId}`),
          API.get('/profile/me'),
        ]);
        setCourse(courseRes.data.data);
        setModules(modsRes.data.data || []);
        setCurrentModule(modRes.data.data);

        const enrolledCourses = profileRes.data.data.profile?.enrolledCourses || [];
        const enrolledStatus = enrolledCourses.some((c) => {
          const cId = typeof c === 'object' ? c._id : c;
          return cId?.toString() === courseId;
        });
        setIsEnrolled(enrolledStatus);

        // Load progress
        try {
          const progRes = await API.get(`/progress/${courseId}`);
          setCompletedLectures(new Set((progRes.data.data || []).map(p => p.lecture)));
        } catch { /* not enrolled or no progress yet */ }
      } catch (err) { console.error(err); }
    };
    load();
  }, [courseId, moduleId]);

  useEffect(() => {
    setChatMessages([]);
    setChatInput('');
    setChatError('');
  }, [moduleId]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [chatMessages, chatLoading]);

  const hasQuiz = currentModule?.quiz != null;
  const currentLectureId = currentModule?.lecture?._id;
  const isCurrentCompleted = currentLectureId && completedLectures.has(currentLectureId);
  const canChat = Boolean(isEnrolled && currentLectureId);

  const handleMarkComplete = async () => {
    if (!currentModule?.lecture?._id) return;
    setMarking(true);
    try {
      await API.post('/progress/complete', {
        lectureId: currentModule.lecture._id,
        moduleId: moduleId,
        courseId: courseId,
      });
      setCompletedLectures(prev => new Set([...prev, currentModule.lecture._id]));
      toast.success('Lecture marked as complete! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to mark complete');
    }
    setMarking(false);
  };

  const handleSend = async (presetText) => {
    if (!canChat || chatLoading) return;

    const text = (presetText ?? chatInput).trim();
    if (!text) return;

    setChatInput('');
    setChatError('');
    setChatMessages((prev) => [...prev, { role: 'user', content: text }]);
    setChatLoading(true);

    try {
      const { data } = await API.post(`/courses/${courseId}/chat`, {
        lectureId: currentLectureId,
        message: text,
      });
      const reply = data?.data?.reply || 'I could not generate a response. Please try again.';
      setChatMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'Unable to reach the tutor right now.';
      setChatError(errorMessage);
    }

    setChatLoading(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  // Calculate progress
  const totalLectures = modules.filter(m => m.lecture).length;
  const completedCount = modules.filter(m => m.lecture && completedLectures.has(m.lecture._id || m.lecture)).length;
  const progressPercent = totalLectures > 0 ? Math.round((completedCount / totalLectures) * 100) : 0;

  return (
    <div className="app">
      <Navbar />
      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-header">
            <p className="sidebar-title">{course?.title || 'Course'}</p>
            <p className="sidebar-subtitle">{course?.category || ''}</p>
            {/* Progress indicator */}
            {totalLectures > 0 && (
              <div style={{margin:'0.75rem 0'}}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.7rem',color:'rgba(255,255,255,0.7)',marginBottom:'0.25rem'}}>
                  <span>Progress</span>
                  <span>{progressPercent}%</span>
                </div>
                <div style={{width:'100%',height:'4px',borderRadius:'999px',background:'rgba(255,255,255,0.2)'}}>
                  <div style={{width:`${progressPercent}%`,height:'100%',borderRadius:'999px',background:'#fff',transition:'width 0.3s ease'}} />
                </div>
              </div>
            )}
            {hasQuiz && (
              <Link to={`/courses/${courseId}/modules/${moduleId}/quiz`} className="quiz-start-btn">Attempt Quiz</Link>
            )}
          </div>
          <nav className="sidebar-nav">
            {modules.map((item) => {
              const mod = item.module || item;
              const lectureId = item.lecture?._id || item.lecture;
              const isDone = lectureId && completedLectures.has(lectureId);
              return (
                <Link
                  to={`/courses/${courseId}/modules/${mod._id}`}
                  key={mod._id}
                  className={`sidebar-item ${mod._id === moduleId ? 'active' : ''}`}
                >
                  {isDone && <span style={{marginRight:'0.4rem',color:'#4ade80'}}>✓</span>}
                  {mod.title}
                  {item.quiz && <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', opacity: 0.6 }}>📝</span>}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="main-content">
          {currentModule ? (
            <div className="lecture-layout">
              <article className="lecture-panel">
                <h1>{currentModule.lecture?.title || currentModule.module?.title || 'Lecture'}</h1>
                <div
                  className="lecture-content"
                  dangerouslySetInnerHTML={{
                    __html: currentModule.lecture?.content || '<p>No content available for this module.</p>'
                  }}
                />
                {/* Mark Complete Button */}
                {currentModule.lecture && (
                  <div style={{marginTop:'2rem',paddingTop:'1.5rem',borderTop:'1px solid #e5e7eb',display:'flex',alignItems:'center',gap:'1rem'}}>
                    {isCurrentCompleted ? (
                      <div style={{display:'flex',alignItems:'center',gap:'0.5rem',color:'#16a34a',fontWeight:600,fontSize:'0.9rem'}}>
                        <span style={{fontSize:'1.2rem'}}>✅</span> Lecture Completed
                      </div>
                    ) : (
                      <button
                        onClick={handleMarkComplete}
                        disabled={marking}
                        style={{
                          background:'linear-gradient(135deg,#16a34a,#22c55e)',
                          color:'#fff',
                          border:'none',
                          padding:'0.75rem 2rem',
                          borderRadius:'10px',
                          fontWeight:700,
                          fontSize:'0.9rem',
                          cursor:'pointer',
                          transition:'transform 0.2s',
                        }}
                      >
                        {marking ? 'Marking...' : '✓ Mark as Complete'}
                      </button>
                    )}
                    {/* Next module link */}
                    {(() => {
                      const currentIdx = modules.findIndex(m => (m.module?._id || m._id) === moduleId);
                      const next = modules[currentIdx + 1];
                      if (next) {
                        const nextId = next.module?._id || next._id;
                        return (
                          <Link to={`/courses/${courseId}/modules/${nextId}`}
                            style={{color:'#6366f1',fontWeight:600,fontSize:'0.88rem',textDecoration:'none'}}>
                            Next Module →
                          </Link>
                        );
                      }
                      return null;
                    })()}
                  </div>
                )}
              </article>
              <aside className="tutor-panel">
                <div className="tutor-card">
                  <div className="tutor-header">
                    <div>
                      <span className="tutor-eyebrow">Personal Tutor</span>
                      <h3>Ask about this lecture</h3>
                    </div>
                    <span className={`tutor-status ${canChat ? 'online' : 'locked'}`}>
                      {canChat ? 'Available' : 'Locked'}
                    </span>
                  </div>
                  <div className="tutor-body">
                    {!isEnrolled && (
                      <div className="tutor-locked">
                        <p>Enroll in this course to unlock the personal tutor.</p>
                      </div>
                    )}
                    {isEnrolled && !currentLectureId && (
                      <div className="tutor-locked">
                        <p>Select a lecture to start chatting.</p>
                      </div>
                    )}
                    {canChat && (
                      <>
                        <div className="tutor-messages" ref={messagesRef}>
                          {chatMessages.length === 0 && !chatLoading && (
                            <div className="tutor-empty">
                              <p>Try a quick prompt or ask a question about this lecture.</p>
                            </div>
                          )}
                          {chatMessages.map((msg, idx) => (
                            <div key={`${msg.role}-${idx}`} className={`tutor-message ${msg.role}`}>
                              <div className="tutor-bubble">{msg.content}</div>
                            </div>
                          ))}
                          {chatLoading && (
                            <div className="tutor-message assistant">
                              <div className="tutor-bubble tutor-typing">Tutor is thinking...</div>
                            </div>
                          )}
                        </div>
                        <div className="tutor-chips">
                          {quickPrompts.map((prompt) => (
                            <button
                              key={prompt}
                              type="button"
                              className="tutor-chip"
                              onClick={() => handleSend(prompt)}
                              disabled={chatLoading}
                            >
                              {prompt}
                            </button>
                          ))}
                        </div>
                        <form className="tutor-input" onSubmit={(event) => {
                          event.preventDefault();
                          handleSend();
                        }}>
                          <textarea
                            placeholder="Ask about this lecture..."
                            value={chatInput}
                            onChange={(event) => setChatInput(event.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={chatLoading}
                            rows={3}
                          />
                          <div className="tutor-actions">
                            <span className="tutor-hint">Enter to send, Shift+Enter for a new line</span>
                            <button type="submit" disabled={chatLoading || !chatInput.trim()}>
                              {chatLoading ? 'Sending...' : 'Send'}
                            </button>
                          </div>
                        </form>
                        {chatError && <div className="tutor-error">{chatError}</div>}
                      </>
                    )}
                  </div>
                </div>
              </aside>
            </div>
          ) : (
            <p style={{ padding: '2rem', color: '#999' }}>Loading module...</p>
          )}
        </main>
      </div>
    </div>
  );
}
