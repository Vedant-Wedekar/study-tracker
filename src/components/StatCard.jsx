import { motion } from 'framer-motion';

// Static class lookups — Tailwind's JIT scanner needs full literal class names,
// so accent colors are resolved through this map rather than template strings.
const ACCENTS = {
  brand: { glow: 'bg-brand-100', iconBg: 'bg-brand-50', iconText: 'text-brand-600' },
  emerald: { glow: 'bg-emerald-100', iconBg: 'bg-emerald-50', iconText: 'text-emerald-600' },
  amber: { glow: 'bg-amber-100', iconBg: 'bg-amber-50', iconText: 'text-amber-600' },
  violet: { glow: 'bg-violet-100', iconBg: 'bg-violet-50', iconText: 'text-violet-600' },
  rose: { glow: 'bg-rose-100', iconBg: 'bg-rose-50', iconText: 'text-rose-600' },
  cyan: { glow: 'bg-cyan-100', iconBg: 'bg-cyan-50', iconText: 'text-cyan-600' },
};

const StatCard = ({ label, value, icon: Icon, accent = 'brand', delay = 0 }) => {
  const colors = ACCENTS[accent] || ACCENTS.brand;
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className="card-surface group relative overflow-hidden rounded-xl2 p-5 shadow-soft transition-shadow hover:shadow-card"
    >
      <div className={`absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-60 blur-xl transition-opacity group-hover:opacity-90 ${colors.glow}`} />
      <div className="relative flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-400">{label}</p>
        {Icon && (
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${colors.iconBg} ${colors.iconText}`}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <p className="relative mt-2 text-2xl font-bold tracking-tight text-ink-900">{value}</p>
    </motion.div>
  );
};

export default StatCard;
