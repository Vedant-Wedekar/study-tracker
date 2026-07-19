import { useState } from 'react';
import Modal from './Modal';
import { FieldLabel, TextInput } from './FormField';
import { addConcept } from '../utils/firestore';
import useAuth from '../hooks/useAuth';

const AddConceptModal = ({ open, onClose, subjectId }) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !name.trim()) return;
    setSaving(true);
    try {
      await addConcept(user.uid, subjectId, name);
      setName('');
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Concept">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <FieldLabel required>Concept Name</FieldLabel>
          <TextInput
            required
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Number Series"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-ink-900 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-ink-800 active:scale-[0.99] disabled:opacity-60"
        >
          {saving ? 'Adding…' : 'Add Concept'}
        </button>
      </form>
    </Modal>
  );
};

export default AddConceptModal;
