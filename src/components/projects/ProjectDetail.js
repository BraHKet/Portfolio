// src/pages/ProjectDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGithub, FaGlobe, FaArrowLeft, FaEdit, FaArrowRight } from 'react-icons/fa';
import ImageCarousel from '../components/projects/ImageCarousel';
import { useFirestore } from '../hooks/useFirestore';
import { useAuth } from '../context/AuthContext';

const ProjectDetail = () => {
  const { id } = useParams();
  const { getDocument, document: project, loading, error } = useFirestore('projects');
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Fetch project on mount
  useEffect(() => {
    const fetchData = async () => {
      await getDocument(id);
      setIsLoaded(true);
    };
    
    fetchData();
  }, [getDocument, id]);
  
  // Handle back button
  const handleBack = () => {
    navigate('/projects');
  };
  
  // Content animation
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };
  
  // Item animation
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-10">
      {/* Back button */}
      <motion.button
        className="flex items-center text-dark-600 hover:text-primary-500 transition-colors duration-300 mb-8"
        onClick={handleBack}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FaArrowLeft className="mr-2" /> Back to Projects
      </motion.button>
      
      {/* Loading State */}
      {loading && (
        <motion.div 
          className="flex justify-center items-center py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="card p-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-t-4 border-b-4 border-primary-500 rounded-full animate-spin"></div>
              <p className="mt-4 text-dark-600">Loading project...</p>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Error State */}
      {!loading && error && (
        <motion.div 
          className="flex justify-center items-center py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="card p-8 text-center text-red-500">
            <p className="mb-4">An error occurred while loading the project.</p>
            <div className="flex justify-center space-x-4">
              <motion.button
                className="btn-primary"
                onClick={() => getDocument(id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Try Again
              </motion.button>
              
              <motion.button
                className="btn-outline"
                onClick={handleBack}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Back to Projects
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Project Content */}
      {!loading && !error && project && isLoaded && (
        <motion.div
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Images */}
            <motion.div 
              className="lg:col-span-2"
              variants={itemVariants}
            >
              <ImageCarousel images={project.images || [project.imageUrl]} />
              
              {/* Project Description */}
              <motion.div 
                className="card p-6 mt-8"
                variants={itemVariants}
              >
                <h2 className="text-2xl font-bold mb-6">
                  Description
                </h2>
                
                <div className="prose max-w-none text-dark-600">
                  <p className="whitespace-pre-line">{project.description}</p>
                </div>
              </motion.div>
              
              {/* Features List */}
              {project.features && project.features.length > 0 && (
                <motion.div 
                  className="card p-6 mt-8"
                  variants={itemVariants}
                >
                  <h3 className="text-xl font-bold mb-4">Features</h3>
                  
                  <ul className="space-y-3">
                    {project.features.map((feature, index) => (
                      <motion.li 
                        key={index}
                        className="flex items-start"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ 
                          opacity: 1, 
                          x: 0, 
                          transition: { 
                            delay: 0.5 + (index * 0.1),
                            duration: 0.3
                          }
                        }}
                      >
                        <span className="text-primary-500 mr-2 mt-1">•</span>
                        <span className="text-dark-600">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </motion.div>
            
            {/* Right Column: Info */}
            <motion.div 
              className="lg:col-span-1"
              variants={itemVariants}
            >
              {/* Project Info */}
              <motion.div 
                className="card p-6 mb-8"
                variants={itemVariants}
              >
                <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
                
                {project.date && (
                  <p className="text-dark-500 mb-4">
                    Date: {new Date(project.date.seconds * 1000).toLocaleDateString('en-US', { 
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
                          className="skill-tag bg-light-100 text-dark-600"
                          whileHover={{ scale: 1.05 }}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ 
                            opacity: 1, 
                            y: 0,
                            transition: { 
                              delay: 0.8 + (index * 0.05),
                              duration: 0.2
                            }
                          }}
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Project Links */}
                <div className="flex flex-col space-y-4">
                  {project.repoUrl && (
                    <motion.a 
                      href={project.repoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-outline flex items-center justify-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        transition: { delay: 0.9, duration: 0.3 }
                      }}
                    >
                      <FaGithub className="mr-2" /> View Repository
                    </motion.a>
                  )}
                  
                  {project.demoUrl && (
                    <motion.a 
                      href={project.demoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-primary flex items-center justify-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        transition: { delay: 1.0, duration: 0.3 }
                      }}
                    >
                      <FaGlobe className="mr-2" /> Live Demo
                    </motion.a>
                  )}
                  
                  {/* Admin Edit Link */}
                  {isAdmin && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        transition: { delay: 1.1, duration: 0.3 }
                      }}
                    >
                      <Link 
                        to={`/admin/edit/${project.id}`}
                        className="btn-outline flex items-center justify-center"
                      >
                        <FaEdit className="mr-2" /> Edit Project
                      </Link>
                    </motion.div>
                  )}
                </div>
              </motion.div>
              
              {/* Next Projects */}
              <motion.div 
                className="card p-6"
                variants={itemVariants}
              >
                <h3 className="text-xl font-bold mb-4">More Projects</h3>
                <Link to="/projects" className="btn-primary w-full flex items-center justify-center">
                  View All Projects <FaArrowRight className="ml-2" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProjectDetail;