// src/components/projects/ProjectGrid.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useFirestore } from '../../hooks/useFirestore';

const ProjectGrid = () => {
  const { documents: projects, loading, error, getDocuments } = useFirestore('projects');
  const [filter, setFilter] = useState('all');
  const [filteredProjects, setFilteredProjects] = useState([]);
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
    
    if (filter === 'all') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(
        projects.filter(project => 
          project.tags && project.tags.includes(filter)
        )
      );
    }
  }, [filter, projects]);
  
  // Handle filter change
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
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

  // Item animation settings
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      transition: { duration: 0.3 }
    },
    hover: { y: -5, transition: { duration: 0.2 } }
  };

  return (
    <div className="w-full">
      {/* Filter Tabs */}
      {allTags.length > 0 && (
        <div className="mb-10 overflow-x-auto">
          <div className="flex space-x-3 min-w-max pb-2">
            <motion.button
              className={`px-4 py-2 rounded-lg font-medium border ${
                filter === 'all' 
                  ? 'bg-primary-500 text-white border-primary-500' 
                  : 'border-light-300 text-dark-600 hover:border-primary-500 hover:text-primary-500'
              } transition-colors duration-300`}
              onClick={() => handleFilterChange('all')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              All
            </motion.button>
            
            {allTags.map(tag => (
              <motion.button
                key={tag}
                className={`px-4 py-2 rounded-lg font-medium border ${
                  filter === tag 
                    ? 'bg-primary-500 text-white border-primary-500' 
                    : 'border-light-300 text-dark-600 hover:border-primary-500 hover:text-primary-500'
                } transition-colors duration-300`}
                onClick={() => handleFilterChange(tag)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {tag}
              </motion.button>
            ))}
          </div>
        </div>
      )}
      
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
              <p className="mt-4 text-dark-600">Loading projects...</p>
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
              {filter === 'all' 
                ? 'No projects available at the moment.'
                : `No projects found with the tag "${filter}".`}
            </p>
            {filter !== 'all' && (
              <motion.button
                className="btn-primary"
                onClick={() => setFilter('all')}
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
            <motion.div 
              key={project.id}
              variants={itemVariants}
              whileHover="hover"
              layout
            >
              <Link to={`/projects/${project.id}`}>
                <div className="card overflow-hidden group cursor-pointer h-full">
                  {/* Project Image */}
                  <div className="aspect-project w-full overflow-hidden relative">
                    <img 
                      src={project.imageUrl || "/api/placeholder/400/250"} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Project Number */}
                    <div className="absolute bottom-4 left-4">
                      <div className="project-number">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                    </div>
                  </div>
                  
                  {/* Project Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-xl mb-2 transition-colors duration-300 group-hover:text-primary-500">
                      {project.title}
                    </h3>
                    
                    <p className="text-dark-500 line-clamp-2">
                      {project.description}
                    </p>
                    
                    {/* Tags */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {project.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span 
                            key={tagIndex} 
                            className="skill-tag bg-light-100 text-dark-600"
                          >
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="skill-tag bg-light-100 text-dark-600">
                            +{project.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ProjectGrid;