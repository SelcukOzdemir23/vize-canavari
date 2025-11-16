import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuizStore, type Question } from '../store/quizStore';
import { normalizeQuestionArray } from '../utils/normalizeQuestion';

const CustomQuizPage = () => {
  const navigate = useNavigate();
  const { initializeQuiz } = useQuizStore();
  const [questions, setQuestions] = useState<Question[]>([]);

  // Get unique categories and difficulty levels from questions data
  const categories = [...new Set(questions.map((q) => q.konu))];
  const difficultyLevels = ['Kolay', 'Orta', 'Zor'];

  // Form state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [questionCount, setQuestionCount] = useState<number>(10);

  // Load questions from JSON
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch('/sorular.json');
        const data = await response.json();
        setQuestions(normalizeQuestionArray(data));
      } catch (error) {
        console.error('Error loading questions:', error);
      }
    };

    loadQuestions();
  }, []);

  // Filter questions based on form selections
  const getFilteredQuestions = () => {
    let filtered = [...questions];
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((q) => q.konu === selectedCategory);
    }
    
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter((q: Question) => q.zorluk === selectedDifficulty);
    }
    
    return filtered;
  };

  const filteredQuestions = getFilteredQuestions();
  const maxQuestions = Math.min(filteredQuestions.length, 50);

  // Update question count if it exceeds max
  useEffect(() => {
    if (questionCount > maxQuestions) {
      setQuestionCount(maxQuestions || 10);
    }
  }, [filteredQuestions, questionCount, maxQuestions]);

  const handleStartQuiz = () => {
    if (!filteredQuestions.length) {
      return;
    }

    // Get filtered and shuffled questions
    const count = Math.min(questionCount, filteredQuestions.length);
    const questions = [...filteredQuestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, count);

    // Initialize the quiz
    initializeQuiz(questions, 'custom');

    // Navigate to the quiz page
    navigate('/quiz/custom');
  };

  const sliderMin = filteredQuestions.length > 0 ? Math.min(5, maxQuestions) : 5;
  const sliderMax = Math.max(maxQuestions, sliderMin);
  const hasQuestions = filteredQuestions.length > 0;
  const displayedQuestionCount = hasQuestions ? Math.min(questionCount, sliderMax) : 0;

  useEffect(() => {
    if (!hasQuestions) {
      setQuestionCount(10);
      return;
    }

    setQuestionCount(prev => {
      if (prev < sliderMin) return sliderMin;
      if (prev > sliderMax) return sliderMax;
      return prev;
    });
  }, [hasQuestions, sliderMin, sliderMax]);

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-y-auto rounded-2xl border border-white/10 bg-linear-to-br from-surface-900/95 to-surface-800/90 backdrop-blur-xl"
      style={{ boxShadow: 'var(--shadow-xl)' }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{ background: 'radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.12), transparent 70%)' }}
      />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center p-4 text-center sm:p-6">
        <header className="flex flex-col items-center gap-3">
          <motion.span 
            aria-hidden="true" 
            className="text-4xl"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            ⚙️
          </motion.span>
          <h1 className="bg-linear-to-r from-primary-400 to-secondary-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
            Özel Test Oluştur
          </h1>
          <p className="text-sm text-white/70">
            Kategori, seviye ve soru sayısını seç
          </p>
        </header>



        <section className="mt-6 w-full max-w-md space-y-4 rounded-xl border border-white/10 bg-linear-to-br from-surface-800/85 to-surface-700/75 p-4 text-left backdrop-blur-md">
          <div className="space-y-2">
            <label htmlFor="category" className="text-xs font-semibold text-white">
              📚 Kategori
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-surface-900/80 px-3 py-2.5 text-sm text-white transition-all focus:border-primary-400/50 focus:outline-none"
            >
              <option value="all">Tüm kategoriler</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="difficulty" className="text-xs font-semibold text-white">
              🎯 Zorluk
            </label>
            <select
              id="difficulty"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-surface-900/80 px-3 py-2.5 text-sm text-white transition-all focus:border-primary-400/50 focus:outline-none"
            >
              <option value="all">Tüm seviyeler</option>
              {difficultyLevels.map(level => (
                <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <label htmlFor="questionCount" className="flex items-center justify-between text-xs font-semibold text-white">
              <span>📊 Soru Sayısı</span>
              <span className="rounded-lg bg-primary-400/20 px-3 py-1 text-sm font-bold text-primary-400">
                {Math.min(questionCount, sliderMax)}
              </span>
            </label>
            <input
              id="questionCount"
              type="range"
              min={sliderMin}
              max={sliderMax}
              value={Math.min(questionCount, sliderMax)}
              onChange={(e) => setQuestionCount(parseInt(e.target.value, 10))}
              className="w-full accent-primary-400"
              disabled={!hasQuestions}
            />
            <div className="flex items-center justify-between text-xs text-white/60">
              <span>Min: {sliderMin}</span>
              <span>Maks: {maxQuestions || 0}</span>
            </div>
          </div>

          <div className="rounded-lg bg-surface-900/50 px-3 py-2.5" role="status">
            {hasQuestions ? (
              <p className="text-xs text-white/70">
                <span className="font-bold text-primary-400">{filteredQuestions.length}</span> soru içinden{' '}
                <span className="font-bold text-primary-400">{displayedQuestionCount}</span> seçilecek
              </p>
            ) : (
              <p className="text-xs text-danger-400">⚠️ Soru bulunamadı</p>
            )}
          </div>

          <motion.button
            type="button"
            onClick={handleStartQuiz}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-primary-400 to-secondary-400 py-3 text-sm font-bold text-white transition-all disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!hasQuestions}
            whileHover={hasQuestions ? { scale: 1.02 } : {}}
            whileTap={hasQuestions ? { scale: 0.98 } : {}}
          >
            <span>🚀</span>
            <span>Başlat</span>
          </motion.button>
        </section>
      </div>
    </div>
  );
};

export default CustomQuizPage;