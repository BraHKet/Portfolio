import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // Social media links
  const socialLinks = [
    {
      name: 'GitHub',
      url: '',
      icon: <FaGithub size={18} />
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/lorenzo-rizzo-a97878184/',
      icon: <FaLinkedin size={18} />
    },
    {
      name: 'Email',
      url: 'mailto:lore.mail.gl@gmail.com',
      icon: <FaEnvelope size={18} />
    }
  ];

  return (
    <footer className="mt-20 border-t border-light-200 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo & Copyright */}
          <motion.div 
            className="mb-4 md:mb-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/" className="flex items-center mb-2">
              <span className="text-xl font-bold font-heading relative">
                <span className="text-dark-800">L </span>
                <span className="inline-block w-2 h-2 bg-primary-500 rounded-full ml-0.5"></span>
                <span className="text-dark-800"> renzo</span>
              </span>
            </Link>
            <p className="text-sm text-dark-500">
              © {currentYear} Lorenzo. All rights reserved.
            </p>
          </motion.div>
          
          {/* Links */}
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
            {/* Navigation Links */}
            <div className="flex space-x-6">
              <Link to="/" className="text-dark-500 hover:text-primary-500 transition-colors duration-300 text-sm">
                Home
              </Link>
              <Link to="/projects" className="text-dark-500 hover:text-primary-500 transition-colors duration-300 text-sm">
                Progetti
              </Link>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark-500 hover:text-primary-500 transition-colors duration-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + (index * 0.1) }}
                  whileHover={{ y: -3 }}
                  aria-label={link.name}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;