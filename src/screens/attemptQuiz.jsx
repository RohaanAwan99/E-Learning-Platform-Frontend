import React, { useState } from 'react';
import './stylesheets/attemptQuiz.css';

const quizData = [
  {
    id: 1,
    topic: "Data Structures & Algorithms",
    question: "What is the time complexity of accessing an element in an array by index?",
    options: ["O(n)", "O(log n)", "O(1)", "O(n^2)"]
  },
  {
    id: 2,
    topic: "Data Structures & Algorithms",
    question: "What is the time complexity of searching for an element in a balanced binary search tree?",
    options: ["O(n)", "O(log n)", "O(1)", "O(n^2)"]
  },
  {
    id: 3,
    topic: "Data Structures & Algorithms",
    question: "Which sorting algorithm has the best worst-case time complexity?",
    options: ["Quick Sort", "Merge Sort", "Bubble Sort", "Insertion Sort"]
  }
];

const AttemptQuiz = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const totalQuestions = 10;
  const currentQuestion = quizData[currentIndex];

  const handleOptionSelect = (option) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentIndex]: option
    });
  };

  const handleNext = () => {
    if (currentIndex < quizData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleEndQuiz = () => {
    console.log("Quiz Ended. Final Answers: ", selectedAnswers);
    alert("Quiz submitted!");
  };

  const progressPercentage = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <div className="quiz-wrapper">
      <div className="quiz-container">
        <div className="progress-header">
          <span className="progress-text">
            QUESTION {currentIndex + 1} OF {totalQuestions}
          </span>
        </div>
        
        <div className="progress-track">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        <h1 className="topic-title">{currentQuestion.topic}</h1>

        <div className="question-card">
          <h2 className="question-text">{currentQuestion.question}</h2>
          
          <div className="options-list">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswers[currentIndex] === option;
              
              return (
                <label 
                  key={index} 
                  className={`option-container ${isSelected ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name={`question-${currentIndex}`}
                    value={option}
                    checked={isSelected}
                    onChange={() => handleOptionSelect(option)}
                    className="hidden-radio"
                  />
                  <div className="custom-radio">
                    {isSelected && <div className="custom-radio-dot"></div>}
                  </div>
                  <span className="option-text">{option}</span>
                </label>
              );
            })}
          </div>
        </div>
        <div className="quiz-controls">
          <button 
            className="btn btn-secondary" 
            onClick={handlePrevious} 
            disabled={currentIndex === 0}
          >
            Previous
          </button>
          
          <div className="right-controls">
            <button className="btn btn-danger" onClick={handleEndQuiz}>
              End Quiz
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleNext} 
              disabled={currentIndex === quizData.length - 1}
            >
              Next
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AttemptQuiz;