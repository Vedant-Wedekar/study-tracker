import { getAccuracyStyle } from '../utils/accuracyColors';

const AccuracyBadge = ({ value, size = 'md' }) => {
  const style = getAccuracyStyle(value);
  const sizing = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ring-1 ${style.bg} ${style.text} ${style.ring} ${sizing}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {Number(value || 0).toFixed(1)}%
    </span>
  );
};

export default AccuracyBadge;
