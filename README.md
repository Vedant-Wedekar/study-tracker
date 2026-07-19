# StudyTrack

A premium, Apple-inspired study tracker for competitive exam prep (SBI Clerk, SBI PO, IBPS, RRB, SSC, and similar). Track concepts, log practice sessions, and watch your accuracy and speed improve over time — all synced in real time with Firebase.

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- Framer Motion
- Firebase Authentication + Firestore
- Recharts
- React Router
- React Icons

## 1. Firebase Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Add a **Web App** to the project (the `</>` icon on the project overview page). Copy the config values shown.
3. Enable **Authentication → Sign-in method → Email/Password**.
4. Enable **Firestore Database** (start in production mode).
5. Open `firestore.rules` in this repo and publish it via **Firestore → Rules** in the console (or the Firebase CLI: `firebase deploy --only firestore:rules`). This ensures each user can only read/write their own data.

## 2. Local Setup

```bash
npm install
cp .env.example .env
```

Fill in `.env` with the values from your Firebase web app config:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Then run the dev server:

```bash
npm run dev
```

## 3. Deploying to Vercel

1. Push this project to a GitHub repo.
2. Import the repo in [Vercel](https://vercel.com/new).
3. Framework preset: **Vite** (auto-detected).
4. Add the same six `VITE_FIREBASE_*` variables under **Project Settings → Environment Variables**.
5. Deploy. `vercel.json` is already included so client-side routes (e.g. `/subjects/english`) resolve correctly on refresh.

## Project Structure

```
src/
  firebase/       Firebase app initialization
  context/        AuthContext (signup/login/logout, profile bootstrap)
  hooks/          Real-time Firestore subscription hooks
  components/     Reusable UI: cards, modals, badges, skeletons, charts/
  pages/          Login, Signup, Dashboard, Subject, ConceptDetails
  utils/          Firestore CRUD, streak calculation, accuracy colors, date helpers
```

## Data Model

```
users/{uid}
  name, bio, targetExam, photoURL

users/{uid}/concepts/{conceptId}
  subjectId, name, notes, revision
  totalQuestions, totalCorrect, avgAccuracy, totalTime,
  sessionCount, firstPracticed, lastPracticed

users/{uid}/concepts/{conceptId}/progress/{progressId}
  date, questionsSolved, correctAnswers, accuracy,
  avgTimePerQuestion, totalLearningTime, remarks

users/{uid}/activityLog/{YYYY-MM-DD}
  questionsSolved, totalLearningTime, sessions
```

Concept aggregates recalculate automatically from the full progress history whenever a session is added or deleted, so numbers never drift. The `activityLog` collection powers the weekly/monthly charts and streak calculation without needing an expensive collection-group query.

## Notes

- Accuracy color coding is centralized in `src/utils/accuracyColors.js` and used consistently across cards, tables, and charts (Green 90-100%, Light Green 75-89%, Yellow 60-74%, Orange 40-59%, Red below 40%).
- Study streak resets to zero if a day is missed, calculated from `activityLog` dates.
- Six subjects are fixed (Logical Reasoning, Quantitative Aptitude, English, General Awareness, Computer Awareness, Banking Awareness); concepts within each subject are unlimited and user-created.
