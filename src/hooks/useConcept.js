import { useEffect, useState } from 'react';
import { subscribeConcept } from '../utils/firestore';
import useAuth from './useAuth';

const useConcept = (conceptId) => {
  const { user } = useAuth();
  const [concept, setConcept] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !conceptId) return undefined;
    setLoading(true);
    const unsubscribe = subscribeConcept(user.uid, conceptId, (item) => {
      setConcept(item);
      setLoading(false);
    });
    return unsubscribe;
  }, [user, conceptId]);

  return { concept, loading };
};

export default useConcept;
