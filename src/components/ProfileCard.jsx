import { motion } from 'framer-motion';
import { FiEdit2, FiTarget } from 'react-icons/fi';

const ProfileCard = ({ profile, onEdit }) => {
  const initials = (profile?.name || 'A')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="card-surface relative overflow-hidden rounded-xl2 p-6 shadow-soft"
    >
      <div className="absolute -right-10 -top-14 h-40 w-40 rounded-full bg-gradient-to-br from-brand-100 to-violet-100 blur-2xl" />
      <div className="relative flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          {profile?.photoURL ? (
            <img
              src={profile.photoURL}
              alt={profile.name}
              className="h-16 w-16 rounded-2xl object-cover shadow-soft ring-1 ring-black/5"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 text-lg font-bold text-white shadow-soft">
              {initials}
            </div>
          )}
          <div>
            <h2 className="text-lg font-bold text-ink-900">{profile?.name || 'Aspirant'}</h2>
            <p className="mt-0.5 max-w-md text-sm text-ink-500">
              {profile?.bio || 'Add a short bio to personalize your dashboard.'}
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
              <FiTarget className="h-3.5 w-3.5" />
              {profile?.targetExam || 'Set your target exam'}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ink-900 px-4 py-2 text-xs font-semibold text-white shadow-soft transition hover:bg-ink-800 active:scale-95"
        >
          <FiEdit2 className="h-3.5 w-3.5" />
          Edit Profile
        </button>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
