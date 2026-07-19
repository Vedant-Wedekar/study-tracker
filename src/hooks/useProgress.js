import { useEffect, useState } from 'react';
import { subscribeProgress } from '../utils/firestore';
import useAuth from './useAuth';

const useProgress = (conceptId) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !conceptId) return undefined;
    setLoading(true);
    const unsubscribe = subscribeProgress(user.uid, conceptId, (items) => {
      setEntries(items);
      setLoading(false);
    });
    return unsubscribe;
  }, [user, conceptId]);

  return { entries, loading };
};

export default useProgress;
