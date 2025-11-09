import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuizStore } from '../store/quizStore';
import ProgressBar from '../components/ProgressBar';
import QuestionCard from '../components/QuestionCard';

const QuizPage = () => {
  const { mode } = useParams<{ mode: string }>();
  const navigate = useNavigate();
  const { 
    currentQuiz, 
    initializeQuiz, 
    addAnswer,
    userSession
  } = useQuizStore();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const autoNavigateTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Load questions based on mode
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch('/sorular.json');
        const allQuestions = await response.json();
        
        let questions = [];
        
        switch (mode) {
          case 'standard':
            // Shuffle and take first 20 questions
            questions = [...allQuestions]
              .sort(() => Math.random() - 0.5)
              .slice(0, 20);
            break;
            
          case 'mistake-bank':
            // Filter questions by mistake bank
            questions = allQuestions.filter(
              (q: any) => userSession.mistakeBank.includes(q.id)
            );
            break;
            
          case 'smart-review':
            // Filter questions by review schedule
            const today = new Date().toISOString().split('T')[0];
            const dueQuestionIds = Object.entries(userSession.reviewSchedule)
              .filter(([id, item]) => 
                new Date(item.dueDate).toISOString().split('T')[0] <= today
              )
              .map(([id]) => parseInt(id));
              
            questions = allQuestions.filter(
              (q: any) => dueQuestionIds.includes(q.id)
            );
            break;
            
          case 'custom':
            // For now, use all questions
            questions = allQuestions.slice(0, 10);
            break;
            
          default:
            questions = allQuestions.slice(0, 10);
        }
        
        initializeQuiz(questions, mode || 'standard');
      } catch (error) {
        console.error('Error loading questions:', error);
      }
    };
    
    if (!currentQuiz) {
      loadQuestions();
    }
  }, [mode, currentQuiz, initializeQuiz, userSession]);
  
  // Reset next button visibility when question changes
  useEffect(() => {
    setShowNextButton(false);
    
    // Clear any existing timeout
    if (autoNavigateTimeout.current) {
      clearTimeout(autoNavigateTimeout.current);
      autoNavigateTimeout.current = null;
    }
  }, [currentQuestionIndex]);
  
  const handleAnswer = (questionId: number, selectedIndex: number) => {
    addAnswer(questionId, selectedIndex);
    // Show next button immediately after answer
    setTimeout(() => {
      setShowNextButton(true);
    }, 300);
  };
  
  const handleNext = () => {
    if (!currentQuiz) return;
    
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Quiz finished
      navigate(`/results/${mode}`);
    }
  };
  
  // Auto-navigate to next question when progress bar fills
  useEffect(() => {
    if (showNextButton && nextButtonRef.current) {
      autoNavigateTimeout.current = setTimeout(() => {
        handleNext();
      }, 3000); // 3 seconds delay
    }
    
    return () => {
      if (autoNavigateTimeout.current) {
        clearTimeout(autoNavigateTimeout.current);
      }
    };
  }, [showNextButton]);
  
  if (!currentQuiz) {
    return (
      <div className="quiz-page">
        <div className="loading">Yükleniyor...</div>
      </div>
    );
  };
  
  const currentQuestion = currentQuiz.questions[currentQuestionIndex];
  
  return (
    <motion.div 
      className="quiz-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ProgressBar 
        current={currentQuestionIndex + 1} 
        total={currentQuiz.questions.length} 
      />
      
      <div className="question-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <QuestionCard 
              question={currentQuestion} 
              onAnswer={handleAnswer} 
            />
          </motion.div>
        </AnimatePresence>
      </div>
      
      <AnimatePresence>
        {showNextButton && (
          <motion.button 
            ref={nextButtonRef}
            className="next-button"
            onClick={handleNext}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            {currentQuestionIndex < currentQuiz.questions.length - 1 ? 'Sonraki Soru →' : 'Testi Bitir ✓'}
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default QuizPage;