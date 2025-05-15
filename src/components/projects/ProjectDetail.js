import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGithub, FaGlobe, FaArrowLeft } from 'react-icons/fa';
import ImageCarousel from './ImageCarousel';
import { useFirestore } from '../../hooks/useFirestore';
import { useAuth } from '../../context/AuthContext';
import { pageTransition, glassCardVariant } from '../../utils/animations';

const ProjectDetail = () => {
  const { id } = useParams();
  const { getDocument, document: project, loading, error } = useFirestore('projects');
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  // Fetch project on mount
  useEffect(() => {
    getDocument(id);
  }, [getDocument, id]);
  
  // Handle back button
  const handleBack = () => {
    navigate('/projects');
  };
  
  return (
    <motion.div
      className="container mx-auto px-4 py-10"
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Back button */}
      <motion.button
        className="glass-button mb-6 inline-flex items-center"
        onClick={handleBack}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaArrowLeft className="mr-2" /> Torna ai progetti
      </motion.button>
      
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="glass-card p-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-t-4 border-b-4 border-primary-500 rounded-full animate-spin"></div>
              <p className="mt-4">Caricamento progetto...</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="flex justify-center items-center py-20">
          <div className="glass-card p-8 text-center text-red-400">
            <p className="mb-4">Si è verificato un errore durante il caricamento del progetto.</p>
            <div className="flex justify-center space-x-4">
              <motion.button
                className="glass-button"
                onClick={() => getDocument(id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Riprova
              </motion.button>
              
              <motion.button
                className="glass-button"
                onClick={handleBack}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Torna ai progetti
              </motion.button>
            </div>
          </div>
        </div>
      )}
      
      {/* Project Content */}
      {!loading && !error && project && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Images */}
          <div className="lg:col-span-2">
            <ImageCarousel images={project.images || [project.imageUrl]} />
            
            {/* Project Description */}
            <motion.div 
              className="glass-card"
              variants={glassCardVariant}
              initial="initial"
              animate="animate"
              whileHover="hover"
            >
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary-300 to-secondary-300 bg-clip-text text-transparent">
                Descrizione
              </h2>
              
              <div className="prose prose-invert max-w-none">
                <p className="text-light-800 whitespace-pre-line">{project.description}</p>
              </div>
            </motion.div>
          </div>
          
          {/* Right Column: Info */}
          <div className="lg:col-span-1">
            {/* Project Info */}
            <motion.div 
              className="glass-card mb-6"
              variants={glassCardVariant}
              initial="initial"
              animate="animate"
              whileHover="hover"
            >
              <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
              
              {project.date && (
                <p className="text-light-700 mb-4">
                  Data: {new Date(project.date.seconds * 1000).toLocaleDateString('it-IT', { 
                    year: 'numeric', 
                    month: 'long' 
                  })}
                </p>
              )}
              
              {/* Tech Stack */}
              {project.tags && project.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, index) => (
                      <motion.span
                        key={index}
                        className="px-3 py-1 bg-light-200 text-primary-900 rounded-full text-sm font-medium"
                        whileHover={{ scale: 1.1 }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Project Links */}
              <div className="flex flex-col space-y-3">
                {project.repoUrl && (
                  <a 
                    href={project.repoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="glass-button inline-flex items-center justify-center"
                  >
                    <FaGithub className="mr-2" /> Vai al repository
                  </a>
                )}
                
                {project.demoUrl && (
                  <a 
                    href={project.demoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="glass-button inline-flex items-center justify-center"
                  >
                    <FaGlobe className="mr-2" /> Demo live
                  </a>
                )}
                
                {/* Admin Edit Link */}
                {isAdmin && (
                  <Link 
                    to={`/admin/edit/${project.id}`}
                    className="glass-button inline-flex items-center justify-center bg-light-200"
                  >
                    Modifica progetto
                  </Link>
                )}
              </div>
            </motion.div>
            
            {/* Features List */}
            {project.features && project.features.length > 0 && (
              <motion.div 
                className="glass-card"
                variants={glassCardVariant}
                initial="initial"
                animate="animate"
                whileHover="hover"
              >
                <h3 className="text-lg font-bold mb-4">Caratteristiche</h3>
                <ul className="space-y-2">
                  {project.features.map((feature, index) => (
                    <motion.li 
                      key={index}
                      className="flex items-start"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <span className="text-primary-400 mr-2">•</span>
                      <span className="text-light-800">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProjectDetail;