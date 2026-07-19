import { AnimatePresence, motion } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import useAuth from '../hooks/useAuth';
import { subscribeUserProfile } from '../utils/firestore';

const AppLayout = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (!user) return undefined;
    return subscribeUserProfile(user.uid, setProfile);
  }, [user]);

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <Navbar profile={profile} />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-6xl px-4 pb-20 pt-6 sm:px-6"
        >
          <Outlet context={{ profile }} />
        </motion.main>
      </AnimatePresence>
    </div>
  );
};

export default AppLayout;
