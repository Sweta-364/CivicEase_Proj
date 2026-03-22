import { auth, firebaseSignOut } from '../firebaseConfig';

const STORAGE_KEY = 'civicease_session';

const ADMIN_DEMO_SESSION = {
  id: 'admin-demo',
  email: 'admin@demo.com',
  role: 'admin',
  name: 'Priya Admin',
  first_name: 'Priya',
};

export function firstNameFromName(name = '', email = '') {
  const trimmed = name.trim();
  if (trimmed) {
    return trimmed.split(/\s+/)[0];
  }

  if (email) {
    return email.split('@')[0];
  }

  return 'User';
}

export function getSessionUser() {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function saveSessionUser(session) {
  if (typeof window === 'undefined') {
    return session;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return session;
}

export function syncFirebaseUserToSession(user) {
  if (!user) {
    return null;
  }

  return saveSessionUser({
    id: user.uid,
    email: user.email || '',
    name: user.displayName || firstNameFromName('', user.email || ''),
    first_name: firstNameFromName(user.displayName || '', user.email || ''),
    role: 'citizen',
    photoURL: user.photoURL || '',
  });
}

export function signInAsAdminDemo() {
  return saveSessionUser(ADMIN_DEMO_SESSION);
}

export function clearSessionUser() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

export async function signOutUser() {
  const session = getSessionUser();

  try {
    if (session?.role !== 'admin' && auth.currentUser) {
      await firebaseSignOut(auth);
    }
  } finally {
    clearSessionUser();
  }
}

export function isAdmin(user) {
  return user?.role === 'admin';
}
