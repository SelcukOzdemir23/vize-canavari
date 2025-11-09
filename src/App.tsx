import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import './index.css';

// Pages
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import CustomQuizPage from './pages/CustomQuizPage';

function App() {
  return (
    <Router>
      <div className="w-full min-h-screen flex flex-col">
        <main className="flex-1 flex flex-col w-full">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/quiz/:mode" element={<QuizPage />} />
              <Route path="/results/:mode" element={<ResultsPage />} />
              <Route path="/quiz/custom" element={<CustomQuizPage />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </Router>
  );
}

export default App;