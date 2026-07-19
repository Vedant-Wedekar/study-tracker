import { useEffect, useState } from 'react';
import { subscribeActivityLog } from '../utils/firestore';
import useAuth from './useAuth';

const useActivityLog = (days = 60) => {
  const { user } = useAuth();
  const [log, setLog] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return undefined;
    setLoading(true);
    const unsubscribe = subscribeActivityLog(user.uid, (items) => {
      setLog(items);
      setLoading(false);
    }, days);
    return unsubscribe;
  }, [user, days]);

  return { log, loading };
};

export default useActivityLog;
