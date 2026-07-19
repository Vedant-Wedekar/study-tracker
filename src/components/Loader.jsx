import { motion } from 'framer-motion';
import { FiTarget } from 'react-icons/fi';

const Loader = ({ label = 'Loading your progress' }) => (
  <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#f7f8fa]">
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 shadow-glow"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
      >
        <FiTarget className="h-7 w-7 text-white" />
      </motion.div>
    </motion.div>
    <motion.p
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="mt-5 text-sm font-medium text-ink-500"
    >
      {label}…
    </motion.p>
    <div className="mt-4 h-1 w-32 overflow-hidden rounded-full bg-ink-100">
      <motion.div
        className="h-full w-1/3 rounded-full bg-gradient-to-r from-brand-500 to-violet-500"
        animate={{ x: ['-100%', '250%'] }}
        transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  </div>
);

export default Loader;
