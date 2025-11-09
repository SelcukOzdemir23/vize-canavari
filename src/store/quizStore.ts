import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define the Question type
export interface Question {
  id: number;
  kategori: string;
  zorluk: string;
  soruMetni: string;
  secenekler: string[];
  dogruCevapIndex: number;
  aciklama: string;
}

// Types for our state
interface ReviewItem {
  level: number;
  dueDate: string;
  lastReviewed: string;
}

interface Streak {
  count: number;
  lastStudiedDate: string;
}

interface UserSession {
  mistakeBank: number[];
  reviewSchedule: Record<string, ReviewItem>;
  streak: Streak;
  settings: {
    theme: string;
    showExplanationImmediately: boolean;
  };
}

interface QuizState {
  // User session data
  userSession: UserSession;

  // Current quiz data
  currentQuiz: {
    questions: Question[];
    mode: string;
    userAnswers: Record<number, number>;
  } | null;

  // Actions
  initializeQuiz: (questions: Question[], mode: string) => void;
  addAnswer: (questionId: number, selectedIndex: number) => void;
  finishQuiz: () => void;

  // Mistake bank actions
  addToMistakeBank: (questionId: number) => void;
  removeFromMistakeBank: (questionId: number) => void;

  // Review schedule actions
  updateReviewSchedule: (questionId: number, isCorrect: boolean) => void;

  // Streak actions
  updateStreak: () => void;

  // Settings actions
  updateSettings: (settings: Partial<UserSession['settings']>) => void;
  
  // Get questions for review
  getDueQuestions: () => number[];
}

// Calculate spaced repetition interval with more effective algorithm
const calculateNextReview = (level: number, isCorrect: boolean): ReviewItem => {
  // More effective intervals based on research:
  // 1. 1 day
  // 2. 3 days
  // 3. 7 days
  // 4. 14 days
  // 5. 30 days
  // 6. 60 days
  // 7. 120 days
  // 8. 240 days
  
  let days: number;
  if (isCorrect) {
    // Increase interval when correct
    const intervals = [1, 3, 7, 14, 30, 60, 120, 240];
    days = intervals[Math.min(level, intervals.length - 1)];
  } else {
    // Reduce interval when incorrect, but not to zero
    days = 1;
  }

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + days);

  return {
    level: isCorrect ? level + 1 : Math.max(1, level - 1),
    dueDate: dueDate.toISOString(),
    lastReviewed: new Date().toISOString()
  };
};

// Get today's date in YYYY-MM-DD format
const getToday = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Default user session
const defaultUserSession: UserSession = {
  mistakeBank: [],
  reviewSchedule: {},
  streak: {
    count: 0,
    lastStudiedDate: ''
  },
  settings: {
    theme: 'light',
    showExplanationImmediately: true
  }
};

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      // Initial state
      userSession: defaultUserSession,
      currentQuiz: null,

      // Initialize a new quiz
      initializeQuiz: (questions, mode) => {
        set({
          currentQuiz: {
            questions,
            mode,
            userAnswers: {}
          }
        });
      },

      // Add an answer to the current quiz
      addAnswer: (questionId, selectedIndex) => {
        const { currentQuiz, userSession } = get();
        if (!currentQuiz) return;

        // Find the question to check if answer is correct
        const question = currentQuiz.questions.find(q => q.id === questionId);
        if (!question) return;

        const isCorrect = selectedIndex === question.dogruCevapIndex;

        // Update user answers
        set({
          currentQuiz: {
            ...currentQuiz,
            userAnswers: {
              ...currentQuiz.userAnswers,
              [questionId]: selectedIndex
            }
          }
        });

        // Update mistake bank if answer is incorrect
        if (!isCorrect) {
          // Add to mistake bank if not already there
          if (!userSession.mistakeBank.includes(questionId)) {
            set({
              userSession: {
                ...userSession,
                mistakeBank: [...userSession.mistakeBank, questionId]
              }
            });
          }
        }

        // Update review schedule
        get().updateReviewSchedule(questionId, isCorrect);
      },

      // Finish the current quiz
      finishQuiz: () => {
        // Update streak
        get().updateStreak();

        // Clear current quiz
        set({ currentQuiz: null });
      },

      // Add question to mistake bank
      addToMistakeBank: (questionId) => {
        const { userSession } = get();
        if (!userSession.mistakeBank.includes(questionId)) {
          set({
            userSession: {
              ...userSession,
              mistakeBank: [...userSession.mistakeBank, questionId]
            }
          });
        }
      },

      // Remove question from mistake bank
      removeFromMistakeBank: (questionId) => {
        const { userSession } = get();
        set({
          userSession: {
            ...userSession,
            mistakeBank: userSession.mistakeBank.filter(id => id !== questionId)
          }
        });
      },

      // Update review schedule for spaced repetition
      updateReviewSchedule: (questionId, isCorrect) => {
        const { userSession } = get();
        const currentReview = userSession.reviewSchedule[questionId];

        // Calculate new review schedule
        const newReview = calculateNextReview(
          currentReview ? currentReview.level : 1, 
          isCorrect
        );

        set({
          userSession: {
            ...userSession,
            reviewSchedule: {
              ...userSession.reviewSchedule,
              [questionId]: newReview
            }
          }
        });
      },

      // Update streak
      updateStreak: () => {
        const { userSession } = get();
        const today = getToday();
        const lastStudiedDate = userSession.streak.lastStudiedDate;

        let newCount = userSession.streak.count;

        // If last studied date is yesterday, increment streak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (lastStudiedDate === yesterdayStr) {
          newCount += 1;
        } 
        // If last studied date is not today, reset to 1
        else if (lastStudiedDate !== today) {
          newCount = 1;
        }

        set({
          userSession: {
            ...userSession,
            streak: {
              count: newCount,
              lastStudiedDate: today
            }
          }
        });
      },

      // Update settings
      updateSettings: (newSettings) => {
        const { userSession } = get();
        set({
          userSession: {
            ...userSession,
            settings: {
              ...userSession.settings,
              ...newSettings
            }
          }
        });
      },
      
      // Get questions that are due for review
      getDueQuestions: () => {
        const { userSession } = get();
        const today = new Date().toISOString().split('T')[0];
        
        return Object.entries(userSession.reviewSchedule)
          .filter(([id, item]) => 
            new Date(item.dueDate).toISOString().split('T')[0] <= today
          )
          .map(([id]) => parseInt(id));
      }
    }),
    {
      name: 'vizeCanavariSession', // name of the item in localStorage
      storage: createJSONStorage(() => localStorage),
      // Only persist the user session, not the current quiz
      partialize: (state) => ({ userSession: state.userSession }),
    }
  )
);