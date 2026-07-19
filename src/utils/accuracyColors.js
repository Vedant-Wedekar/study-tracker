// Centralized accuracy → color mapping used across cards, tables, badges, charts.
export const getAccuracyLevel = (accuracy) => {
  const value = Number(accuracy) || 0;
  if (value >= 90) return 'excellent';
  if (value >= 75) return 'good';
  if (value >= 60) return 'fair';
  if (value >= 40) return 'weak';
  return 'poor';
};

export const ACCURACY_STYLES = {
  excellent: {
    text: 'text-emerald-600',
    bg: 'bg-emerald-50',
    ring: 'ring-emerald-200',
    dot: 'bg-emerald-500',
    chart: '#10b981',
  },
  good: {
    text: 'text-lime-600',
    bg: 'bg-lime-50',
    ring: 'ring-lime-200',
    dot: 'bg-lime-500',
    chart: '#84cc16',
  },
  fair: {
    text: 'text-amber-600',
    bg: 'bg-amber-50',
    ring: 'ring-amber-200',
    dot: 'bg-amber-500',
    chart: '#f59e0b',
  },
  weak: {
    text: 'text-orange-600',
    bg: 'bg-orange-50',
    ring: 'ring-orange-200',
    dot: 'bg-orange-500',
    chart: '#f97316',
  },
  poor: {
    text: 'text-rose-600',
    bg: 'bg-rose-50',
    ring: 'ring-rose-200',
    dot: 'bg-rose-500',
    chart: '#f43f5e',
  },
};

export const getAccuracyStyle = (accuracy) => ACCURACY_STYLES[getAccuracyLevel(accuracy)];
