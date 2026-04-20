import type { User } from 'firebase/auth';

export const createMockAuth = () => {
  const mockUser: Partial<User> = {
    uid: 'demo_user_12345',
    email: 'demo@refer.com',
    displayName: 'Demo User',
    photoURL: null,
    emailVerified: true,
    phoneNumber: '+263808120135',
  };

  let currentUser: Partial<User> | null = null;
  const authStateCallbacks: Array<(user: Partial<User> | null) => void> = [];

  return {
    currentUser: null as Partial<User> | null,

    onAuthStateChanged: (callback: (user: Partial<User> | null) => void) => {
      authStateCallbacks.push(callback);
      setTimeout(() => callback(currentUser), 100);
      return () => {
        const i = authStateCallbacks.indexOf(callback);
        if (i > -1) authStateCallbacks.splice(i, 1);
      };
    },

    signInWithEmailAndPassword: async (email: string, _password: string) => {
      currentUser = { ...mockUser, email };
      authStateCallbacks.forEach(cb => cb(currentUser));
      return { user: currentUser };
    },

    signInWithPopup: async () => {
      currentUser = mockUser;
      authStateCallbacks.forEach(cb => cb(currentUser));
      return { user: currentUser };
    },

    createUserWithEmailAndPassword: async (email: string, _password: string) => {
      currentUser = { ...mockUser, email };
      authStateCallbacks.forEach(cb => cb(currentUser));
      return { user: currentUser };
    },

    signOut: async () => {
      currentUser = null;
      authStateCallbacks.forEach(cb => cb(null));
    },

    updateProfile: async () => Promise.resolve(),
  };
};

export const createMockApp = () => ({
  name: '[DEFAULT]',
  options: {},
  automaticDataCollectionEnabled: false,
});
