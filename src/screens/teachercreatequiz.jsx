import React from 'react';
import './stylesheets/teachercreatequiz.css';
import Navbar from '../components/navbar'

const BackArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const ConfigIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const ChevronUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const TeacherCreateQuiz = () => {
  return (
    <>
    <Navbar />
    <div className="create-quiz-container">
      <div className="background-gradient"></div>
      
      <div className="top-navigation">
        <div className="content-wrapper nav-wrapper">
          <button className="back-button">
            <BackArrowIcon />
            Back to Dashboard
          </button>
        </div>
      </div>

      <header className="page-header">
        <h1>Create New Quiz</h1>
        <p>Craft an engaging learning experience for your students with detailed assessments.</p>
        
        <div className="stepper">
          <div className="step active">
            <span className="step-circle">1</span>
            <span className="step-text">General Info</span>
          </div>
          <div className="step-line"></div>
          <div className="step inactive">
            <span className="step-circle">2</span>
            <span className="step-text">Questions</span>
          </div>
        </div>
      </header>

      <main className="content-wrapper">
        <section className="card config-card">
          <div className="card-header">
            <ConfigIcon />
            <h2>Quiz Configuration</h2>
          </div>
          <div className="input-grid">
            <div className="input-group">
              <label>Quiz Title</label>
              <input type="text" placeholder="e.g., Midterm Introduction to Biology" />
            </div>
            <div className="input-group">
              <label>Category</label>
              <select defaultValue="">
                <option value="" disabled hidden>Select a category</option>
                <option value="biology">Biology</option>
                <option value="math">Mathematics</option>
              </select>
            </div>
          </div>
        </section>

        <section className="card question-card">
          <div className="question-header">
            <span className="question-badge">Question 1</span>
            <div className="question-actions">
              <button className="icon-button"><TrashIcon /></button>
              <button className="icon-button"><ChevronUpIcon /></button>
            </div>
          </div>
          
          <hr className="divider" />

          <div className="input-group">
            <label>Question Text</label>
            <textarea placeholder="Enter your question here..."></textarea>
          </div>

          <div className="options-section">
            <div className="options-header">
              <CheckCircleIcon />
              <label>Select the correct answer</label>
            </div>
            
            <div className="options-list">
              {['A', 'B', 'C', 'D'].map((letter) => (
                <div className="option-input" key={letter}>
                  <input type="radio" name="correct-answer" id={`option-${letter}`} />
                  <input type="text" placeholder={`Add Option ${letter}...`} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <button className="add-question-button">
          <PlusIcon />
          Click to add another question
        </button>

        <div className="form-actions">
          <button className="discard-button">Discard Draft</button>
          <div className="right-actions">
            <button className="template-button">Save as Template</button>
            <button className="publish-button">Publish Quiz</button>
          </div>
        </div>
      </main>

      <footer className="page-footer">
        © 2024 EduWorkspace Learning Management System
      </footer>
    </div>
    </>
  );
};

export default TeacherCreateQuiz;
