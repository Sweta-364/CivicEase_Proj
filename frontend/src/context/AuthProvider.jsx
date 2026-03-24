import { useEffect, useMemo, useState } from 'react';
import { onIdTokenChanged } from 'firebase/auth';
import AuthContext from './auth-context';
import api from '../api';
import { auth } from '../firebaseConfig';

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [appUser, setAppUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (!user) {
        setAppUser(null);
        setLoading(false);
        return;
      }

      try {
        const token = await user.getIdToken();
        const response = await api.get('/v1/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppUser(response.data);
      } catch (error) {
        console.error(
          'Failed to fetch current user profile',
          error?.response?.data?.detail || error?.message || error
        );
        setAppUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = useMemo(
    () => ({
      firebaseUser,
      appUser,
      loading,
      refreshAppUser: async () => {
        const user = auth.currentUser;
        if (!user) return null;

        const token = await user.getIdToken();
        const response = await api.get('/v1/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppUser(response.data);
        return response.data;
      },
    }),
    [appUser, firebaseUser, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

