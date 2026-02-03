import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateEmail as updateEmailFirebase,
  updatePassword as updatePasswordFirebase,
  sendEmailVerification,
  applyActionCode,
  reload,
  UserCredential,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  linkWithPopup,
  unlink,
  updateProfile,
  browserSessionPersistence,
  browserLocalPersistence,
  setPersistence,
  onAuthStateChanged,
  Auth
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
  provider: string;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
  loginCount: number;
  metadata?: {
    lastSignInTime?: string;
    creationTime?: string;
  };
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signup: (email: string, password: string, displayName?: string) => Promise<UserCredential>;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateEmail: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
  updatePhotoURL: (url: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  signInWithGoogle: () => Promise<UserCredential>;
  signInWithGithub: () => Promise<UserCredential>;
  linkGoogleAccount: () => Promise<UserCredential>;
  linkGithubAccount: () => Promise<UserCredential>;
  unlinkProvider: (providerId: string) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Track user login in Firestore
  const trackUserLogin = async (user: User): Promise<void> => {
    if (!user) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        // Update existing user
        await updateDoc(userRef, {
          lastLoginAt: serverTimestamp(),
          loginCount: (userSnap.data().loginCount || 0) + 1
        });
      } else {
        // Create new user profile
        const profile: Omit<UserProfile, 'createdAt'> = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || undefined,
          photoURL: user.photoURL || undefined,
          emailVerified: user.emailVerified,
          provider: user.providerData[0]?.providerId || 'email',
          lastLoginAt: serverTimestamp() as any,
          loginCount: 1
        };

        await setDoc(userRef, {
          ...profile,
          createdAt: serverTimestamp()
        });
      }

      // Load user profile
      await refreshUserProfile();
    } catch (error) {
      console.error('Error tracking user login:', error);
      // Don't throw error to prevent login failure
    }
  };

  // Refresh user profile from Firestore
  const refreshUserProfile = async (): Promise<void> => {
    if (!currentUser) {
      setUserProfile(null);
      return;
    }

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUserProfile(userSnap.data() as UserProfile);
      }
    } catch (error) {
      console.error('Error refreshing user profile:', error);
    }
  };

  // Sign up with email/password
  const signup = async (
    email: string,
    password: string,
    displayName?: string
  ): Promise<UserCredential> => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);

      // Update display name if provided
      if (displayName && result.user) {
        await updateProfile(result.user, { displayName });
      }

      // Send verification email
      await sendEmailVerification(result.user);

      // Create user profile
      await trackUserLogin(result.user);

      return result;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create account');
    }
  };

  // Login with email/password
  const login = async (
    email: string,
    password: string,
    rememberMe: boolean = false
  ): Promise<UserCredential> => {
    try {
      // Set persistence based on remember me
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );

      const result = await signInWithEmailAndPassword(auth, email, password);

      // Track login
      await trackUserLogin(result.user);

      return result;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to login');
    }
  };

  // Sign out
  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setUserProfile(null);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to logout');
    }
  };

  // Reset password
  const resetPassword = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send reset email');
    }
  };

  // Update email
  const updateEmail = async (email: string): Promise<void> => {
    if (!currentUser) throw new Error('No user logged in');
    try {
      await updateEmailFirebase(currentUser, email);
      await refreshUserProfile();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update email');
    }
  };

  // Update password
  const updatePassword = async (password: string): Promise<void> => {
    if (!currentUser) throw new Error('No user logged in');
    try {
      await updatePasswordFirebase(currentUser, password);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update password');
    }
  };

  // Update display name
  const updateDisplayName = async (name: string): Promise<void> => {
    if (!currentUser) throw new Error('No user logged in');
    try {
      await updateProfile(currentUser, { displayName: name });
      await refreshUserProfile();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update display name');
    }
  };

  // Update photo URL
  const updatePhotoURL = async (url: string): Promise<void> => {
    if (!currentUser) throw new Error('No user logged in');
    try {
      await updateProfile(currentUser, { photoURL: url });
      await refreshUserProfile();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update photo URL');
    }
  };

  // Send verification email
  const sendVerificationEmail = async (): Promise<void> => {
    if (!currentUser) throw new Error('No user logged in');
    try {
      await sendEmailVerification(currentUser);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send verification email');
    }
  };

  // Verify email with action code
  const verifyEmail = async (code: string): Promise<void> => {
    try {
      await applyActionCode(auth, code);
      if (currentUser) {
        await reload(currentUser);
        await refreshUserProfile();
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to verify email');
    }
  };

  // Sign in with Google
  const signInWithGoogle = async (): Promise<UserCredential> => {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');

      const result = await signInWithPopup(auth, provider);
      await trackUserLogin(result.user);
      return result;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in with Google');
    }
  };

  // Sign in with GitHub
  const signInWithGithub = async (): Promise<UserCredential> => {
    try {
      const provider = new GithubAuthProvider();
      provider.addScope('user:email');

      const result = await signInWithPopup(auth, provider);
      await trackUserLogin(result.user);
      return result;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in with GitHub');
    }
  };

  // Link Google account
  const linkGoogleAccount = async (): Promise<UserCredential> => {
    if (!currentUser) throw new Error('No user logged in');
    try {
      const provider = new GoogleAuthProvider();
      const result = await linkWithPopup(currentUser, provider);
      await refreshUserProfile();
      return result;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to link Google account');
    }
  };

  // Link GitHub account
  const linkGithubAccount = async (): Promise<UserCredential> => {
    if (!currentUser) throw new Error('No user logged in');
    try {
      const provider = new GithubAuthProvider();
      const result = await linkWithPopup(currentUser, provider);
      await refreshUserProfile();
      return result;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to link GitHub account');
    }
  };

  // Unlink provider
  const unlinkProvider = async (providerId: string): Promise<void> => {
    if (!currentUser) throw new Error('No user logged in');
    try {
      await unlink(currentUser, providerId);
      await refreshUserProfile();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to unlink provider');
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        await refreshUserProfile();
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    signup,
    login,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    updateDisplayName,
    updatePhotoURL,
    sendVerificationEmail,
    verifyEmail,
    signInWithGoogle,
    signInWithGithub,
    linkGoogleAccount,
    linkGithubAccount,
    unlinkProvider,
    refreshUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
