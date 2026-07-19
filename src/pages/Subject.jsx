import { useMemo, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiSearch, FiPlus, FiChevronRight, FiTrash2,
} from 'react-icons/fi';
import useSubjectConcepts from '../hooks/useSubjectConcepts';
import { getSubjectById } from '../utils/subjects';
import AccuracyBadge from '../components/AccuracyBadge';
import AddConceptModal from '../components/AddConceptModal';
import { SkeletonRow } from '../components/Skeletons';
import { relativeDay } from '../utils/dateHelpers';
import { deleteConcept } from '../utils/firestore';
import useAuth from '../hooks/useAuth';

const SORT_OPTIONS = [
  { value: 'recent', label: 'Recently Practiced' },
  { value: 'name', label: 'Name (A–Z)' },
  { value: 'accuracy', label: 'Accuracy' },
  { value: 'questions', label: 'Most Questions' },
];

const Subject = () => {
  const { subjectId } = useParams();
  const subject = getSubjectById(subjectId);
  const { user } = useAuth();
  const { concepts, loading } = useSubjectConcepts(subjectId);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [addOpen, setAddOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = useMemo(() => {
    let items = concepts.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
    items = [...items].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'accuracy':
          return (b.avgAccuracy || 0) - (a.avgAccuracy || 0);
        case 'questions':
          return (b.totalQuestions || 0) - (a.totalQuestions || 0);
        default:
          return (b.lastPracticed || '').localeCompare(a.lastPracticed || '');
      }
    });
    return items;
  }, [concepts, search, sortBy]);

  if (!subject) return <Navigate to="/" replace />;

  const Icon = subject.icon;

  const handleDelete = async (conceptId) => {
    if (!user) return;
    await deleteConcept(user.uid, conceptId);
    setConfirmDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${subject.gradient} text-white shadow-soft`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-ink-900">{subject.name}</h1>
          <p className="text-xs text-ink-400">{concepts.length} concept{concepts.length === 1 ? '' : 's'}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search concepts…"
            className="w-full rounded-xl border border-ink-200 bg-white py-2.5 pl-10 pr-3.5 text-sm outline-none transition placeholder:text-ink-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-700 outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-ink-800 active:scale-95"
          >
            <FiPlus className="h-4 w-4" />
            Add Concept
          </button>
        </div>
      </div>

      <div className="card-surface overflow-hidden rounded-xl2 shadow-soft">
        <div className="overflow-x-auto scrollbar-none">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink-100 bg-ink-50/60 text-xs font-semibold uppercase tracking-wide text-ink-400">
                <th className="px-4 py-3 w-12">#</th>
                <th className="px-4 py-3">Concept</th>
                <th className="px-4 py-3">Questions</th>
                <th className="px-4 py-3">Accuracy</th>
                <th className="px-4 py-3">Learning Time</th>
                <th className="px-4 py-3">Last Practiced</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-ink-400">
                    {search ? 'No concepts match your search.' : 'No concepts yet — add your first one.'}
                  </td>
                </tr>
              )}

              {!loading && filtered.map((concept, index) => (
                <motion.tr
                  key={concept.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b border-ink-100/70 transition hover:bg-ink-50/60"
                >
                  <td className="px-4 py-3.5 text-ink-400">{index + 1}</td>
                  <td className="px-4 py-3.5">
                    <Link to={`/subjects/${subjectId}/concepts/${concept.id}`} className="font-semibold text-ink-900 hover:text-brand-600">
                      {concept.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 text-ink-700">{concept.totalQuestions || 0}</td>
                  <td className="px-4 py-3.5">
                    {concept.totalQuestions > 0 ? (
                      <AccuracyBadge value={concept.avgAccuracy} size="sm" />
                    ) : (
                      <span className="text-ink-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-ink-700">
                    {concept.totalTime ? `${Math.round((concept.totalTime / 60) * 10) / 10} hr` : '—'}
                  </td>
                  <td className="px-4 py-3.5 text-ink-500">{relativeDay(concept.lastPracticed)}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        to={`/subjects/${subjectId}/concepts/${concept.id}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
                      >
                        <FiChevronRight className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(concept)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 transition hover:bg-rose-50 hover:text-rose-600"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddConceptModal open={addOpen} onClose={() => setAddOpen(false)} subjectId={subjectId} />

      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/40 backdrop-blur-sm p-4"
          onClick={() => setConfirmDelete(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-card"
          >
            <h3 className="text-base font-bold text-ink-900">Delete "{confirmDelete.name}"?</h3>
            <p className="mt-1.5 text-sm text-ink-500">This removes the concept and its entire practice history. This can't be undone.</p>
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
                onClick={() => handleDelete(confirmDelete.id)}
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

export default Subject;
