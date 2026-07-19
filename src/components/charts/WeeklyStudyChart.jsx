import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format, subDays } from 'date-fns';
import ChartCard from './ChartCard';
import EmptyChartState from './EmptyChartState';

const WeeklyStudyChart = ({ log, delay = 0 }) => {
  const days = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(new Date(), 6 - i);
    const iso = date.toISOString().slice(0, 10);
    const entry = log.find((l) => l.id === iso);
    return {
      day: format(date, 'EEE'),
      questions: entry?.questionsSolved > 0 ? entry.questionsSolved : 0,
    };
  });

  const hasData = days.some((d) => d.questions > 0);

  return (
    <ChartCard title="Weekly Study Activity" subtitle="Questions solved each day" delay={delay}>
      {!hasData ? (
        <EmptyChartState label="No activity logged this week" />
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={days} barSize={28}>
            <CartesianGrid vertical={false} stroke="#eef0f3" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8f909c' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8f909c' }} width={28} allowDecimals={false} />
            <Tooltip
              cursor={{ fill: '#f7f8fa' }}
              contentStyle={{ borderRadius: 12, border: '1px solid #eee', fontSize: 12 }}
            />
            <Bar dataKey="questions" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
};

export default WeeklyStudyChart;
