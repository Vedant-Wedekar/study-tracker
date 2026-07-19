import { motion } from 'framer-motion';
import { FiZap } from 'react-icons/fi';

const StreakBadge = ({ streak }) => {
  const active = streak > 0;
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold shadow-soft ring-1 ${
        active
          ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white ring-orange-200'
          : 'bg-ink-100 text-ink-500 ring-ink-200'
      }`}
    >
      <FiZap className={active ? 'h-4 w-4' : 'h-4 w-4 opacity-60'} />
      {streak} day{streak === 1 ? '' : 's'} streak
    </motion.div>
  );
};

export default StreakBadge;
