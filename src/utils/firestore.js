import {
  collection, doc, addDoc, updateDoc, deleteDoc, getDoc, setDoc,
  onSnapshot, query, orderBy, where, serverTimestamp, getDocs, increment, limit,
} from 'firebase/firestore';
import { db } from '../firebase/config';

// ---------- Profile ----------

export const getUserProfileRef = (uid) => doc(db, 'users', uid);

export const ensureUserProfile = async (uid, defaults = {}) => {
  const ref = getUserProfileRef(uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      name: defaults.name || 'Aspirant',
      bio: '',
      targetExam: 'SBI PO',
      photoURL: defaults.photoURL || '',
      createdAt: serverTimestamp(),
      ...defaults,
    });
  }
  return ref;
};

export const updateUserProfile = (uid, data) => updateDoc(getUserProfileRef(uid), data);

export const subscribeUserProfile = (uid, callback) => onSnapshot(getUserProfileRef(uid), (snap) => {
  callback(snap.exists() ? { id: snap.id, ...snap.data() } : null);
});

// ---------- Concepts ----------

const conceptsCol = (uid) => collection(db, 'users', uid, 'concepts');
const conceptRef = (uid, conceptId) => doc(db, 'users', uid, 'concepts', conceptId);
const progressCol = (uid, conceptId) => collection(db, 'users', uid, 'concepts', conceptId, 'progress');

export const subscribeAllConcepts = (uid, callback) => {
  const q = query(conceptsCol(uid), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
};

export const subscribeSubjectConcepts = (uid, subjectId, callback) => {
  const q = query(conceptsCol(uid), where('subjectId', '==', subjectId));
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    items.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    callback(items);
  });
};

export const subscribeConcept = (uid, conceptId, callback) => onSnapshot(
  conceptRef(uid, conceptId),
  (snap) => callback(snap.exists() ? { id: snap.id, ...snap.data() } : null),
);

export const addConcept = (uid, subjectId, name) => addDoc(conceptsCol(uid), {
  subjectId,
  name: name.trim(),
  notes: '',
  revision: '',
  totalQuestions: 0,
  totalCorrect: 0,
  avgAccuracy: 0,
  totalTime: 0,
  sessionCount: 0,
  firstPracticed: null,
  lastPracticed: null,
  createdAt: serverTimestamp(),
});

export const deleteConcept = async (uid, conceptId) => {
  const progressSnap = await getDocs(progressCol(uid, conceptId));
  await Promise.all(progressSnap.docs.map((d) => deleteDoc(d.ref)));
  await deleteDoc(conceptRef(uid, conceptId));
};

export const updateConceptNotes = (uid, conceptId, field, value) => updateDoc(
  conceptRef(uid, conceptId),
  { [field]: value },
);

// ---------- Progress entries ----------

export const subscribeProgress = (uid, conceptId, callback) => {
  const q = query(progressCol(uid, conceptId), orderBy('date', 'desc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
};

// Recomputes and writes aggregate stats on the concept doc from its full progress history.
const recalculateConceptAggregates = async (uid, conceptId) => {
  const snap = await getDocs(progressCol(uid, conceptId));
  const entries = snap.docs.map((d) => d.data());

  if (entries.length === 0) {
    await updateDoc(conceptRef(uid, conceptId), {
      totalQuestions: 0, totalCorrect: 0, avgAccuracy: 0, totalTime: 0,
      sessionCount: 0, firstPracticed: null, lastPracticed: null,
    });
    return;
  }

  const totalQuestions = entries.reduce((sum, e) => sum + (Number(e.questionsSolved) || 0), 0);
  const totalCorrect = entries.reduce((sum, e) => sum + (Number(e.correctAnswers) || 0), 0);
  const totalTime = entries.reduce((sum, e) => sum + (Number(e.totalLearningTime) || 0), 0);
  const avgAccuracy = totalQuestions > 0
    ? Math.round((totalCorrect / totalQuestions) * 1000) / 10
    : 0;
  const dates = entries.map((e) => e.date).filter(Boolean).sort();

  await updateDoc(conceptRef(uid, conceptId), {
    totalQuestions,
    totalCorrect,
    avgAccuracy,
    totalTime,
    sessionCount: entries.length,
    firstPracticed: dates[0] || null,
    lastPracticed: dates[dates.length - 1] || null,
  });
};

export const addProgressEntry = async (uid, conceptId, data) => {
  const questionsSolved = Number(data.questionsSolved) || 0;
  const accuracy = Number(data.accuracy) || 0;
  const correctAnswers = data.correctAnswers !== '' && data.correctAnswers != null
    ? Number(data.correctAnswers)
    : Math.round((accuracy / 100) * questionsSolved);

  await addDoc(progressCol(uid, conceptId), {
    date: data.date,
    questionsSolved,
    correctAnswers,
    accuracy,
    avgTimePerQuestion: Number(data.avgTimePerQuestion) || 0,
    totalLearningTime: Number(data.totalLearningTime) || 0,
    remarks: data.remarks || '',
    createdAt: serverTimestamp(),
  });

  await recalculateConceptAggregates(uid, conceptId);
  await bumpActivityLog(uid, data.date, {
    questionsSolved,
    totalLearningTime: Number(data.totalLearningTime) || 0,
    sessions: 1,
  });
};

export const deleteProgressEntry = async (uid, conceptId, progressId) => {
  const ref = doc(db, 'users', uid, 'concepts', conceptId, 'progress', progressId);
  const snap = await getDoc(ref);
  const entry = snap.exists() ? snap.data() : null;
  await deleteDoc(ref);
  await recalculateConceptAggregates(uid, conceptId);
  if (entry?.date) {
    await bumpActivityLog(uid, entry.date, {
      questionsSolved: -(Number(entry.questionsSolved) || 0),
      totalLearningTime: -(Number(entry.totalLearningTime) || 0),
      sessions: -1,
    });
  }
};

// ---------- Activity log (per-day aggregate, powers dashboard charts + streak) ----------

const activityLogRef = (uid, date) => doc(db, 'users', uid, 'activityLog', date);

export const bumpActivityLog = (uid, date, delta) => setDoc(activityLogRef(uid, date), {
  date,
  questionsSolved: increment(delta.questionsSolved || 0),
  totalLearningTime: increment(delta.totalLearningTime || 0),
  sessions: increment(delta.sessions || 0),
}, { merge: true });

export const subscribeActivityLog = (uid, callback, days = 60) => {
  const q = query(collection(db, 'users', uid, 'activityLog'), orderBy('date', 'desc'), limit(days));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
};
