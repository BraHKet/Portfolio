import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
// Importa la tua foto
import profileImage from '../../assets/images/profile.jpg'; // Assicurati che il percorso sia corretto

const HeroSection = () => {
  // Skills/technologies to showcase
  const skills = [
    { name: 'HTML', color: 'bg-primary-500 text-white' },
    { name: 'CSS', color: 'bg-blue-500 text-white' },
    { name: 'JavaScript', color: 'bg-yellow-500 text-dark-800' },
  ];

  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between lg:gap-12">
          {/* Left Column: Text Content */}
          <motion.div 
            className="lg:w-1/2 z-10 order-2 lg:order-1 mt-12 lg:mt-0"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              My name is <span className="block">Jacob</span>
            </motion.h1>
            
            <motion.div 
              className="flex flex-wrap gap-3 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {skills.map((skill, index) => (
                <span 
                  key={index} 
                  className={`skill-tag ${skill.color}`}
                >
                  {skill.name}
                </span>
              ))}
            </motion.div>
            
            <motion.div
              className="bg-dark-800 text-white px-5 py-3 rounded-xl inline-flex items-center mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <span className="font-bold mr-2">10+</span> 
              <span className="text-sm">Completed Projects</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <Link to="/projects">
                <button className="btn-primary">View Projects</button>
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Right Column: Image with Shape */}
          <motion.div 
            className="lg:w-1/2 order-1 lg:order-2 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Background Shape */}
            <div className="absolute inset-0 -right-20 -top-20 z-0">
              <motion.div
                className="w-[140%] h-[140%] bg-primary-500 rounded-full opacity-90"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.9 }}
                transition={{ delay: 0.2, duration: 1 }}
              />
            </div>
            
            {/* Profile Image - Usa la tua foto importata */}
            <motion.div 
              className="relative z-10 rounded-full overflow-hidden border-4 border-white shadow-xl w-72 h-72 md:w-96 md:h-96 mx-auto"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <img 
                src={profileImage} 
                alt="Your Name - Profile" 
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            {/* Experience Badge */}
            <motion.div 
              className="absolute top-5 lg:top-16 right-10 lg:right-0 bg-dark-800 text-white px-5 py-3 rounded-xl flex items-center shadow-lg z-20"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <span className="font-bold mr-2">10+</span> 
              <span className="text-sm">Years<br/>Experience</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;