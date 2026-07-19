import { useEffect, useState } from 'react';
import { subscribeSubjectConcepts } from '../utils/firestore';
import useAuth from './useAuth';

const useSubjectConcepts = (subjectId) => {
  const { user } = useAuth();
  const [concepts, setConcepts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !subjectId) return undefined;
    setLoading(true);
    const unsubscribe = subscribeSubjectConcepts(user.uid, subjectId, (items) => {
      setConcepts(items);
      setLoading(false);
    });
    return unsubscribe;
  }, [user, subjectId]);

  return { concepts, loading };
};

export default useSubjectConcepts;
