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
    // Get filtered and shuffled questions
    const questions = [...filteredQuestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, questionCount);

    // Initialize the quiz
    initializeQuiz(questions, 'custom');

    // Navigate to the quiz page
    navigate('/quiz/custom');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-8 text-gradient-primary">
        ⚙️ Özel Test Oluştur
      </h1>

      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 space-y-6 border border-white/50">
        <div className="space-y-2">
          <label htmlFor="category" className="block text-lg font-bold text-slate-800">
            📚 Kategori
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-base font-medium text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
          >
            <option value="all">Tüm Kategoriler</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="difficulty" className="block text-lg font-bold text-slate-800">
            🎯 Zorluk Seviyesi
          </label>
          <select
            id="difficulty"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-base font-medium text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
          >
            <option value="all">Tüm Seviyeler</option>
            {difficultyLevels.map(level => (
              <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="questionCount" className="block text-lg font-bold text-slate-800">
            🔢 Soru Sayısı: <span className="text-indigo-600">{questionCount}</span>
          </label>
          <input
            id="questionCount"
            type="range"
            min="5"
            max={maxQuestions}
            value={questionCount}
            onChange={(e) => setQuestionCount(parseInt(e.target.value))}
            className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-sm text-slate-600 font-medium">
            <span>5</span>
            <span>{maxQuestions} (maksimum)</span>
          </div>
        </div>

        <div className="pt-4 space-y-4">
          <p className="text-center text-base text-slate-600 bg-indigo-50 py-3 px-4 rounded-xl border border-indigo-100">
            Mevcut <strong className="text-indigo-600">{filteredQuestions.length}</strong> soru arasından <strong className="text-indigo-600">{questionCount}</strong> tanesi seçilecek
          </p>
          <button
            onClick={handleStartQuiz}
            className="w-full px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            🚀 Testi Başlat
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomQuizPage;