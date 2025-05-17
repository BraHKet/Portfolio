import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { auth } from '../config/firebase';

// Create auth context
const AuthContext = createContext();

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

  // Check if user is admin
  const checkAdminStatus = async (user) => {
  if (!user) {
    setIsAdmin(false);
    return;
  }
  
  // Soluzione temporanea: considera questo utente specifico come admin
  if (user.email === 'lore.mail.gl@gmail.com') {
    setIsAdmin(true);
    return;
  }
  
  // Ottieni il token ID con claims aggiornati
  const token = await user.getIdTokenResult(true);
  setIsAdmin(!!token.claims.admin);
};

  // Effect to handle auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      await checkAdminStatus(user);
      setLoading(false);
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  // Context value
  const value = {
    currentUser,
    isAdmin,
    signIn,
    signOut,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;