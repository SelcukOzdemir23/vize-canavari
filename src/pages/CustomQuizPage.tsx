import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/quizStore';

interface Question {
  id: number;
  kategori: string;
  zorluk: string;
  soruMetni: string;
  secenekler: string[];
  dogruCevapIndex: number;
  aciklama: string;
}

const CustomQuizPage = () => {
  const navigate = useNavigate();
  const { initializeQuiz } = useQuizStore();
  const [questions, setQuestions] = useState<Question[]>([]);

  // Get unique categories and difficulty levels from questions data
  const categories = [...new Set(questions.map((q: Question) => q.kategori))];
  const difficultyLevels = ['kolay', 'orta', 'zor'];

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
        setQuestions(data);
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
      filtered = filtered.filter((q: Question) => q.kategori === selectedCategory);
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
    <div className="custom-quiz-page">
      <div className="custom-quiz-container">
        <header className="custom-quiz-header">
          <span aria-hidden="true" className="custom-quiz-icon">⚙️</span>
          <h1>Özel Test Oluştur</h1>
          <p>İhtiyacına göre kategori, seviye ve soru sayısını seç.</p>
        </header>

        <div className="custom-quiz-badges">
          <span className="custom-quiz-badge">🎯 Odaklı çalışma</span>
          <span className="custom-quiz-badge">🧠 Spaced repetition dostu</span>
          <span className="custom-quiz-badge">⚡ 1 dakikada hazır</span>
        </div>

        <section className="custom-quiz-card">
          <div className="form-field">
            <label htmlFor="category" className="field-label">
              Kategori
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="field-input"
            >
              <option value="all">Tüm kategoriler</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="difficulty" className="field-label">
              Zorluk seviyesi
            </label>
            <select
              id="difficulty"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="field-input"
            >
              <option value="all">Tüm seviyeler</option>
              {difficultyLevels.map(level => (
                <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="questionCount" className="field-label">
              Soru sayısı <span className="field-hint">{Math.min(questionCount, sliderMax)}</span>
            </label>
            <input
              id="questionCount"
              type="range"
              min={sliderMin}
              max={sliderMax}
              value={Math.min(questionCount, sliderMax)}
              onChange={(e) => setQuestionCount(parseInt(e.target.value, 10))}
              className="range-input"
              disabled={!hasQuestions}
            />
            <div className="range-meta" aria-live="polite">
              <span>Min: {sliderMin}</span>
              <span>
                Maks: {maxQuestions || 0}
              </span>
            </div>
          </div>

          <p className="custom-quiz-summary" role="status">
            {hasQuestions ? (
              <>
                Filtreye uyan <span>{filteredQuestions.length}</span> soru içinden{' '}
                <span>{displayedQuestionCount}</span> adet seçilecektir.
              </>
            ) : (
              <>Seçilen filtre ile eşleşen soru bulunamadı.</>
            )}
          </p>

          <button
            type="button"
            onClick={handleStartQuiz}
            className="primary-action"
            disabled={!hasQuestions}
          >
            Testi Başlat
          </button>
        </section>
      </div>
    </div>
  );
};

export default CustomQuizPage;