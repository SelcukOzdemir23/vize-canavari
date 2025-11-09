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
      <div className="question-stem">
        {question.soruMetni}
      </div>
      <div className="options">
        {question.secenekler.map((option, index) => (
          <motion.button
            key={index}
            className={getOptionClass(index)}
            onClick={() => handleSelectAnswer(index)}
            disabled={isAnswered}
            whileHover={!isAnswered ? { x: 10 } : {}}
            whileTap={!isAnswered ? { scale: 0.98 } : {}}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <span className="option-icon">{getOptionIcon(index)}</span>
            <span className="option-text">{option}</span>
          </motion.button>
        ))}
      </div>
      {isAnswered && (
        <motion.div 
          className="explanation"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="explanation-header">Açıklama:</div>
          <div className="explanation-text">{question.aciklama}</div>
        </motion.div>
      )}

    </motion.div>
  );
};

export default QuestionCard;