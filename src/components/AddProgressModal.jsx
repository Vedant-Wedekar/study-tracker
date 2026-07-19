import { useEffect, useState } from 'react';
import Modal from './Modal';
import { FieldLabel, TextInput, TextArea } from './FormField';
import { addProgressEntry } from '../utils/firestore';
import useAuth from '../hooks/useAuth';
import { todayISO } from '../utils/dateHelpers';

const EMPTY = {
  date: todayISO(),
  questionsSolved: '',
  correctAnswers: '',
  accuracy: '',
  avgTimePerQuestion: '',
  totalLearningTime: '',
  remarks: '',
};

const AddProgressModal = ({ open, onClose, conceptId }) => {
  const { user } = useAuth();
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setForm(EMPTY);
  }, [open]);

  // Auto-calculate accuracy whenever questions solved / correct answers change,
  // unless the user is actively typing accuracy manually with no correct-answers value.
  useEffect(() => {
    const q = Number(form.questionsSolved);
    const c = Number(form.correctAnswers);
    if (q > 0 && form.correctAnswers !== '') {
      const computed = Math.round((c / q) * 1000) / 10;
      setForm((f) => (f.accuracy === String(computed) ? f : { ...f, accuracy: String(computed) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.questionsSolved, form.correctAnswers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !conceptId) return;
    setSaving(true);
    try {
      await addProgressEntry(user.uid, conceptId, form);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Progress" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel required>Date</FieldLabel>
            <TextInput
              type="date"
              required
              max={todayISO()}
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <div>
            <FieldLabel required>Questions Solved</FieldLabel>
            <TextInput
              type="number"
              min="0"
              required
              value={form.questionsSolved}
              onChange={(e) => setForm({ ...form, questionsSolved: e.target.value })}
              placeholder="20"
            />
          </div>
          <div>
            <FieldLabel>Correct Answers</FieldLabel>
            <TextInput
              type="number"
              min="0"
              value={form.correctAnswers}
              onChange={(e) => setForm({ ...form, correctAnswers: e.target.value })}
              placeholder="Optional"
            />
          </div>
          <div>
            <FieldLabel required>Accuracy (%)</FieldLabel>
            <TextInput
              type="number"
              min="0"
              max="100"
              step="0.1"
              required
              value={form.accuracy}
              onChange={(e) => setForm({ ...form, accuracy: e.target.value })}
              placeholder="85"
            />
          </div>
          <div>
            <FieldLabel>Avg Time / Question (sec)</FieldLabel>
            <TextInput
              type="number"
              min="0"
              value={form.avgTimePerQuestion}
              onChange={(e) => setForm({ ...form, avgTimePerQuestion: e.target.value })}
              placeholder="40"
            />
          </div>
          <div>
            <FieldLabel required>Total Learning Time (min)</FieldLabel>
            <TextInput
              type="number"
              min="0"
              required
              value={form.totalLearningTime}
              onChange={(e) => setForm({ ...form, totalLearningTime: e.target.value })}
              placeholder="30"
            />
          </div>
        </div>
        <div>
          <FieldLabel>Remarks</FieldLabel>
          <TextArea
            rows={2}
            value={form.remarks}
            onChange={(e) => setForm({ ...form, remarks: e.target.value })}
            placeholder="Anything worth remembering about this session"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-ink-900 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-ink-800 active:scale-[0.99] disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save Progress'}
        </button>
      </form>
    </Modal>
  );
};

export default AddProgressModal;
