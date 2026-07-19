import { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiChevronLeft, FiPlus, FiTrash2, FiSave, FiHelpCircle,
  FiTarget, FiClock, FiHash, FiCalendar,
} from 'react-icons/fi';
import useConcept from '../hooks/useConcept';
import useProgress from '../hooks/useProgress';
import useAuth from '../hooks/useAuth';
import { getSubjectById } from '../utils/subjects';
import { formatDate } from '../utils/dateHelpers';
import AccuracyBadge from '../components/AccuracyBadge';
import StatCard from '../components/StatCard';
import AddProgressModal from '../components/AddProgressModal';
import AccuracyLineChart from '../components/charts/AccuracyLineChart';
import QuestionsOverTimeChart from '../components/charts/QuestionsOverTimeChart';
import { SkeletonCard, SkeletonRow } from '../components/Skeletons';
import { TextArea, FieldLabel } from '../components/FormField';
import { deleteProgressEntry, updateConceptNotes } from '../utils/firestore';

const ConceptDetails = () => {
  const { subjectId, conceptId } = useParams();
  const { user } = useAuth();
  const subject = getSubjectById(subjectId);
  const { concept, loading: conceptLoading } = useConcept(conceptId);
  const { entries, loading: entriesLoading } = useProgress(conceptId);
  const [addOpen, setAddOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [notes, setNotes] = useState('');
  const [revision, setRevision] = useState('');
  const [savingField, setSavingField] = useState(null);

  useEffect(() => {
    if (concept) {
      setNotes(concept.notes || '');
      setRevision(concept.revision || '');
    }
  }, [concept]);

  if (!subject) return <Navigate to="/" replace />;

  const handleDeleteEntry = async (entryId) => {
    if (!user) return;
    await deleteProgressEntry(user.uid, conceptId, entryId);
    setConfirmDelete(null);
  };

  const saveField = async (field, value) => {
    if (!user) return;
    setSavingField(field);
    try {
      await updateConceptNotes(user.uid, conceptId, field, value);
    } finally {
      setSavingField(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          to={`/subjects/${subjectId}`}
          className="mb-3 inline-flex items-center gap-1 text-xs font-semibold text-ink-400 transition hover:text-ink-700"
        >
          <FiChevronLeft className="h-3.5 w-3.5" />
          {subject.name}
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-bold text-ink-900">{conceptLoading ? '…' : concept?.name}</h1>
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-ink-800 active:scale-95"
          >
            <FiPlus className="h-4 w-4" />
            Add Progress
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {conceptLoading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard label="Total Questions" value={concept?.totalQuestions || 0} icon={FiHelpCircle} accent="brand" />
            <StatCard label="Avg. Accuracy" value={`${concept?.avgAccuracy || 0}%`} icon={FiTarget} accent="emerald" delay={0.04} />
            <StatCard
              label="Study Time"
              value={concept?.totalTime ? `${Math.round((concept.totalTime / 60) * 10) / 10} hr` : '0 hr'}
              icon={FiClock}
              accent="amber"
              delay={0.08}
            />
            <StatCard label="Sessions" value={concept?.sessionCount || 0} icon={FiHash} accent="violet" delay={0.12} />
            <StatCard label="First Practiced" value={formatDate(concept?.firstPracticed, 'dd MMM')} icon={FiCalendar} accent="cyan" delay={0.16} />
            <StatCard label="Last Practiced" value={formatDate(concept?.lastPracticed, 'dd MMM')} icon={FiCalendar} accent="rose" delay={0.2} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AccuracyLineChart entries={entries} />
        <QuestionsOverTimeChart entries={entries} delay={0.05} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card-surface rounded-xl2 p-5 shadow-soft">
          <div className="mb-2 flex items-center justify-between">
            <FieldLabel>Notes</FieldLabel>
            <button
              type="button"
              onClick={() => saveField('notes', notes)}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-brand-600 transition hover:bg-brand-50"
            >
              <FiSave className="h-3.5 w-3.5" />
              {savingField === 'notes' ? 'Saving…' : 'Save'}
            </button>
          </div>
          <TextArea
            rows={6}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Key formulas, shortcuts, and things to remember…"
          />
        </div>
        <div className="card-surface rounded-xl2 p-5 shadow-soft">
          <div className="mb-2 flex items-center justify-between">
            <FieldLabel>Revision</FieldLabel>
            <button
              type="button"
              onClick={() => saveField('revision', revision)}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-brand-600 transition hover:bg-brand-50"
            >
              <FiSave className="h-3.5 w-3.5" />
              {savingField === 'revision' ? 'Saving…' : 'Save'}
            </button>
          </div>
          <TextArea
            rows={6}
            value={revision}
            onChange={(e) => setRevision(e.target.value)}
            placeholder="Mistakes to avoid, tricky question types, revision points…"
          />
        </div>
      </div>

      <div className="card-surface overflow-hidden rounded-xl2 shadow-soft">
        <div className="border-b border-ink-100 px-5 py-4">
          <h3 className="text-sm font-bold text-ink-900">Practice Timeline</h3>
          <p className="mt-0.5 text-xs text-ink-400">Every session, newest first</p>
        </div>
        <div className="overflow-x-auto scrollbar-none">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink-100 bg-ink-50/60 text-xs font-semibold uppercase tracking-wide text-ink-400">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Questions</th>
                <th className="px-4 py-3">Accuracy</th>
                <th className="px-4 py-3">Time / Question</th>
                <th className="px-4 py-3">Learning Time</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entriesLoading && Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)}

              {!entriesLoading && entries.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-ink-400">
                    No sessions logged yet — add your first practice entry.
                  </td>
                </tr>
              )}

              {!entriesLoading && entries.map((entry, index) => (
                <motion.tr
                  key={entry.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className="border-b border-ink-100/70 transition hover:bg-ink-50/60"
                >
                  <td className="px-4 py-3.5 font-medium text-ink-800">{formatDate(entry.date)}</td>
                  <td className="px-4 py-3.5 text-ink-700">{entry.questionsSolved}</td>
                  <td className="px-4 py-3.5"><AccuracyBadge value={entry.accuracy} size="sm" /></td>
                  <td className="px-4 py-3.5 text-ink-500">{entry.avgTimePerQuestion ? `${entry.avgTimePerQuestion}s` : '—'}</td>
                  <td className="px-4 py-3.5 text-ink-500">{entry.totalLearningTime ? `${entry.totalLearningTime} min` : '—'}</td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(entry)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 transition hover:bg-rose-50 hover:text-rose-600"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddProgressModal open={addOpen} onClose={() => setAddOpen(false)} conceptId={conceptId} />

      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/40 backdrop-blur-sm p-4"
          onClick={() => setConfirmDelete(null)}
        >
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-card">
            <h3 className="text-base font-bold text-ink-900">Delete this session?</h3>
            <p className="mt-1.5 text-sm text-ink-500">
              This removes the entry from {formatDate(confirmDelete.date)} and recalculates your stats.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="flex-1 rounded-xl border border-ink-200 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-ink-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteEntry(confirmDelete.id)}
                className="flex-1 rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConceptDetails;
