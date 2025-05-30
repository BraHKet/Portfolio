// src/components/projects/ProjectGrid.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaSpinner, FaArchive } from 'react-icons/fa';
import { useFirestore } from '../../hooks/useFirestore';
import ProjectCard from './ProjectCard';

const ProjectGrid = () => {
  const { documents: projects, loading, error, getDocuments } = useFirestore('projects');
  const [filter, setFilter] = useState('all');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [mounted, setMounted] = useState(false);
  
  // Get all tags from projects
  const allTags = React.useMemo(() => {
    if (!projects || !projects.length) return [];
    
    const tags = projects.reduce((acc, project) => {
      if (project.tags && Array.isArray(project.tags)) {
        project.tags.forEach(tag => {
          if (!acc.includes(tag)) {
            acc.push(tag);
          }
        });
      }
      return acc;
    }, []);
    
    return tags;
  }, [projects]);
  
  // Fetch projects on mount (only once)
  useEffect(() => {
    const fetchData = async () => {
      await getDocuments();
      setMounted(true);
    };
    
    if (!mounted) {
      fetchData();
    }
  }, [getDocuments, mounted]);
  
  // Filter projects when filter or projects change
  useEffect(() => {
    if (!projects) return;
    
    let filtered = [...projects];
    
    // Apply tag filter
    if (filter !== 'all') {
      filtered = filtered.filter(project => 
        project.tags && project.tags.includes(filter)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => 
        project.status === statusFilter
      );
    }
    
    setFilteredProjects(filtered);
  }, [filter, statusFilter, projects]);
  
  // Handle tag filter change
  const handleTagFilterChange = (newFilter) => {
    setFilter(newFilter);
  };
  
  // Handle status filter change
  const handleStatusFilterChange = (newFilter) => {
    setStatusFilter(newFilter);
  };

  // Container animation settings
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05, 
        delayChildren: 0.2,
        duration: 0.5
      }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 } 
    }
  };

  return (
    <div className="w-full">
      {/* Filter Tabs */}
      <div className="mb-10">
        {/* Status Filter */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Stato Progetto</h3>
          <div className="flex flex-wrap gap-3">
            <motion.button
              className={`px-4 py-2 rounded-lg font-medium border flex items-center ${
                statusFilter === 'all' 
                  ? 'bg-primary-500 text-white border-primary-500' 
                  : 'border-light-300 text-dark-600 hover:border-primary-500 hover:text-primary-500'
              } transition-colors duration-300`}
              onClick={() => handleStatusFilterChange('all')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Tutti
            </motion.button>
            
            <motion.button
              className={`px-4 py-2 rounded-lg font-medium border flex items-center ${
                statusFilter === 'completed' 
                  ? 'bg-green-500 text-white border-green-500' 
                  : 'border-light-300 text-dark-600 hover:border-green-500 hover:text-green-700'
              } transition-colors duration-300`}
              onClick={() => handleStatusFilterChange('completed')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <FaCheck className="mr-2" /> Completati
            </motion.button>
            
            <motion.button
              className={`px-4 py-2 rounded-lg font-medium border flex items-center ${
                statusFilter === 'in-progress' 
                  ? 'bg-blue-500 text-white border-blue-500' 
                  : 'border-light-300 text-dark-600 hover:border-blue-500 hover:text-blue-700'
              } transition-colors duration-300`}
              onClick={() => handleStatusFilterChange('in-progress')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <FaSpinner className="mr-2" /> In Corso
            </motion.button>
            
            <motion.button
              className={`px-4 py-2 rounded-lg font-medium border flex items-center ${
                statusFilter === 'archived' 
                  ? 'bg-gray-500 text-white border-gray-500' 
                  : 'border-light-300 text-dark-600 hover:border-gray-500 hover:text-gray-700'
              } transition-colors duration-300`}
              onClick={() => handleStatusFilterChange('archived')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <FaArchive className="mr-2" /> Archiviati
            </motion.button>
          </div>
        </div>
        
        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-3">Tecnologie</h3>
            <div className="flex space-x-3 overflow-x-auto pb-2">
              <motion.button
                className={`px-4 py-2 rounded-lg font-medium border ${
                  filter === 'all' 
                    ? 'bg-primary-500 text-white border-primary-500' 
                    : 'border-light-300 text-dark-600 hover:border-primary-500 hover:text-primary-500'
                } transition-colors duration-300`}
                onClick={() => handleTagFilterChange('all')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Tutti
              </motion.button>
              
              {allTags.map(tag => (
                <motion.button
                  key={tag}
                  className={`px-4 py-2 rounded-lg font-medium border whitespace-nowrap ${
                    filter === tag 
                      ? 'bg-primary-500 text-white border-primary-500' 
                      : 'border-light-300 text-dark-600 hover:border-primary-500 hover:text-primary-500'
                  } transition-colors duration-300`}
                  onClick={() => handleTagFilterChange(tag)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {tag}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Loading State */}
      {loading && (
        <motion.div 
          className="flex justify-center items-center py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="card p-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-t-4 border-b-4 border-primary-500 rounded-full animate-spin"></div>
              <p className="mt-4 text-dark-600">Caricamento progetti...</p>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Error State */}
      {error && (
        <motion.div 
          className="flex justify-center items-center py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="card p-8 text-center text-red-500">
            <p className="mb-4">An error occurred while loading the projects.</p>
            <motion.button
              className="btn-primary"
              onClick={() => getDocuments(undefined, true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Try Again
            </motion.button>
          </div>
        </motion.div>
      )}
      
      {/* Empty State */}
      {!loading && !error && filteredProjects && filteredProjects.length === 0 && (
        <motion.div 
          className="flex justify-center items-center py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="card p-8 text-center">
            <p className="mb-4">
              {filter === 'all' && statusFilter === 'all'
                ? 'No projects available at the moment.'
                : `No projects found with the selected filters.`}
            </p>
            {(filter !== 'all' || statusFilter !== 'all') && (
              <motion.button
                className="btn-primary"
                onClick={() => {
                  setFilter('all');
                  setStatusFilter('all');
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Show all projects
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
      
      {/* Projects Grid */}
      {!loading && !error && filteredProjects && filteredProjects.length > 0 && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ProjectGrid;