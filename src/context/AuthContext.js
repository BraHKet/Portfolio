import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { auth } from '../config/firebase';

// Create auth context
const AuthContext = createContext();

// Lista admin hardcoded per fallback (aggiungi qui altre email admin se necessario)
const ADMIN_EMAILS = ['lore.mail.gl@gmail.com'];

// Create auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Sign in method
  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Sign out method
  const signOut = () => {
    return firebaseSignOut(auth);
  };

  // Check if user is admin con debug e fallback
  const checkAdminStatus = async (user) => {
    if (!user) {
      console.log('No user, setting admin to false');
      setIsAdmin(false);
      return;
    }
    
    console.log('🔍 Checking admin status for:', user.email);
    
    try {
      // Prima prova con custom claims
      console.log('📡 Fetching ID token with claims...');
      const token = await user.getIdTokenResult(true);
      console.log('🎫 Custom claims received:', token.claims);
      
      let isUserAdmin = !!token.claims.admin;
      console.log('👑 Admin from custom claims:', isUserAdmin);
      
      // Fallback: controlla se l'email è nella lista admin
      if (!isUserAdmin && ADMIN_EMAILS.includes(user.email)) {
        console.log('✅ Using email fallback for admin status');
        isUserAdmin = true;
      }
      
      console.log('🎯 Final admin status:', isUserAdmin);
      setIsAdmin(isUserAdmin);
      
      // Log dettagliato in development
      if (process.env.NODE_ENV === 'development') {
        console.log('🐛 DEBUG INFO:', {
          userEmail: user.email,
          userUID: user.uid,
          customClaims: token.claims,
          adminFromClaims: !!token.claims.admin,
          adminFromEmail: ADMIN_EMAILS.includes(user.email),
          finalAdminStatus: isUserAdmin
        });
      }
      
    } catch (error) {
      console.error('❌ Error checking admin status:', error);
      
      // Fallback completo in caso di errore
      const emailBasedAdmin = ADMIN_EMAILS.includes(user.email);
      console.log('🔄 Using email-based fallback due to error:', emailBasedAdmin);
      setIsAdmin(emailBasedAdmin);
    }
  };

  // Force refresh admin status (utile per debug)
  const refreshAdminStatus = async () => {
    if (currentUser) {
      console.log('🔄 Manually refreshing admin status...');
      await checkAdminStatus(currentUser);
    }
  };

  // Effect to handle auth state changes
  useEffect(() => {
    console.log('🚀 Setting up auth state listener...');
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('🔄 Auth state changed:', user?.email || 'No user');
      setCurrentUser(user);
      await checkAdminStatus(user);
      setLoading(false);
    });

    // Cleanup subscription
    return () => {
      console.log('🧹 Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  // Log context values on every render (solo in development)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 AuthContext state update:', { 
        userEmail: currentUser?.email || 'No user', 
        isAdmin, 
        loading 
      });
    }
  }, [currentUser, isAdmin, loading]);

  // Context value
  const value = {
    currentUser,
    isAdmin,
    signIn,
    signOut,
    loading,
    refreshAdminStatus // Aggiungo questo per debug
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;