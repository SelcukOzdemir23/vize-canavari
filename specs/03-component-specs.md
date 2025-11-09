# Spec: 03 - Component Specifications

This document details the specifications for the React components that will be built. It follows a "Design-First" approach, describing the visual appearance and behavior of each component before implementation.

## Component Hierarchy

```
App
├── Header
├── Router
│   ├── HomePage
│   │   ├── StreakIndicator
│   │   └── ModeButton
│   ├── QuizPage
│   │   ├── ProgressBar
│   │   └── QuestionCard
│   │       ├── QuestionStem
│   │       └── Option
│   ├── ResultsPage
│   │   ├── ScoreDonut
│   │   └── ResultSummary
│   └── ... (other pages)
└── Footer
```

---

## 1. `HomePage`

-   **Purpose:** The main entry point of the application. Greets the user and presents the available quiz modes.
-   **Route:** `/`
-   **Props:** None.
-   **State (from Zustand store):**
    -   `streak`: To display in the `StreakIndicator`.
    -   `mistakeBank`: To determine if the "Mistake Bank" button is active.
    -   `reviewSchedule`: To determine if the "Smart Review" button is active.
-   **Visual Design & Interactions:**
    -   A clean, welcoming layout with a prominent title like "Vize Canavarı".
    -   Displays the `StreakIndicator` at the top right: "🔥 5 Günlük Seri!".
    -   A vertical list of large, tappable `ModeButton` components.
    -   **Buttons:**
        -   "Rastgele Test" (Always enabled)
        -   "Yanlışlarım" (Enabled only if `mistakeBank.length > 0`. If disabled, it's grayed out with a lock icon).
        -   "Akıllı Tekrar" (Enabled only if there are items due for review. Shows a badge with the count).
        -   "Özel Test" (Always enabled).
    -   Each button has a subtle hover/press animation (scales up slightly).
    -   Clicking a button navigates the user to the corresponding quiz route.

---

## 2. `QuizPage`

-   **Purpose:** The main view for an active quiz session. It manages the flow of the current quiz.
-   **Route:** `/quiz/:mode` (e.g., `/quiz/standard`, `/quiz/mistake-bank`)
-   **Props:** None.
-   **State (from Zustand store & internal):**
    -   `quizQuestions`: An array of `Question` objects for the current quiz, fetched and filtered based on the mode.
    -   `currentQuestionIndex`: The index of the currently displayed question.
    -   `userAnswers`: An object to store the user's answers for this session.
-   **Visual Design & Interactions:**
    -   Displays the `ProgressBar` at the top.
    -   Displays a single `QuestionCard` component, centered.
    -   Uses `Framer Motion` for animations: when the user clicks "Next", the current `QuestionCard` slides out to the left, and the next one slides in from the right.
    -   A "Next" or "Finish" button is displayed below the `QuestionCard` after a question has been answered.

---

## 3. `QuestionCard`

-   **Purpose:** Displays a single question, its options, and handles the answer selection logic.
-   **Props:**
    -   `question: Question`: The full question object to display.
    -   `onAnswer: (questionId, selectedIndex) => void`: A callback function to be invoked when the user selects an answer.
-   **State (internal):**
    -   `selectedAnswerIndex: number | null`: The index of the option the user has selected.
    -   `isAnswered: boolean`: Becomes `true` once an answer is selected, to disable further clicks.
-   **Visual Design & Interactions:**
    -   A clean card with padding and a subtle box-shadow.
    -   The `soruMetni` is displayed prominently at the top.
    -   A list of `Option` components is displayed below.
    -   **Interaction Flow:**
        1.  The card is displayed with all options in their default state.
        2.  User hovers over an `Option`. The option background changes color slightly.
        3.  User clicks an `Option`.
        4.  The `onAnswer` callback is fired.
        5.  `isAnswered` becomes `true`. All options become disabled.
        6.  The selected option instantly changes color:
            -   If correct: Green background, with a ✔️ icon.
            -   If incorrect: Red background, with a ❌ icon.
        7.  Simultaneously, the correct option is highlighted with a green background.
        8.  The `aciklama` text fades in at the bottom of the card.

---

## 4. `ProgressBar`

-   **Purpose:** To provide visual feedback on the user's progress through the current quiz.
-   **Props:**
    -   `current: number`: The current question number.
    -   `total: number`: The total number of questions in the quiz.
-   **State:** None.
-   **Visual Design & Interactions:**
    -   A thin bar at the top of the `QuizPage`.
    -   The background of the bar is a light gray.
    -   A colored fill (e.g., a blue gradient) animates its width from left to right as the user progresses. The width is calculated as `(current / total) * 100%`.
    -   A text label "Soru: 5 / 20" is displayed on or near the bar.

---

## 5. `ResultsPage`

-   **Purpose:** To display the user's performance after completing a quiz and provide next steps.
-   **Route:** `/results/:mode`
-   **Props:** None.
-   **State (from Zustand store & route):**
    -   Needs to access the answers for the just-completed quiz to calculate the score.
-   **Visual Design & Interactions:**
    -   A celebratory and encouraging tone.
    -   If the score is > 70%, `react-confetti` is triggered on page load.
    -   A large, animated `ScoreDonut` component is the centerpiece, showing the percentage score (e.g., "85%").
    -   A summary text: "Harika iş! 20 sorudan 17 tanesini doğru bildin."
    -   A list of `ModeButton`s for next actions: "Yanlışları Tekrar Et", "Yeni Rastgele Test", "Ana Menü".
