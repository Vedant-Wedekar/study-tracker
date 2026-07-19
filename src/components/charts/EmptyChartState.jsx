import { FiBarChart2 } from 'react-icons/fi';

const EmptyChartState = ({ label = 'No data yet' }) => (
  <div className="flex h-48 flex-col items-center justify-center text-ink-300">
    <FiBarChart2 className="h-8 w-8" />
    <p className="mt-2 text-xs font-medium text-ink-400">{label}</p>
  </div>
);

export default EmptyChartState;
