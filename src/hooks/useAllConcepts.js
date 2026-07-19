import { useEffect, useState } from 'react';
import { subscribeAllConcepts } from '../utils/firestore';
import useAuth from './useAuth';

const useAllConcepts = () => {
  const { user } = useAuth();
  const [concepts, setConcepts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return undefined;
    setLoading(true);
    const unsubscribe = subscribeAllConcepts(user.uid, (items) => {
      setConcepts(items);
      setLoading(false);
    });
    return unsubscribe;
  }, [user]);

  return { concepts, loading };
};

export default useAllConcepts;
