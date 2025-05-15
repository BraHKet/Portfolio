import React from 'react';
import { motion } from 'framer-motion';
import AdminDashboard from '../components/admin/AdminDashboard';
import { pageTransition } from '../utils/animations';

const Admin = () => {
  return (
    <motion.div
      className="container mx-auto px-4 py-16"
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Background elements */}
      <div className="fixed -z-10 top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary-600 rounded-full opacity-10 blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-secondary-600 rounded-full opacity-10 blur-3xl transform -translate-x-1/3 translate-y-1/4"></div>
      </div>
      
      {/* Page Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
          Admin Dashboard
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-primary-400 to-secondary-400 mx-auto mb-6"></div>
        <p className="text-light-700 max-w-2xl mx-auto">
          Gestisci i tuoi progetti, controlla il tuo portfolio e mantieni aggiornato il tuo sito web.
        </p>
      </motion.div>
      
      {/* Admin Dashboard */}
      <AdminDashboard />
    </motion.div>
  );
};

export default Admin;