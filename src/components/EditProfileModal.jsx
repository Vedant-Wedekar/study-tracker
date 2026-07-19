import { useEffect, useState } from 'react';
import Modal from './Modal';
import { FieldLabel, TextInput, TextArea } from './FormField';
import { updateUserProfile } from '../utils/firestore';
import useAuth from '../hooks/useAuth';

const EditProfileModal = ({ open, onClose, profile }) => {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', bio: '', targetExam: '', photoURL: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || '',
        bio: profile.bio || '',
        targetExam: profile.targetExam || '',
        photoURL: profile.photoURL || '',
      });
    }
  }, [profile, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await updateUserProfile(user.uid, form);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Profile">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <FieldLabel required>Name</FieldLabel>
          <TextInput
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your name"
          />
        </div>
        <div>
          <FieldLabel>Bio</FieldLabel>
          <TextArea
            rows={2}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="A short line about your prep journey"
          />
        </div>
        <div>
          <FieldLabel>Target Exam</FieldLabel>
          <TextInput
            value={form.targetExam}
            onChange={(e) => setForm({ ...form, targetExam: e.target.value })}
            placeholder="e.g. SBI PO 2026"
          />
        </div>
        <div>
          <FieldLabel>Profile Picture URL</FieldLabel>
          <TextInput
            value={form.photoURL}
            onChange={(e) => setForm({ ...form, photoURL: e.target.value })}
            placeholder="https://…"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="mt-2 w-full rounded-xl bg-ink-900 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-ink-800 active:scale-[0.99] disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </Modal>
  );
};

export default EditProfileModal;
