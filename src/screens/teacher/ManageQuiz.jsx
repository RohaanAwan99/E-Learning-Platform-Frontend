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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // Try to get existing quiz for this module
        const qRes = await API.get(`/courses/${courseId}/modules/${moduleId}/quiz`);
        const quizData = qRes.data.data;
        setQuiz(quizData);

        // Questions may be populated objects or IDs
        if (quizData.questions?.length > 0 && typeof quizData.questions[0] === 'object') {
          setQuestions(quizData.questions);
        } else if (quizData.questions?.length > 0) {
          // Fetch separately
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
          });
          setQuiz(data.data);
        } catch (err) { toast.error('Failed to create quiz'); }
      }
      setLoading(false);
    };
    load();
  }, [courseId, moduleId]);

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

  const inputStyle = { width: '100%', padding: '0.6rem 0.8rem', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' };

  if (loading) return <><Navbar /><p style={{padding:'3rem',textAlign:'center'}}>Loading...</p></>;

  return (
    <><Navbar />
      <div style={{maxWidth:'700px',margin:'2rem auto',padding:'0 2rem'}}>
        <h1 style={{fontSize:'1.5rem',color:'#1a1a2e'}}>Manage Quiz</h1>
        {quiz && <p style={{color:'#888',fontSize:'0.82rem'}}>Quiz ID: {quiz._id} · Pass Mark: {quiz.passMark}%</p>}

        <h2 style={{fontSize:'1.1rem',color:'#333',margin:'1.5rem 0 1rem'}}>Existing Questions ({questions.length})</h2>
        {questions.length === 0 && <p style={{color:'#999',fontSize:'0.85rem'}}>No questions yet. Add one below.</p>}
        {questions.map((q, i) => (
          <div key={q._id} style={{background:'#fff',padding:'1rem',borderRadius:'10px',marginBottom:'0.75rem',boxShadow:'0 1px 4px rgba(0,0,0,0.05)'}}>
            <div style={{display:'flex',justifyContent:'space-between'}}>
              <strong style={{fontSize:'0.9rem'}}>Q{i+1}: {q.text}</strong>
              <button onClick={() => deleteQuestion(q._id)} style={{color:'#dc2626',background:'none',border:'none',cursor:'pointer',fontSize:'0.8rem'}}>Delete</button>
            </div>
            <div style={{fontSize:'0.8rem',color:'#666',marginTop:'0.25rem'}}>
              {q.options.map((o, j) => (
                <span key={j} style={{marginRight:'1rem',color: j === q.correctIndex ? '#16a34a' : '#666'}}>
                  {j === q.correctIndex ? '✓ ' : ''}{o}
                </span>
              ))}
            </div>
          </div>
        ))}

        <h2 style={{fontSize:'1.1rem',color:'#333',margin:'2rem 0 1rem'}}>Add New Question</h2>
        <div style={{background:'#fff',padding:'1.25rem',borderRadius:'12px',boxShadow:'0 2px 8px rgba(0,0,0,0.05)',display:'flex',flexDirection:'column',gap:'0.75rem'}}>
          <input style={inputStyle} placeholder="Question text" value={newQ.text} onChange={e => setNewQ({...newQ, text: e.target.value})} />
          <select style={inputStyle} value={newQ.type} onChange={e => setNewQ({...newQ, type: e.target.value, options: e.target.value === 'true_false' ? ['True','False'] : ['','','','']})}>
            <option value="mcq">Multiple Choice</option>
            <option value="true_false">True/False</option>
          </select>
          {newQ.options.map((opt, i) => (
            <div key={i} style={{display:'flex',gap:'0.5rem',alignItems:'center'}}>
              <input type="radio" name="correct" checked={newQ.correctIndex === i} onChange={() => setNewQ({...newQ, correctIndex: i})} />
              <input style={{...inputStyle, flex:1}} placeholder={`Option ${i+1}`} value={opt} onChange={e => { const opts = [...newQ.options]; opts[i] = e.target.value; setNewQ({...newQ, options: opts}); }} />
            </div>
          ))}
          <input style={inputStyle} placeholder="Explanation (optional)" value={newQ.explanation} onChange={e => setNewQ({...newQ, explanation: e.target.value})} />
          <button onClick={addQuestion} style={{background:'#6366f1',color:'#fff',border:'none',padding:'0.7rem',borderRadius:'8px',fontWeight:600,cursor:'pointer'}}>Add Question</button>
        </div>
      </div>
    </>
  );
}
