import { useState, useCallback, useEffect } from 'react';
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

export const useFirestore = (collectionName) => {
  const [documents, setDocuments] = useState([]);
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  // Get all documents from collection
  const getDocuments = useCallback(async (orderByField = 'createdAt', forceRefresh = false) => {
    // If we already have documents and not forcing refresh, return them
    if (documents.length > 0 && !forceRefresh) {
      return documents;
    }
    
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
      setLastFetch(new Date());
      return docs;
    } catch (err) {
      console.error('Error getting documents:', err);
      setError('Failed to fetch documents');
      return [];
    } finally {
      setLoading(false);
    }
  }, [collectionName, documents]);

  // Get a single document by ID
  const getDocument = useCallback(async (id) => {
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
        setDocument(null);
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
  }, [collectionName]);

  // Add a new document
  const addDocument = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    
    try {
      const collectionRef = collection(db, collectionName);
      const docRef = await addDoc(collectionRef, {
        ...data,
        createdAt: new Date()
      });
      
      // Refresh documents after adding
      getDocuments(undefined, true);
      
      return { id: docRef.id, ...data };
    } catch (err) {
      console.error('Error adding document:', err);
      setError('Failed to add document');
      return null;
    } finally {
      setLoading(false);
    }
  }, [collectionName, getDocuments]);

  // Update an existing document
  const updateDocument = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date()
      });
      
      // Refresh documents after updating
      getDocuments(undefined, true);
      
      return { id, ...data };
    } catch (err) {
      console.error('Error updating document:', err);
      setError('Failed to update document');
      return null;
    } finally {
      setLoading(false);
    }
  }, [collectionName, getDocuments]);

  // Delete a document
  const deleteDocument = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      
      // Refresh documents after deleting
      getDocuments(undefined, true);
      
      return true;
    } catch (err) {
      console.error('Error deleting document:', err);
      setError('Failed to delete document');
      return false;
    } finally {
      setLoading(false);
    }
  }, [collectionName, getDocuments]);

  // Initial fetch
  useEffect(() => {
    if (!lastFetch) {
      getDocuments();
    }
  }, [getDocuments, lastFetch]);

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