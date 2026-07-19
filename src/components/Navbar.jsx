import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTarget, FiLogOut, FiChevronDown } from 'react-icons/fi';
import useAuth from '../hooks/useAuth';

const Navbar = ({ profile }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = (profile?.name || user?.email || 'A')[0]?.toUpperCase();

  return (
    <header className="sticky top-0 z-40 glass">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-soft">
            <FiTarget className="h-4.5 w-4.5" />
          </div>
          <span className="text-[15px] font-bold tracking-tight text-ink-900">StudyTrack</span>
        </Link>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2.5 transition hover:bg-ink-100/80"
          >
            {profile?.photoURL ? (
              <img src={profile.photoURL} alt="" className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-900 text-xs font-bold text-white">
                {initials}
              </div>
            )}
            <FiChevronDown className={`h-3.5 w-3.5 text-ink-400 transition ${menuOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-ink-100 bg-white p-1.5 shadow-card"
                >
                  <div className="px-2.5 py-2">
                    <p className="truncate text-sm font-semibold text-ink-900">{profile?.name || 'Aspirant'}</p>
                    <p className="truncate text-xs text-ink-400">{user?.email}</p>
                  </div>
                  <div className="my-1 h-px bg-ink-100" />
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                  >
                    <FiLogOut className="h-4 w-4" />
                    Logout
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
