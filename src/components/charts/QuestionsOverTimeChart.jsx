import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import ChartCard from './ChartCard';
import EmptyChartState from './EmptyChartState';
import { formatDate } from '../../utils/dateHelpers';

const QuestionsOverTimeChart = ({ entries, delay = 0 }) => {
  const data = [...entries]
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .map((e) => ({ date: formatDate(e.date, 'dd MMM'), questions: e.questionsSolved }));

  return (
    <ChartCard title="Questions Solved Over Time" subtitle="Volume per session" delay={delay}>
      {data.length === 0 ? (
        <EmptyChartState label="No sessions logged yet" />
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} barSize={22}>
            <CartesianGrid vertical={false} stroke="#eef0f3" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#8f909c' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#8f909c' }} width={28} allowDecimals={false} />
            <Tooltip
              cursor={{ fill: '#f7f8fa' }}
              contentStyle={{ borderRadius: 12, border: '1px solid #eee', fontSize: 12 }}
            />
            <Bar dataKey="questions" fill="#10b981" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
};

export default QuestionsOverTimeChart;
