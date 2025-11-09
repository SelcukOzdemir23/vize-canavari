# Spec: 01 - User Flows

This document outlines the primary user flows within the "Vize Canavarı" application.

## Flow 1: First-Time User - Standard Quiz

This is the most common flow for a new user. The goal is to get them into a quiz as quickly as possible.

```mermaid
graph TD
    A[User visits the site] --> B{localStorage empty?};
    B -->|Yes| C[Show Home Screen];
    C --> D[User clicks "Start Random Quiz"];
    D --> E[Navigate to /quiz/standard];
    E --> F[Quiz Page: Fetch all questions, shuffle them];
    F --> G[Display Question 1/20];
    G --> H{User selects an answer};
    H --> I[Provide immediate feedback (Correct/Incorrect) & Show Explanation];
    I --> J{Last question?};
    J -->|No| K[User clicks "Next"];
    K --> G;
    J -->|Yes| L[User clicks "Finish"];
    L --> M[Navigate to /results/standard];
    M --> N[Results Page: Show score, confetti, and summary];
    N --> O[Offer options: "Review Mistakes", "Try Again"];
```

## Flow 2: Returning User - Mistake Bank Practice

This flow is for a user who has previously taken a quiz and wants to focus on their weaknesses.

```mermaid
graph TD
    A[User visits the site] --> B{localStorage has 'mistakeBank' with items?};
    B -->|Yes| C[Home Screen: "Mistake Bank" button is active];
    C --> D[User clicks "Mistake Bank"];
    D --> E[Navigate to /quiz/mistake-bank];
    E --> F[Quiz Page: Fetch questions ONLY with IDs from 'mistakeBank'];
    F --> G[Display Question 1/N];
    G --> H{User selects an answer};
    H --> I[Provide feedback & explanation];
    I --> J{Answer correct?};
    J -->|Yes| K[Remove question ID from 'mistakeBank' in localStorage];
    J -->|No| L[Keep question ID in 'mistakeBank'];
    K --> M{Last question?};
    L --> M;
    M -->|No| N[User clicks "Next"];
    N --> G;
    M -->|Yes| O[User clicks "Finish"];
    O --> P[Navigate to /results/mistake-bank];
    P --> Q[Results Page: Show summary of corrected mistakes];
```

## Flow 3: User - Custom Quiz Creation

This flow allows the user to have full control over their practice session.

```mermaid
graph TD
    A[User visits Home Screen] --> B[Clicks "Create Custom Quiz"];
    B --> C[Show Custom Quiz Form];
    C -- User selects --> D{Categories: "ÖYT", "Gelişim"};
    C -- User selects --> E{Difficulty: "Hard"};
    C -- User selects --> F{Number of Questions: 15};
    G[User clicks "Start Quiz"] --> H[Navigate to /quiz/custom-123];
    H --> I[Quiz Page: Fetch questions matching selected criteria];
    I --> J[Display Question 1/15];
    J --> K[Continue standard quiz flow...];
```

## Flow 4: Returning User - Spaced Repetition (Smart Review)

This is an advanced flow for dedicated users, leveraging the spaced repetition algorithm.

```mermaid
graph TD
    A[User visits the site] --> B{localStorage has 'reviewSchedule' with items due today?};
    B -->|Yes| C[Home Screen: "Smart Review" button is active with a badge, e.g., "3 items to review!"];
    C --> D[User clicks "Smart Review"];
    D --> E[Navigate to /quiz/smart-review];
    E --> F[Quiz Page: Fetch questions whose IDs are due for review today];
    F --> G[Display Question 1/N];
    G --> H{User selects an answer};
    H --> I[Provide feedback & explanation];
    I --> J{Answer correct?};
    J -->|Yes| K[Update 'reviewSchedule' for this question ID: increase interval (e.g., from 1 day to 3 days)];
    J -->|No| L[Update 'reviewSchedule' for this question ID: reset interval (e.g., back to 1 day)];
    L --> M{Last question?};
    K --> M;
    M -->|No| N[User clicks "Next"];
    N --> G;
    M -->|Yes| O[User clicks "Finish"];
    O --> P[Navigate to /results/smart-review];
    P --> Q[Results Page: Show summary];
```
