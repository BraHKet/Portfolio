import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { useFirestore } from '../../hooks/useFirestore';
import { glassCardVariant } from '../../utils/animations';

const AdminDashboard = () => {
  const { documents: projects, loading, error, getDocuments, deleteDocument } = useFirestore('projects');
  const [deleteId, setDeleteId] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
  // Fetch projects on mount
  useEffect(() => {
    getDocuments();
  }, [getDocuments]);
  
  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };
  
  // Open delete confirmation
  const openDeleteConfirm = (id) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };
  
  // Close delete confirmation
  const closeDeleteConfirm = () => {
    setIsConfirmOpen(false);
    setDeleteId(null);
  };
  
  // Handle project deletion
  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      await deleteDocument(deleteId);
      showToast('Progetto eliminato con successo');
      closeDeleteConfirm();
    } catch (error) {
      console.error('Error deleting project:', error);
      showToast('Si è verificato un errore durante l\'eliminazione', 'error');
    }
  };
  
  return (
    <div>
      {/* Header with Add Button */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Gestione Progetti</h2>
        <Link to="/admin/new">
          <motion.button
            className="glass-button flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlus className="mr-2" /> Nuovo Progetto
          </motion.button>
        </Link>
      </div>
      
      {/* Toast notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            className={`p-4 rounded-lg mb-6 ${
              toast.type === 'error' 
                ? 'bg-red-400 bg-opacity-20 text-red-300' 
                : 'bg-green-400 bg-opacity-20 text-green-300'
            }`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="glass-card p-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-t-4 border-b-4 border-primary-500 rounded-full animate-spin"></div>
              <p className="mt-4">Caricamento progetti...</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="flex justify-center items-center py-12">
          <div className="glass-card p-8 text-center text-red-400">
            <p className="mb-4">Si è verificato un errore durante il caricamento dei progetti.</p>
            <motion.button
              className="glass-button"
              onClick={() => getDocuments()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Riprova
            </motion.button>
          </div>
        </div>
      )}
      
      {/* Empty State */}
      {!loading && !error && projects.length === 0 && (
        <div className="flex justify-center items-center py-12">
          <motion.div 
            className="glass-card p-8 text-center"
            variants={glassCardVariant}
            initial="initial"
            animate="animate"
            whileHover="hover"
          >
            <p className="mb-4">Nessun progetto disponibile.</p>
            <Link to="/admin/new">
              <motion.button
                className="glass-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Crea il tuo primo progetto
              </motion.button>
            </Link>
          </motion.div>
        </div>
      )}
      
      {/* Projects Table */}
      {!loading && !error && projects.length > 0 && (
        <motion.div 
          className="glass-card overflow-hidden"
          variants={glassCardVariant}
          initial="initial"
          animate="animate"
          whileHover="hover"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-light-200">
                  <th className="text-left p-4">Immagine</th>
                  <th className="text-left p-4">Titolo</th>
                  <th className="text-left p-4 hidden md:table-cell">Tag</th>
                  <th className="text-left p-4 hidden lg:table-cell">Data</th>
                  <th className="text-center p-4">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <motion.tr 
                    key={project.id} 
                    className="border-b border-light-100 hover:bg-light-100"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Thumbnail */}
                    <td className="p-4">
                      <div className="w-14 h-14 rounded-md overflow-hidden">
                        <img 
                          src={project.imageUrl || "/api/placeholder/100/100"} 
                          alt={project.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    
                    {/* Title */}
                    <td className="p-4 font-medium">
                      {project.title}
                    </td>
                    
                    {/* Tags */}
                    <td className="p-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {project.tags && project.tags.slice(0, 2).map((tag, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-0.5 bg-light-200 text-primary-900 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {project.tags && project.tags.length > 2 && (
                          <span className="px-2 py-0.5 bg-light-200 text-primary-900 text-xs rounded-full">
                            +{project.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    
                    {/* Date */}
                    <td className="p-4 hidden lg:table-cell text-light-700">
                      {project.date && new Date(project.date.seconds * 1000).toLocaleDateString('it-IT', { 
                        year: 'numeric', 
                        month: 'short' 
                      })}
                    </td>
                    
                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex justify-center space-x-2">
                        <Link to={`/projects/${project.id}`}>
                          <motion.button
                            className="glass p-2 rounded-full"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Visualizza"
                          >
                            <FaEye />
                          </motion.button>
                        </Link>
                        
                        <Link to={`/admin/edit/${project.id}`}>
                          <motion.button
                            className="glass p-2 rounded-full"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Modifica"
                          >
                            <FaEdit />
                          </motion.button>
                        </Link>
                        
                        <motion.button
                          className="glass p-2 rounded-full text-red-400"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => openDeleteConfirm(project.id)}
                          title="Elimina"
                        >
                          <FaTrash />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
      
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isConfirmOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900 bg-opacity-75"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass-card max-w-md w-full mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <h3 className="text-xl font-bold mb-4">Conferma eliminazione</h3>
              <p className="mb-6">
                Sei sicuro di voler eliminare questo progetto? Questa azione non può essere annullata.
              </p>
              
              <div className="flex justify-end space-x-3">
                <motion.button
                  className="glass-button"
                  onClick={closeDeleteConfirm}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Annulla
                </motion.button>
                
                <motion.button
                  className="glass-button bg-red-400 bg-opacity-20 text-red-300"
                  onClick={handleDelete}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Elimina
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;