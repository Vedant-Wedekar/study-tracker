import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';
import AccuracyBadge from './AccuracyBadge';
import { relativeDay } from '../utils/dateHelpers';

const SubjectCard = ({ subject, stats, delay = 0 }) => {
  const Icon = subject.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
    >
      <Link
        to={`/subjects/${subject.id}`}
        className="card-surface group relative block overflow-hidden rounded-xl2 p-5 shadow-soft transition-shadow hover:shadow-card"
      >
        <div className="flex items-start justify-between">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${subject.gradient} text-white shadow-soft`}>
            <Icon className="h-5 w-5" />
          </div>
          <FiArrowUpRight className="h-4 w-4 text-ink-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink-600" />
        </div>

        <h3 className="mt-4 text-[15px] font-semibold text-ink-900">{subject.name}</h3>

        <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
          <div>
            <p className="text-ink-400">Concepts</p>
            <p className="font-semibold text-ink-800">{stats.totalConcepts}</p>
          </div>
          <div>
            <p className="text-ink-400">Questions</p>
            <p className="font-semibold text-ink-800">{stats.totalQuestions}</p>
          </div>
          <div>
            <p className="text-ink-400">Accuracy</p>
            {stats.totalQuestions > 0 ? (
              <AccuracyBadge value={stats.avgAccuracy} size="sm" />
            ) : (
              <span className="font-semibold text-ink-400">—</span>
            )}
          </div>
          <div>
            <p className="text-ink-400">Last practiced</p>
            <p className="font-semibold text-ink-800">{relativeDay(stats.lastPracticed)}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default SubjectCard;
