import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Question } from '../store/quizStore';

interface QuestionCardProps {
  question: Question;
  onAnswer: (questionId: string, selectedIndex: number) => void;
}

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

const difficultyStyles: Record<string, string> = {
  kolay: 'bg-success-400/20 text-success-500',
  orta: 'bg-accent-400/20 text-accent-500',
  zor: 'bg-danger-400/20 text-danger-500'
};

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

  const getOptionClasses = (index: number) => {
    const base = 'group relative flex w-full cursor-pointer items-center gap-4 rounded-2xl px-5 py-4 text-left transition-all duration-200 min-h-[52px]';
    const isSelected = index === selectedAnswerIndex;
    const isCorrect = index === question.dogruCevapIndex;

    if (!isAnswered) {
      return cx(
        base,
        'bg-bg-tertiary text-text-primary hover:bg-primary-500/10 hover:scale-[1.02]'
      );
    }

    if (isSelected && isCorrect) {
      return cx(base, 'bg-success-400/15 text-text-primary');
    }

    if (isSelected && !isCorrect) {
      return cx(base, 'bg-danger-400/15 text-danger-500');
    }

    if (!isSelected && isCorrect) {
      return cx(base, 'bg-success-400/15 text-text-primary');
    }

    return cx(base, 'bg-bg-tertiary/50 text-text-muted');
  };

  const getLetterClasses = (index: number) => {
    const isSelected = index === selectedAnswerIndex;
    const isCorrect = index === question.dogruCevapIndex;

    if (!isAnswered) {
      return 'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base font-bold transition-all bg-bg-secondary text-text-primary';
    }

    if (isSelected && isCorrect) {
      return 'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base font-bold transition-all bg-success-400 text-white';
    }

    if (isSelected && !isCorrect) {
      return 'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base font-bold transition-all bg-danger-400 text-white';
    }

    if (!isSelected && isCorrect) {
      return 'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base font-bold transition-all bg-success-400 text-white';
    }

    return 'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base font-bold transition-all bg-bg-secondary text-text-muted';
  };

  const getOptionIcon = (index: number) => {
    if (!isAnswered) return null;
    const isSelected = index === selectedAnswerIndex;
    const isCorrect = index === question.dogruCevapIndex;
    
    if (isSelected && isCorrect) return '✓';
    if (isSelected && !isCorrect) return '✗';
    if (!isSelected && isCorrect) return '✓';
    return null;
  };

  const getIconClasses = (index: number) => {
    const icon = getOptionIcon(index);
    if (!icon) return 'hidden';

    return icon === '✓'
      ? 'ml-auto text-lg font-semibold text-success-400 drop-shadow-[0_0_14px_rgba(34,197,94,0.35)]'
      : 'ml-auto text-lg font-semibold text-danger-400 drop-shadow-[0_0_14px_rgba(244,63,94,0.3)]';
  };

  return (
    <div className="flex h-full w-full flex-col">
      <motion.div
        className="flex flex-1 flex-col overflow-y-auto rounded-2xl bg-bg-secondary p-5 sm:p-7"
        style={{ boxShadow: 'var(--shadow-lg)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-wrap items-center gap-2">
          {question.id && (
            <span className="rounded-lg bg-primary-500/15 px-3 py-1.5 text-xs font-bold text-primary-500">
              📅 {question.id.split('_')[1]}. Hafta
            </span>
          )}
          <span className="rounded-lg bg-bg-tertiary px-3 py-1.5 text-xs font-semibold text-text-secondary">
            {question.konu || 'Genel'}
          </span>
          {difficultyKey && (
            <span
              className={cx(
                'rounded-lg px-3 py-1.5 text-xs font-bold',
                difficultyStyles[difficultyKey] || 'bg-bg-tertiary text-text-secondary'
              )}
            >
              {formatLabel(difficultyKey)}
            </span>
          )}
        </div>

        <div className="mt-5 text-left text-lg font-bold leading-relaxed text-text-primary sm:text-xl">
          {question.soruMetni}
        </div>

        <div className="mt-4 flex flex-col gap-2.5">
          {question.secenekler.map((option, index) => {
            const icon = getOptionIcon(index);
            return (
              <motion.button
                key={index}
                className={getOptionClasses(index)}
                onClick={() => handleSelectAnswer(index)}
                disabled={isAnswered}
                aria-pressed={selectedAnswerIndex === index}
                whileHover={!isAnswered ? { x: 10 } : {}}
                whileTap={!isAnswered ? { scale: 0.98 } : {}}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <span className={getLetterClasses(index)} aria-hidden="true">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1 text-left text-base font-medium leading-relaxed">
                  {option}
                </span>
                {icon && (
                  <span className={getIconClasses(index)} aria-hidden="true">
                    {icon}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {isAnswered && (
          <motion.div
            className="mt-4 rounded-2xl bg-bg-tertiary p-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-2 text-sm font-bold text-text-primary">
              <span>💡</span>
              <span>Açıklama</span>
            </div>
            <div className="mt-2 text-sm leading-relaxed text-text-secondary">
              {question.aciklama}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default QuestionCard;