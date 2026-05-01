import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../api/axios';
import './stylesheets/tutorialscreen.css';

export default function TutorialScreen() {
  const { courseId, moduleId } = useParams();
  const [modules, setModules] = useState([]);
  const [currentModule, setCurrentModule] = useState(null);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [courseRes, modsRes, modRes] = await Promise.all([
          API.get(`/courses/${courseId}`),
          API.get(`/courses/${courseId}/modules`),
          API.get(`/courses/${courseId}/modules/${moduleId}`),
        ]);
        setCourse(courseRes.data.data);

        // Backend returns [{ module, lecture, quiz }]
        setModules(modsRes.data.data || []);

        // Single module response: { module, lecture, quiz }
        setCurrentModule(modRes.data.data);
      } catch (err) { console.error(err); }
    };
    load();
  }, [courseId, moduleId]);

  // Determine quiz availability from the current module graph
  const hasQuiz = currentModule?.quiz != null;

  return (
    <div className="app">
      <Navbar />
      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-header">
            <p className="sidebar-title">{course?.title || 'Course'}</p>
            <p className="sidebar-subtitle">{course?.category || ''}</p>
            {hasQuiz && (
              <Link to={`/courses/${courseId}/modules/${moduleId}/quiz`} className="quiz-start-btn">Attempt Quiz</Link>
            )}
          </div>
          <nav className="sidebar-nav">
            {modules.map((item) => {
              // item is { module: {...}, lecture: {...}, quiz: {...} }
              const mod = item.module || item;
              return (
                <Link
                  to={`/courses/${courseId}/modules/${mod._id}`}
                  key={mod._id}
                  className={`sidebar-item ${mod._id === moduleId ? 'active' : ''}`}
                >
                  {mod.title}
                  {item.quiz && <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', opacity: 0.6 }}>📝</span>}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="main-content">
          {currentModule ? (
            <article>
              <h1>{currentModule.lecture?.title || currentModule.module?.title || 'Lecture'}</h1>
              <div
                className="body-text"
                dangerouslySetInnerHTML={{
                  __html: currentModule.lecture?.content || '<p>No content available for this module.</p>'
                }}
              />
            </article>
          ) : (
            <p style={{ padding: '2rem', color: '#999' }}>Loading module...</p>
          )}
        </main>
      </div>
    </div>
  );
}