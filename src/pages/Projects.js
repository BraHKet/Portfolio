import React from 'react';
import { motion } from 'framer-motion';
import ProjectGrid from '../components/projects/ProjectGrid';

const Projects = () => {
  return (
    <motion.div
      className="container mx-auto px-4 py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Page Header */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          My Projects
        </h1>
        <p className="text-dark-500 max-w-2xl">
          Explore the projects I've worked on, from web applications to computational physics simulations.
          Each project represents a unique challenge and solution.
        </p>
      </motion.div>
      
      {/* Projects Grid */}
      <ProjectGrid />
    </motion.div>
  );
};

export default Projects;