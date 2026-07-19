import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format, parseISO } from 'date-fns';
import ChartCard from './ChartCard';
import EmptyChartState from './EmptyChartState';

const MonthlyActivityChart = ({ log, delay = 0 }) => {
  const byMonth = {};
  log.forEach((entry) => {
    if (!entry.id || !entry.questionsSolved) return;
    const key = entry.id.slice(0, 7); // YYYY-MM
    byMonth[key] = (byMonth[key] || 0) + entry.questionsSolved;
  });

  const data = Object.keys(byMonth)
    .sort()
    .slice(-6)
    .map((key) => ({
      month: format(parseISO(`${key}-01`), 'MMM yy'),
      questions: byMonth[key],
    }));

  return (
    <ChartCard title="Monthly Activity" subtitle="Total questions per month" delay={delay}>
      {data.length === 0 ? (
        <EmptyChartState label="No monthly activity yet" />
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} barSize={32}>
            <CartesianGrid vertical={false} stroke="#eef0f3" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8f909c' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8f909c' }} width={28} allowDecimals={false} />
            <Tooltip
              cursor={{ fill: '#f7f8fa' }}
              contentStyle={{ borderRadius: 12, border: '1px solid #eee', fontSize: 12 }}
            />
            <Bar dataKey="questions" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
};

export default MonthlyActivityChart;
