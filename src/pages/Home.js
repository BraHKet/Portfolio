import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import HeroSection from '../components/home/HeroSection';
import { useFirestore } from '../hooks/useFirestore';
import ProjectCard from '../components/projects/ProjectCard';

const Home = () => {
  const { documents: projects, loading, getDocuments } = useFirestore('projects');
  
  // Fetch projects on mount
  useEffect(() => {
    getDocuments();
  }, [getDocuments]);
  
  // Projects data for test (use this if Firestore is empty or has issues)
  const demoProjects = [
    {
      id: 'demo1',
      title: 'Portfolio Website',
      description: 'A modern portfolio website built with React and Tailwind CSS.',
      imageUrl: '/api/placeholder/600/400',
      tags: ['React', 'Tailwind', 'Framer Motion']
    },
    {
      id: 'demo2',
      title: 'E-commerce App',
      description: 'Full-featured online store with shopping cart and payment integration.',
      imageUrl: '/api/placeholder/600/400',
      tags: ['React', 'Firebase', 'Stripe']
    },
    {
      id: 'demo3',
      title: 'Weather Dashboard',
      description: 'Real-time weather application with location-based forecasts.',
      imageUrl: '/api/placeholder/600/400',
      tags: ['JavaScript', 'API', 'CSS']
    }
  ];
  
  // Use demo projects if there are no projects from Firestore
  const displayProjects = projects.length > 0 ? projects : demoProjects;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section with Background */}
      <div className="relative bg-white overflow-hidden">
        <HeroSection />
      </div>
      
      {/* Projects Section with Background */}
      <section className="py-20 bg-light-50">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Ultimi progetti
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Link to="/projects" className="group inline-flex items-center text-dark-800 hover:text-primary-500 transition-colors duration-300 font-medium">
                <span className="mr-2">See All</span>
                <FaArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProjects.slice(0, 3).map((project, index) => (
              <Link to={`/projects/${project.id}`} key={project.id}>
                <motion.div 
                  className="card overflow-hidden group cursor-pointer h-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  whileHover={{ y: -5 }}
                >
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
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-3 transition-colors duration-300 group-hover:text-primary-500">
                      {project.title}
                    </h3>
                    
                    <p className="text-dark-500 line-clamp-2 mb-4">
                      {project.description}
                    </p>
                    
                    {/* Tags */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {project.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span 
                            key={tagIndex} 
                            className="skill-tag bg-light-100 text-dark-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* About Me / Call To Action */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Lavoriamo Insieme
            </motion.h2>
            
            <motion.p 
              className="text-lg text-dark-600 mb-10 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Hai un’idea, un progetto in mente o semplicemente una passione per il mondo delle startup? Uniamo le forze e creiamo qualcosa di grande insieme! Cerco persone con voglia di fare e spirito di squadra: costruiamo un TEAM!
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <a href="mailto:lore.mail.gl@gmail.com">
                <button className="btn-primary px-8 py-3 text-lg">Contattami</button>
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;