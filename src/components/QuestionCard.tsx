import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Question } from '../store/quizStore';

interface QuestionCardProps {
  question: Question;
  onAnswer: (questionId: number, selectedIndex: number) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer }) => {
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const difficultyKey = question.zorluk?.toLowerCase?.() ?? '';
  const formatLabel = (value: string) => value ? value.charAt(0).toUpperCase() + value.slice(1) : '';

  const handleSelectAnswer = (index: number) => {
    if (isAnswered) return;
    
    setSelectedAnswerIndex(index);
    setIsAnswered(true);
    onAnswer(question.id, index);
  };

  const getOptionClass = (index: number) => {
    if (!isAnswered) {
      return 'option';
    }
    
    if (index === question.dogruCevapIndex) {
      return 'option correct';
    }
    
    if (index === selectedAnswerIndex && index !== question.dogruCevapIndex) {
      return 'option incorrect';
    }
    
    return 'option';
  };

  const getOptionIcon = (index: number) => {
    if (!isAnswered) return null;
    
    if (index === question.dogruCevapIndex) {
      return '✓';
    }
    
    if (index === selectedAnswerIndex && index !== question.dogruCevapIndex) {
      return '✗';
    }
    
    return null;
  };

  return (
    <motion.div 
      className="question-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="question-meta">
        <span className="question-tag category-tag">{question.kategori || 'Genel'}</span>
        {difficultyKey && (
          <span className={`question-tag difficulty-tag difficulty-${difficultyKey}`}>
            {formatLabel(difficultyKey)}
          </span>
        )}
      </div>
      <div className="question-stem">
        {question.soruMetni}
      </div>
      <div className="options">
        {question.secenekler.map((option, index) => {
          const optionIcon = getOptionIcon(index);
          return (
            <motion.button
              key={index}
              className={getOptionClass(index)}
              onClick={() => handleSelectAnswer(index)}
              disabled={isAnswered}
              aria-pressed={selectedAnswerIndex === index}
              whileHover={!isAnswered ? { x: 10 } : {}}
              whileTap={!isAnswered ? { scale: 0.98 } : {}}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <span className="option-letter" aria-hidden="true">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="option-text">{option}</span>
              {optionIcon && (
                <span className="option-status" aria-hidden="true">{optionIcon}</span>
              )}
            </motion.button>
          );
        })}
      </div>
      {isAnswered && (
        <motion.div 
          className="explanation"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="explanation-header">
            <span aria-hidden="true">🧠</span>
            <span>Açıklama</span>
          </div>
          <div className="explanation-text">{question.aciklama}</div>
        </motion.div>
      )}

    </motion.div>
  );
};

export default QuestionCard;