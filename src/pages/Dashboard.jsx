import { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  FiHelpCircle, FiLayers, FiTarget, FiClock, FiCalendar,
} from 'react-icons/fi';
import ProfileCard from '../components/ProfileCard';
import StatCard from '../components/StatCard';
import SubjectCard from '../components/SubjectCard';
import StreakBadge from '../components/StreakBadge';
import EditProfileModal from '../components/EditProfileModal';
import SubjectPieChart from '../components/charts/SubjectPieChart';
import WeeklyStudyChart from '../components/charts/WeeklyStudyChart';
import MonthlyActivityChart from '../components/charts/MonthlyActivityChart';
import { SkeletonCard, SkeletonProfileCard, SkeletonSubjectCard } from '../components/Skeletons';
import useAllConcepts from '../hooks/useAllConcepts';
import useActivityLog from '../hooks/useActivityLog';
import { SUBJECTS } from '../utils/subjects';
import { calculateStreak } from '../utils/streak';
import { relativeDay } from '../utils/dateHelpers';

const Dashboard = () => {
  const { profile } = useOutletContext();
  const { concepts, loading } = useAllConcepts();
  const { log } = useActivityLog(90);
  const [editOpen, setEditOpen] = useState(false);

  const totals = useMemo(() => {
    const totalQuestions = concepts.reduce((s, c) => s + (c.totalQuestions || 0), 0);
    const totalCorrect = concepts.reduce((s, c) => s + (c.totalCorrect || 0), 0);
    const totalTime = concepts.reduce((s, c) => s + (c.totalTime || 0), 0);
    const avgAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 1000) / 10 : 0;
    const lastPracticed = concepts.reduce((latest, c) => {
      if (!c.lastPracticed) return latest;
      if (!latest || c.lastPracticed > latest) return c.lastPracticed;
      return latest;
    }, null);

    const activeDates = log.filter((l) => l.questionsSolved > 0).map((l) => l.id);
    const { streak } = calculateStreak(activeDates);

    return {
      totalQuestions,
      totalConcepts: concepts.length,
      avgAccuracy,
      totalHours: Math.round((totalTime / 60) * 10) / 10,
      streak,
      lastPracticed,
    };
  }, [concepts, log]);

  const subjectStats = useMemo(() => SUBJECTS.reduce((acc, subject) => {
    const items = concepts.filter((c) => c.subjectId === subject.id);
    const totalQuestions = items.reduce((s, c) => s + (c.totalQuestions || 0), 0);
    const totalCorrect = items.reduce((s, c) => s + (c.totalCorrect || 0), 0);
    const lastPracticed = items.reduce((latest, c) => {
      if (!c.lastPracticed) return latest;
      if (!latest || c.lastPracticed > latest) return c.lastPracticed;
      return latest;
    }, null);
    acc[subject.id] = {
      totalConcepts: items.length,
      totalQuestions,
      avgAccuracy: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 1000) / 10 : 0,
      lastPracticed,
    };
    return acc;
  }, {}), [concepts]);

  return (
    <div className="space-y-8">
      {loading ? <SkeletonProfileCard /> : <ProfileCard profile={profile} onEdit={() => setEditOpen(true)} />}

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wide text-ink-400">Your Progress</h2>
          {!loading && <StreakBadge streak={totals.streak} />}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            <>
              <StatCard label="Questions Solved" value={totals.totalQuestions} icon={FiHelpCircle} accent="brand" delay={0.02} />
              <StatCard label="Total Concepts" value={totals.totalConcepts} icon={FiLayers} accent="violet" delay={0.06} />
              <StatCard label="Avg. Accuracy" value={`${totals.avgAccuracy}%`} icon={FiTarget} accent="emerald" delay={0.1} />
              <StatCard label="Study Hours" value={totals.totalHours} icon={FiClock} accent="amber" delay={0.14} />
              <StatCard label="Current Streak" value={`${totals.streak} d`} icon={FiTarget} accent="rose" delay={0.18} />
              <StatCard label="Last Studied" value={relativeDay(totals.lastPracticed)} icon={FiCalendar} accent="cyan" delay={0.22} />
            </>
          )}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink-400">Subjects</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonSubjectCard key={i} />)
          ) : (
            SUBJECTS.map((subject, i) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                stats={subjectStats[subject.id]}
                delay={0.05 * i}
              />
            ))
          )}
        </div>
      </div>

      {!loading && (
        <div>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink-400">Analytics</h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <SubjectPieChart concepts={concepts} />
            <WeeklyStudyChart log={log} delay={0.05} />
            <MonthlyActivityChart log={log} delay={0.1} />
          </div>
        </div>
      )}

      <EditProfileModal open={editOpen} onClose={() => setEditOpen(false)} profile={profile} />
    </div>
  );
};

export default Dashboard;
