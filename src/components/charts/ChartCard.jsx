import { motion } from 'framer-motion';

const ChartCard = ({ title, subtitle, children, delay = 0, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    className="card-surface rounded-xl2 p-5 shadow-soft"
  >
    <div className="mb-4 flex items-center justify-between">
      <div>
        <h3 className="text-sm font-bold text-ink-900">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-ink-400">{subtitle}</p>}
      </div>
      {action}
    </div>
    {children}
  </motion.div>
);

export default ChartCard;
