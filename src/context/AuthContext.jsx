import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, updateProfile,
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { ensureUserProfile } from '../utils/firestore';

const AuthContext = createContext(null);

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await ensureUserProfile(firebaseUser.uid, {
          name: firebaseUser.displayName || 'Aspirant',
          photoURL: firebaseUser.photoURL || '',
        });
      }
      setUser(firebaseUser);
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  const signup = async (name, email, password) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    await ensureUserProfile(cred.user.uid, { name });
    return cred.user;
  };

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  const value = { user, initializing, signup, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
