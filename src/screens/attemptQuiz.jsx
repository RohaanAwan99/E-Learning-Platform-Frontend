import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api/axios';
import './stylesheets/attemptQuiz.css';

const AttemptQuiz = () => {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [quizId, setQuizId] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startedAt] = useState(() => new Date().toISOString());
  const [timeLeft, setTimeLeft] = useState(null); // seconds remaining
  const [showReview, setShowReview] = useState(false);
  const timerRef = useRef(null);
  const hasAutoSubmitted = useRef(false);

  useEffect(() => {
    const load = async () => {
      try {
        const quizRes = await API.get(`/courses/${courseId}/modules/${moduleId}/quiz`);
        const quiz = quizRes.data.data;
        setQuizId(quiz._id);
        setQuizData(quiz);

        // Set timer if timeLimit > 0
        if (quiz.timeLimit > 0) {
          setTimeLeft(quiz.timeLimit * 60); // convert minutes to seconds
        }

        if (quiz.questions && quiz.questions.length > 0 && typeof quiz.questions[0] === 'object') {
          setQuestions(quiz.questions);
        } else {
          try {
            const qRes = await API.get(`/questions?quiz=${quiz._id}`);
            setQuestions(qRes.data.data || []);
          } catch {
            setQuestions([]);
          }
        }
      } catch (err) {
        console.error('Quiz load error:', err);
        toast.error('Failed to load quiz');
      }
      setLoading(false);
    };
    load();
  }, [courseId, moduleId]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || submitted) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timeLeft !== null, submitted]);

  // Auto-submit callback
  const doSubmit = useCallback(async () => {
    if (submitted || isSubmitting || hasAutoSubmitted.current) return;
    hasAutoSubmitted.current = true;
    setIsSubmitting(true);
    const answers = questions.map((q, i) => ({
      questionId: q._id,
      selectedIndex: q.options.indexOf(selectedAnswers[i]) >= 0 ? q.options.indexOf(selectedAnswers[i]) : 0,
    }));
    try {
      const { data } = await API.post('/attempts', { quizId, answers, startedAt });
      setResult(data.data);
      setSubmitted(true);
      toast.success(`Score: ${data.data.score}% - ${data.data.passed ? 'Passed!' : 'Try again'}`);
    } catch (err) { toast.error(err.response?.data?.message || 'Submission failed'); }
    setIsSubmitting(false);
  }, [questions, selectedAnswers, quizId, startedAt, submitted]);

  // Auto-submit when timer reaches 0
  useEffect(() => {
    if (timeLeft === 0 && !submitted) {
      toast.warning('Time is up! Auto-submitting...');
      doSubmit();
    }
  }, [timeLeft, submitted, doSubmit]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (option) => {
    setSelectedAnswers({ ...selectedAnswers, [currentIndex]: option });
  };
  const handleNext = () => { if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1); };
  const handlePrevious = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1); };

  const handleSubmit = async () => {
    if (submitted || isSubmitting) return;
    if (Object.keys(selectedAnswers).length < questions.length) {
      toast.error('Please answer all questions before submitting.');
      return;
    }
    setIsSubmitting(true);
    const answers = questions.map((q, i) => ({
      questionId: q._id,
      selectedIndex: q.options.indexOf(selectedAnswers[i]) >= 0 ? q.options.indexOf(selectedAnswers[i]) : 0,
    }));
    try {
      const { data } = await API.post('/attempts', { quizId, answers, startedAt });
      setResult(data.data);
      setSubmitted(true);
      clearInterval(timerRef.current);
      toast.success(`Score: ${data.data.score}% - ${data.data.passed ? 'Passed!' : 'Try again'}`);
    } catch (err) { toast.error(err.response?.data?.message || 'Submission failed'); }
    setIsSubmitting(false);
  };

  const handleGenerateCert = async () => {
    try {
      await API.post(`/certificates/${courseId}/generate`);
      toast.success('Certificate generated!');
      navigate('/certificates');
    } catch (err) { toast.error(err.response?.data?.message || 'Certificate generation failed'); }
  };

  if (loading) return <div className="quiz-wrapper"><p style={{textAlign:'center',padding:'3rem'}}>Loading quiz...</p></div>;
  if (questions.length === 0) return <div className="quiz-wrapper"><p style={{textAlign:'center',padding:'3rem'}}>No questions found for this quiz.</p></div>;

  // Quiz Review Screen
  if (submitted && result && showReview) {
    return (
      <div className="quiz-wrapper">
        <div className="quiz-container">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
            <h1 style={{margin:0,fontSize:'1.5rem',color:'#1e293b'}}>Quiz Review</h1>
            <button className="btn btn-secondary" onClick={() => setShowReview(false)}>← Back to Results</button>
          </div>
          {questions.map((q, i) => {
            const studentAnswer = result.answers?.[i];
            const selectedIdx = studentAnswer?.selectedIndex ?? -1;
            const isCorrect = studentAnswer?.isCorrect;
            return (
              <div key={q._id} style={{
                background:'#fff', borderRadius:'12px', padding:'1.25rem', marginBottom:'1rem',
                border: `2px solid ${isCorrect ? '#86efac' : '#fca5a5'}`,
                boxShadow:'0 2px 8px rgba(0,0,0,0.04)'
              }}>
                <div style={{display:'flex',gap:'0.5rem',alignItems:'flex-start',marginBottom:'0.75rem'}}>
                  <span style={{
                    display:'inline-flex',alignItems:'center',justifyContent:'center',
                    width:'28px',height:'28px',borderRadius:'50%',fontSize:'0.8rem',fontWeight:700,flexShrink:0,
                    background: isCorrect ? '#dcfce7' : '#fee2e2',
                    color: isCorrect ? '#16a34a' : '#dc2626'
                  }}>{isCorrect ? '✓' : '✗'}</span>
                  <h3 style={{margin:0,fontSize:'1rem',color:'#1e293b',lineHeight:1.4}}>{q.text}</h3>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:'0.4rem'}}>
                  {q.options.map((opt, j) => {
                    const isStudentPick = j === selectedIdx;
                    const isCorrectAnswer = j === q.correctIndex;
                    let bg = 'transparent';
                    let border = '1px solid #e2e8f0';
                    let color = '#475569';
                    if (isCorrectAnswer) { bg = '#f0fdf4'; border = '2px solid #22c55e'; color = '#16a34a'; }
                    if (isStudentPick && !isCorrectAnswer) { bg = '#fef2f2'; border = '2px solid #ef4444'; color = '#dc2626'; }
                    return (
                      <div key={j} style={{padding:'0.5rem 0.75rem',borderRadius:'8px',background:bg,border,color,fontSize:'0.88rem',fontWeight: (isCorrectAnswer || isStudentPick) ? 600 : 400,display:'flex',alignItems:'center',gap:'0.5rem'}}>
                        {isCorrectAnswer && <span>✓</span>}
                        {isStudentPick && !isCorrectAnswer && <span>✗</span>}
                        <span>{opt}</span>
                        {isStudentPick && <span style={{marginLeft:'auto',fontSize:'0.72rem',opacity:0.7}}>Your answer</span>}
                        {isCorrectAnswer && <span style={{marginLeft:'auto',fontSize:'0.72rem',opacity:0.7}}>Correct</span>}
                      </div>
                    );
                  })}
                </div>
                {q.explanation && (
                  <div style={{marginTop:'0.6rem',padding:'0.5rem 0.75rem',background:'#f8fafc',borderRadius:'6px',fontSize:'0.8rem',color:'#64748b'}}>
                    💡 {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
          <button className="btn btn-secondary" style={{marginTop:'1rem'}} onClick={() => navigate(`/courses/${courseId}`)}>Back to Course</button>
        </div>
      </div>
    );
  }

  // Result Screen
  if (submitted && result) {
    return (
      <div className="quiz-wrapper">
        <div className="quiz-container">
          <div className="quiz-result">
            <div style={{fontSize:'3rem', marginBottom:'1rem'}}>{result.passed ? '🎉' : '😔'}</div>
            <h1>{result.passed ? 'Congratulations!' : 'Keep Trying!'}</h1>
            <p className="result-score">Score: {result.score}%</p>
            <p>{result.passed ? 'You passed the quiz!' : 'You did not meet the passing score.'}</p>
            <div style={{display:'flex',flexDirection:'column',gap:'0.5rem',marginTop:'1rem',alignItems:'center'}}>
              <button className="btn btn-primary" onClick={() => setShowReview(true)}>📋 Review Answers</button>
              {result.passed && (
                <button className="btn btn-primary" onClick={handleGenerateCert}>🎓 Generate Certificate</button>
              )}
              <button className="btn btn-secondary" onClick={() => navigate(`/courses/${courseId}`)}>Back to Course</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="quiz-wrapper">
      <div className="quiz-container">
        <div className="progress-header" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span className="progress-text">QUESTION {currentIndex + 1} OF {questions.length}</span>
          {timeLeft !== null && (
            <span style={{
              fontSize:'1rem',fontWeight:700,fontFamily:'monospace',
              color: timeLeft <= 60 ? '#dc2626' : timeLeft <= 300 ? '#f59e0b' : '#1e293b',
              padding:'0.35rem 0.75rem',borderRadius:'8px',
              background: timeLeft <= 60 ? '#fee2e2' : timeLeft <= 300 ? '#fef3c7' : '#f1f5f9',
              animation: timeLeft <= 30 ? 'pulse 1s infinite' : 'none'
            }}>
              ⏱ {formatTime(timeLeft)}
            </span>
          )}
        </div>
        <div className="progress-track"><div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div></div>
        <div className="question-card">
          <h2 className="question-text">{currentQuestion.text}</h2>
          <div className="options-list">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswers[currentIndex] === option;
              return (
                <label key={index} className={`option-container ${isSelected ? 'selected' : ''}`}>
                  <input type="radio" name={`question-${currentIndex}`} value={option} checked={isSelected} onChange={() => handleOptionSelect(option)} className="hidden-radio" />
                  <div className="custom-radio">{isSelected && <div className="custom-radio-dot"></div>}</div>
                  <span className="option-text">{option}</span>
                </label>
              );
            })}
          </div>
        </div>
        <div className="quiz-controls">
          <button className="btn btn-secondary" onClick={handlePrevious} disabled={currentIndex === 0}>Previous</button>
          <div className="right-controls">
            {currentIndex === questions.length - 1 ? (
              <button className="btn btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleNext}>Next</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttemptQuiz;
