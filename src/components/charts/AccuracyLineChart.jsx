import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Dot } from 'recharts';
import ChartCard from './ChartCard';
import EmptyChartState from './EmptyChartState';
import { formatDate } from '../../utils/dateHelpers';
import { getAccuracyStyle } from '../../utils/accuracyColors';

const CustomDot = (props) => {
  const { cx, cy, payload } = props;
  const style = getAccuracyStyle(payload.accuracy);
  return <Dot cx={cx} cy={cy} r={4} fill={style.chart} stroke="#fff" strokeWidth={1.5} />;
};

const AccuracyLineChart = ({ entries, delay = 0 }) => {
  const data = [...entries]
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .map((e) => ({ date: formatDate(e.date, 'dd MMM'), accuracy: e.accuracy }));

  return (
    <ChartCard title="Accuracy Improvement" subtitle="Session-by-session trend" delay={delay}>
      {data.length === 0 ? (
        <EmptyChartState label="Log a session to start tracking accuracy" />
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data}>
            <CartesianGrid vertical={false} stroke="#eef0f3" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#8f909c' }} />
            <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#8f909c' }} width={32} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: '1px solid #eee', fontSize: 12 }}
              formatter={(value) => [`${value}%`, 'Accuracy']}
            />
            <Line
              type="monotone"
              dataKey="accuracy"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={<CustomDot />}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
};

export default AccuracyLineChart;
