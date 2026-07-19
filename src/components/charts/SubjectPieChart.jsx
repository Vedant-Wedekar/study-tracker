import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import ChartCard from './ChartCard';
import EmptyChartState from './EmptyChartState';
import { SUBJECTS } from '../../utils/subjects';

const COLORS = ['#8b5cf6', '#3b82f6', '#fb7185', '#f59e0b', '#10b981', '#475569'];

const SubjectPieChart = ({ concepts, delay = 0 }) => {
  const data = SUBJECTS.map((subject) => {
    const total = concepts
      .filter((c) => c.subjectId === subject.id)
      .reduce((sum, c) => sum + (c.totalQuestions || 0), 0);
    return { name: subject.name, value: total };
  }).filter((d) => d.value > 0);

  return (
    <ChartCard title="Questions by Subject" subtitle="Distribution across your practice" delay={delay}>
      {data.length === 0 ? (
        <EmptyChartState label="Solve a few questions to see this chart" />
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              cornerRadius={6}
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: 12, border: '1px solid #eee', fontSize: 12 }}
              formatter={(value) => [`${value} questions`, '']}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => <span style={{ fontSize: 12, color: '#585865' }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
};

export default SubjectPieChart;
