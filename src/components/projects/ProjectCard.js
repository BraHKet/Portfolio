import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

const ProjectCard = ({ project, index }) => {
  const { id, title, description, imageUrl, tags, status } = project;

  // Get status label and color - UPDATED: replaced 'planning' with 'archived'
  const getStatusInfo = (status) => {
    switch(status) {
      case 'completed':
        return { label: 'Completato', color: 'bg-green-500' };
      case 'in-progress':
        return { label: 'In Corso', color: 'bg-blue-500' };
      case 'archived':
        return { label: 'Archiviato', color: 'bg-gray-500' };
      default:
        return { label: 'Sconosciuto', color: 'bg-gray-500' };
    }
  };

  return (
    <Link to={`/projects/${id}`}>
      <motion.div 
        className="card overflow-hidden group cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 * index, duration: 0.5 }}
        whileHover={{ y: -5 }}
      >
        {/* Project Image */}
        <div className="aspect-project w-full overflow-hidden relative">
          <img 
            src={imageUrl || "/api/placeholder/400/250"} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Project Number */}
          <div className="absolute bottom-4 left-4">
            <div className="project-number">
              {String(index + 1).padStart(2, '0')}
            </div>
          </div>
          
          {/* Status Badge */}
          {status && (
            <div className="absolute top-4 right-4">
              <div className={`px-2 py-1 rounded-lg text-xs text-white font-medium ${getStatusInfo(status).color}`}>
                {getStatusInfo(status).label}
              </div>
            </div>
          )}
          
          {/* View Details Overlay */}
          <div className="absolute inset-0 bg-dark-800 bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="text-white font-medium flex items-center">
              View Details <FaArrowRight className="ml-2" />
            </span>
          </div>
        </div>
        
        {/* Project Info */}
        <div className="p-4">
          <h3 className="font-bold text-xl mb-2 transition-colors duration-300 group-hover:text-primary-500">
            {title}
          </h3>
          
          <p className="text-dark-500 line-clamp-2">
            {description}
          </p>
          
          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.slice(0, 3).map((tag, tagIndex) => (
                <span 
                  key={tagIndex} 
                  className="skill-tag bg-light-100 text-dark-600"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="skill-tag bg-light-100 text-dark-600">
                  +{tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
};

export default ProjectCard;