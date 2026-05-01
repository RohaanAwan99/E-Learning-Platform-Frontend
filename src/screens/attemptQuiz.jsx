import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api/axios';
import './stylesheets/attemptQuiz.css';

const AttemptQuiz = () => {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [quizId, setQuizId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // The quiz endpoint returns { data: quiz } with populated questions
        const quizRes = await API.get(`/courses/${courseId}/modules/${moduleId}/quiz`);
        const quiz = quizRes.data.data;
        setQuizId(quiz._id);

        // Questions are already populated in the quiz response
        if (quiz.questions && quiz.questions.length > 0 && typeof quiz.questions[0] === 'object') {
          setQuestions(quiz.questions);
        } else {
          // Fallback: fetch questions separately if not populated
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

  const handleOptionSelect = (option) => {
    setSelectedAnswers({ ...selectedAnswers, [currentIndex]: option });
  };
  const handleNext = () => { if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1); };
  const handlePrevious = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1); };

  const handleSubmit = async () => {
    const answers = questions.map((q, i) => ({
      questionId: q._id,
      selectedIndex: q.options.indexOf(selectedAnswers[i]) >= 0 ? q.options.indexOf(selectedAnswers[i]) : 0,
    }));
    try {
      const { data } = await API.post('/attempts', { quizId, answers });
      setResult(data.data);
      setSubmitted(true);
      toast.success(`Score: ${data.data.score}% — ${data.data.passed ? 'Passed!' : 'Try again'}`);
    } catch (err) { toast.error(err.response?.data?.message || 'Submission failed'); }
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

  if (submitted && result) {
    return (
      <div className="quiz-wrapper">
        <div className="quiz-container">
          <div className="quiz-result">
            <div style={{fontSize:'3rem', marginBottom:'1rem'}}>{result.passed ? '🎉' : '😔'}</div>
            <h1>{result.passed ? 'Congratulations!' : 'Keep Trying!'}</h1>
            <p className="result-score">Score: {result.score}%</p>
            <p>{result.passed ? 'You passed the quiz!' : 'You did not meet the passing score.'}</p>
            {result.passed && (
              <button className="btn btn-primary" style={{marginTop:'1rem'}} onClick={handleGenerateCert}>🏆 Generate Certificate</button>
            )}
            <button className="btn btn-secondary" style={{marginTop:'0.5rem'}} onClick={() => navigate(`/courses/${courseId}`)}>Back to Course</button>
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
        <div className="progress-header">
          <span className="progress-text">QUESTION {currentIndex + 1} OF {questions.length}</span>
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
              <button className="btn btn-primary" onClick={handleSubmit}>Submit Quiz</button>
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