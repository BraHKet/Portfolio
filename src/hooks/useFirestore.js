import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Custom hook for Firestore operations
export const useFirestore = (collectionName) => {
  const [documents, setDocuments] = useState([]);
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get all documents from collection
  const getDocuments = async (orderByField = 'createdAt') => {
    setLoading(true);
    setError(null);
    
    try {
      const collectionRef = collection(db, collectionName);
      const q = query(collectionRef, orderBy(orderByField, 'desc'));
      const snapshot = await getDocs(q);
      
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setDocuments(docs);
      return docs;
    } catch (err) {
      console.error('Error getting documents:', err);
      setError('Failed to fetch documents');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get a single document by ID
  const getDocument = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const docRef = doc(db, collectionName, id);
      const snapshot = await getDoc(docRef);
      
      if (snapshot.exists()) {
        const data = {
          id: snapshot.id,
          ...snapshot.data()
        };
        
        setDocument(data);
        return data;
      } else {
        setError('Document not found');
        return null;
      }
    } catch (err) {
      console.error('Error getting document:', err);
      setError('Failed to fetch document');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Add a new document
  const addDocument = async (data) => {
    setLoading(true);
    setError(null);
    
    try {
      const collectionRef = collection(db, collectionName);
      const docRef = await addDoc(collectionRef, {
        ...data,
        createdAt: new Date()
      });
      
      return { id: docRef.id, ...data };
    } catch (err) {
      console.error('Error adding document:', err);
      setError('Failed to add document');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing document
  const updateDocument = async (id, data) => {
    setLoading(true);
    setError(null);
    
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date()
      });
      
      return { id, ...data };
    } catch (err) {
      console.error('Error updating document:', err);
      setError('Failed to update document');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete a document
  const deleteDocument = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      return true;
    } catch (err) {
      console.error('Error deleting document:', err);
      setError('Failed to delete document');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    documents,
    document,
    loading,
    error,
    getDocuments,
    getDocument,
    addDocument,
    updateDocument,
    deleteDocument
  };
};