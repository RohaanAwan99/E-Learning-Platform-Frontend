import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import API from '../../api/axios';

export default function ManageQuiz() {
  const { courseId, moduleId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [newQ, setNewQ] = useState({ text: '', type: 'mcq', options: ['', '', '', ''], correctIndex: 0, explanation: '' });
  const [quizSettings, setQuizSettings] = useState({ passMark: 60, timeLimit: 0 });
  const [editingQ, setEditingQ] = useState(null); // question being edited
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        // Try to get existing quiz for this module
        const qRes = await API.get(`/courses/${courseId}/modules/${moduleId}/quiz`);
        const quizData = qRes.data.data;
        setQuiz(quizData);
        setQuizSettings({ passMark: quizData.passMark || 60, timeLimit: quizData.timeLimit || 0 });

        // Questions may be populated objects or IDs
        if (quizData.questions?.length > 0 && typeof quizData.questions[0] === 'object') {
          setQuestions(quizData.questions);
        } else if (quizData.questions?.length > 0) {
          try {
            const questRes = await API.get(`/questions?quiz=${quizData._id}`);
            setQuestions(questRes.data.data || []);
          } catch { setQuestions([]); }
        }
      } catch {
        // Quiz doesn't exist yet — create one
        try {
          const { data } = await API.post(`/courses/${courseId}/modules/${moduleId}/quiz`, {
            title: 'Module Quiz',
            passMark: 60,
            timeLimit: 0,
          });
          setQuiz(data.data);
        } catch (err) { toast.error('Failed to create quiz'); }
      }
      setLoading(false);
    };
    load();
  }, [courseId, moduleId]);

  const saveQuizSettings = async () => {
    if (!quiz) return;
    setSavingSettings(true);
    try {
      const { data } = await API.put(`/courses/${courseId}/modules/${moduleId}/quiz`, {
        passMark: quizSettings.passMark,
        timeLimit: quizSettings.timeLimit,
      });
      setQuiz(data.data);
      toast.success('Quiz settings saved!');
    } catch (err) { toast.error('Failed to save settings'); }
    setSavingSettings(false);
  };

  const addQuestion = async () => {
    if (!newQ.text || newQ.options.some(o => !o.trim())) { toast.error('Fill in all fields'); return; }
    try {
      const { data } = await API.post('/questions', {
        quiz: quiz._id,
        ...newQ,
        order: questions.length + 1,
      });
      setQuestions([...questions, data.data]);
      setNewQ({ text: '', type: 'mcq', options: ['', '', '', ''], correctIndex: 0, explanation: '' });
      toast.success('Question added!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const deleteQuestion = async (qId) => {
    try {
      await API.delete(`/questions/${qId}`);
      setQuestions(questions.filter(q => q._id !== qId));
      toast.success('Deleted');
    } catch { toast.error('Failed'); }
  };

  const startEdit = (q) => {
    setEditingQ({ ...q, options: [...q.options] });
  };

  const saveEdit = async () => {
    if (!editingQ) return;
    try {
      const { data } = await API.put(`/questions/${editingQ._id}`, {
        text: editingQ.text,
        options: editingQ.options,
        correctIndex: editingQ.correctIndex,
        explanation: editingQ.explanation,
      });
      setQuestions(questions.map(q => q._id === editingQ._id ? data.data : q));
      setEditingQ(null);
      toast.success('Question updated!');
    } catch (err) { toast.error('Failed to update'); }
  };

  const inputStyle = { width: '100%', padding: '0.6rem 0.8rem', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' };

  if (loading) return <><Navbar /><p style={{padding:'3rem',textAlign:'center'}}>Loading...</p></>;

  return (
    <><Navbar />
      <div style={{maxWidth:'700px',margin:'2rem auto',padding:'0 2rem'}}>
        <h1 style={{fontSize:'1.5rem',color:'#1a1a2e'}}>Manage Quiz</h1>

        {/* Quiz Settings */}
        {quiz && (
          <div style={{background:'#fff',padding:'1.25rem',borderRadius:'12px',boxShadow:'0 2px 8px rgba(0,0,0,0.05)',marginBottom:'1.5rem'}}>
            <h2 style={{fontSize:'1rem',color:'#333',margin:'0 0 1rem'}}>Quiz Settings</h2>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
              <div>
                <label style={{display:'block',fontSize:'0.8rem',fontWeight:600,color:'#555',marginBottom:'0.25rem'}}>Pass Mark (%)</label>
                <input
                  type="number" min="0" max="100" style={inputStyle}
                  value={quizSettings.passMark}
                  onChange={e => setQuizSettings({...quizSettings, passMark: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <label style={{display:'block',fontSize:'0.8rem',fontWeight:600,color:'#555',marginBottom:'0.25rem'}}>Time Limit (minutes)</label>
                <input
                  type="number" min="0" style={inputStyle}
                  value={quizSettings.timeLimit}
                  onChange={e => setQuizSettings({...quizSettings, timeLimit: parseInt(e.target.value) || 0})}
                />
                <span style={{fontSize:'0.72rem',color:'#999'}}>0 = unlimited</span>
              </div>
            </div>
            <button onClick={saveQuizSettings} disabled={savingSettings} style={{marginTop:'0.75rem',background:'#6366f1',color:'#fff',border:'none',padding:'0.5rem 1.25rem',borderRadius:'8px',fontWeight:600,fontSize:'0.8rem',cursor:'pointer'}}>
              {savingSettings ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        )}

        <h2 style={{fontSize:'1.1rem',color:'#333',margin:'1.5rem 0 1rem'}}>Questions ({questions.length})</h2>
        {questions.length === 0 && <p style={{color:'#999',fontSize:'0.85rem'}}>No questions yet. Add one below.</p>}
        {questions.map((q, i) => (
          <div key={q._id} style={{background:'#fff',padding:'1rem',borderRadius:'10px',marginBottom:'0.75rem',boxShadow:'0 1px 4px rgba(0,0,0,0.05)'}}>
            {editingQ && editingQ._id === q._id ? (
              /* Edit mode */
              <div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
                <input style={inputStyle} value={editingQ.text} onChange={e => setEditingQ({...editingQ, text: e.target.value})} />
                {editingQ.options.map((opt, j) => (
                  <div key={j} style={{display:'flex',gap:'0.5rem',alignItems:'center'}}>
                    <input type="radio" name="edit-correct" checked={editingQ.correctIndex === j} onChange={() => setEditingQ({...editingQ, correctIndex: j})} />
                    <input style={{...inputStyle, flex:1}} value={opt} onChange={e => { const opts = [...editingQ.options]; opts[j] = e.target.value; setEditingQ({...editingQ, options: opts}); }} />
                    {editingQ.correctIndex === j && <span style={{fontSize:'0.75rem',fontWeight:700,color:'#16a34a',whiteSpace:'nowrap'}}>✓ Correct</span>}
                  </div>
                ))}
                <input style={inputStyle} placeholder="Explanation" value={editingQ.explanation || ''} onChange={e => setEditingQ({...editingQ, explanation: e.target.value})} />
                <div style={{display:'flex',gap:'0.5rem'}}>
                  <button onClick={saveEdit} style={{background:'#16a34a',color:'#fff',border:'none',padding:'0.45rem 1rem',borderRadius:'6px',fontWeight:600,fontSize:'0.8rem',cursor:'pointer'}}>Save</button>
                  <button onClick={() => setEditingQ(null)} style={{background:'#f1f5f9',color:'#666',border:'none',padding:'0.45rem 1rem',borderRadius:'6px',fontWeight:600,fontSize:'0.8rem',cursor:'pointer'}}>Cancel</button>
                </div>
              </div>
            ) : (
              /* View mode */
              <>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  <strong style={{fontSize:'0.9rem'}}>Q{i+1}: {q.text}</strong>
                  <div style={{display:'flex',gap:'0.75rem'}}>
                    <button onClick={() => startEdit(q)} style={{color:'#6366f1',background:'none',border:'none',cursor:'pointer',fontSize:'0.8rem',fontWeight:600}}>Edit</button>
                    <button onClick={() => deleteQuestion(q._id)} style={{color:'#dc2626',background:'none',border:'none',cursor:'pointer',fontSize:'0.8rem',fontWeight:600}}>Delete</button>
                  </div>
                </div>
                <div style={{fontSize:'0.8rem',color:'#666',marginTop:'0.4rem',display:'flex',flexDirection:'column',gap:'0.2rem'}}>
                  {q.options.map((o, j) => (
                    <div key={j} style={{
                      display:'flex', alignItems:'center', gap:'0.4rem',
                      padding:'0.25rem 0.5rem', borderRadius:'6px',
                      background: j === q.correctIndex ? '#f0fdf4' : 'transparent',
                      color: j === q.correctIndex ? '#16a34a' : '#666',
                      fontWeight: j === q.correctIndex ? 600 : 400,
                    }}>
                      {j === q.correctIndex ? <span style={{fontSize:'0.9rem'}}>✓</span> : <span style={{width:'0.9rem',display:'inline-block'}}> </span>}
                      <span>{o}</span>
                    </div>
                  ))}
                </div>
                {q.explanation && <p style={{fontSize:'0.75rem',color:'#999',marginTop:'0.35rem',fontStyle:'italic'}}>💡 {q.explanation}</p>}
              </>
            )}
          </div>
        ))}

        <h2 style={{fontSize:'1.1rem',color:'#333',margin:'2rem 0 1rem'}}>Add New Question</h2>
        <div style={{background:'#fff',padding:'1.25rem',borderRadius:'12px',boxShadow:'0 2px 8px rgba(0,0,0,0.05)',display:'flex',flexDirection:'column',gap:'0.75rem'}}>
          <input style={inputStyle} placeholder="Question text" value={newQ.text} onChange={e => setNewQ({...newQ, text: e.target.value})} />
          <select style={inputStyle} value={newQ.type} onChange={e => setNewQ({...newQ, type: e.target.value, options: e.target.value === 'true_false' ? ['True','False'] : ['','','',''], correctIndex: 0})}>
            <option value="mcq">Multiple Choice</option>
            <option value="true_false">True/False</option>
          </select>
          <label style={{fontSize:'0.78rem',fontWeight:600,color:'#555'}}>Select the correct answer:</label>
          {newQ.options.map((opt, i) => (
            <div key={i} style={{display:'flex',gap:'0.5rem',alignItems:'center'}}>
              <input type="radio" name="correct" checked={newQ.correctIndex === i} onChange={() => setNewQ({...newQ, correctIndex: i})} />
              <input style={{...inputStyle, flex:1}} placeholder={`Option ${i+1}`} value={opt} onChange={e => { const opts = [...newQ.options]; opts[i] = e.target.value; setNewQ({...newQ, options: opts}); }} />
              {newQ.correctIndex === i && <span style={{fontSize:'0.75rem',fontWeight:700,color:'#16a34a',whiteSpace:'nowrap'}}>✓ Correct</span>}
            </div>
          ))}
          <input style={inputStyle} placeholder="Explanation (optional)" value={newQ.explanation} onChange={e => setNewQ({...newQ, explanation: e.target.value})} />
          <button onClick={addQuestion} style={{background:'#6366f1',color:'#fff',border:'none',padding:'0.7rem',borderRadius:'8px',fontWeight:600,cursor:'pointer'}}>Add Question</button>
        </div>
      </div>
    </>
  );
}
