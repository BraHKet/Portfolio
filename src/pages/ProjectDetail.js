import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGithub, FaGlobe, FaArrowLeft, FaEdit, FaArrowRight, FaUserFriends, FaCalendarAlt, FaBuilding, FaClock, FaExclamationTriangle, FaLightbulb } from 'react-icons/fa';
import ImageCarousel from '../components/projects/ImageCarousel';
import { useFirestore } from '../hooks/useFirestore';
import { useAuth } from '../context/AuthContext';
import ReactMarkdown from 'react-markdown';

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
  
  // Get status label and color
  const getStatusInfo = (status) => {
    switch(status) {
      case 'completed':
        return { label: 'Completato', color: 'bg-green-500' };
      case 'in-progress':
        return { label: 'In Corso', color: 'bg-blue-500' };
      case 'planning':
        return { label: 'In Pianificazione', color: 'bg-yellow-500' };
      default:
        return { label: 'Sconosciuto', color: 'bg-gray-500' };
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
        <div className="flex justify-center items-center py-20">
          <div className="card p-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-t-4 border-b-4 border-primary-500 rounded-full animate-spin"></div>
              <p className="mt-4 text-dark-600">Loading project...</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="flex justify-center items-center py-20">
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
        </div>
      )}
      
      {/* Project Content */}
      {!loading && !error && project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Images */}
            <div className="lg:col-span-2">
              <ImageCarousel images={project.images || [project.imageUrl]} />
              
              {/* Project Description */}
              <motion.div 
                className="card p-6 mt-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold mb-6">
                  Descrizione
                </h2>
                
                <div className="prose max-w-none text-dark-600">
                  <ReactMarkdown>
                    {project.description}
                  </ReactMarkdown>
                </div>
              </motion.div>
              
              {/* Challenges and Solutions */}
              {(project.challenges || project.solution) && (
                <motion.div 
                  className="card p-6 mt-8"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {project.challenges && (
                      <div>
                        <h3 className="text-xl font-bold mb-4 flex items-center">
                          <FaExclamationTriangle className="mr-2 text-yellow-500" /> Sfide
                        </h3>
                        <div className="prose prose-sm max-w-none text-dark-600">
                          <ReactMarkdown>
                            {project.challenges}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )}
                    
                    {project.solution && (
                      <div>
                        <h3 className="text-xl font-bold mb-4 flex items-center">
                          <FaLightbulb className="mr-2 text-primary-500" /> Soluzione
                        </h3>
                        <div className="prose prose-sm max-w-none text-dark-600">
                          <ReactMarkdown>
                            {project.solution}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
              
              {/* Features List */}
              {project.features && project.features.length > 0 && (
                <motion.div 
                  className="card p-6 mt-8"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-xl font-bold mb-4">Caratteristiche</h3>
                  <ul className="space-y-3">
                    {project.features.map((feature, index) => (
                      <motion.li 
                        key={index}
                        className="flex items-start"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + (0.1 * index) }}
                      >
                        <span className="text-primary-500 mr-2 mt-1">•</span>
                        <span className="text-dark-600">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
              
              {/* Team Members */}
              {project.teamMembers && project.teamMembers.length > 0 && (
                <motion.div 
                  className="card p-6 mt-8"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <FaUserFriends className="mr-2 text-primary-500" /> Team
                  </h3>
                  
                  <ul className="space-y-2">
                    {project.teamMembers.map((member, index) => (
                      <motion.li 
                        key={index}
                        className="flex items-center p-2 rounded-lg bg-light-100"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + (0.1 * index) }}
                      >
                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mr-3">
                          {member.split(' ')[0][0]}
                        </div>
                        <span className="text-dark-600">{member}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
            
            {/* Right Column: Info */}
            <div className="lg:col-span-1">
              {/* Project Info */}
              <motion.div 
                className="card p-6 mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
                
                {/* Status Badge */}
                {project.status && (
                  <div className="mb-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusInfo(project.status).color}`}>
                      {getStatusInfo(project.status).label}
                    </span>
                  </div>
                )}
                
                {/* Client */}
                {project.client && (
                  <div className="flex items-center mb-4">
                    <FaBuilding className="text-dark-400 mr-2" />
                    <p className="text-dark-600">
                      <span className="font-medium">Cliente:</span> {project.client}
                    </p>
                  </div>
                )}
                
                {/* Duration */}
                {project.duration && (
                  <div className="flex items-center mb-4">
                    <FaClock className="text-dark-400 mr-2" />
                    <p className="text-dark-600">
                      <span className="font-medium">Durata:</span> {project.duration}
                    </p>
                  </div>
                )}
                
                {/* Date */}
                {project.date && (
                  <div className="flex items-center mb-4">
                    <FaCalendarAlt className="text-dark-400 mr-2" />
                    <p className="text-dark-600">
                      <span className="font-medium">Data:</span> {new Date(project.date.seconds * 1000).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long' 
                      })}
                    </p>
                  </div>
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
                    <a 
                      href={project.repoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-outline flex items-center justify-center"
                    >
                      <FaGithub className="mr-2" /> View Repository
                    </a>
                  )}
                  
                  {project.demoUrl && (
                    <a 
                      href={project.demoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-primary flex items-center justify-center"
                    >
                      <FaGlobe className="mr-2" /> Live Demo
                    </a>
                  )}
                  
                  {/* Admin Edit Link */}
                  {isAdmin && (
                    <Link 
                      to={`/admin/edit/${project.id}`}
                      className="btn-outline flex items-center justify-center"
                    >
                      <FaEdit className="mr-2" /> Edit Project
                    </Link>
                  )}
                </div>
              </motion.div>
              
              {/* Next Projects */}
              <motion.div 
                className="card p-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-xl font-bold mb-4">More Projects</h3>
                <Link to="/projects" className="btn-primary w-full flex items-center justify-center">
                  View All Projects <FaArrowRight className="ml-2" />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProjectDetail;