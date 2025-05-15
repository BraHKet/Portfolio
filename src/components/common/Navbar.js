import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser, isAdmin, signOut } = useAuth();
  const location = useLocation();
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when location changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      // Redirect handled by ProtectedRoute
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  // Nav items
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    ...(isAdmin ? [{ name: 'Admin', path: '/admin' }] : []),
    ...(currentUser 
      ? [{ name: 'Logout', onClick: handleLogout }] 
      : [{ name: 'Login', path: '/login' }])
  ];

  return (
    <motion.nav 
      className={`bg-white sticky top-0 z-50 py-5 ${
        scrolled ? 'shadow-md' : ''
      } transition-shadow duration-300`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <motion.div 
            className="text-xl md:text-2xl font-bold relative flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-dark-800">L </span>
            <span className="inline-block w-2 h-2 bg-primary-500 rounded-full ml-0.5"></span>
            <span className="text-dark-800 ml-0.5"> renzo</span>
          </motion.div>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-10 items-center">
          {navItems.map((item, index) => (
            <motion.div
              key={`nav-${index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {item.path ? (
                <Link 
                  to={item.path} 
                  className={`font-medium relative ${
                    location.pathname === item.path 
                      ? 'text-primary-500' 
                      : 'text-dark-600 hover:text-primary-500'
                  } transition-colors duration-300 group`}
                >
                  {item.name}
                  {location.pathname === item.path && (
                    <motion.span 
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 -mb-1.5"
                      layoutId="underline"
                    />
                  )}
                </Link>
              ) : (
                <button
                  onClick={item.onClick}
                  className="text-dark-600 hover:text-primary-500 transition-colors duration-300 font-medium"
                >
                  {item.name}
                </button>
              )}
            </motion.div>
          ))}
          
          {!currentUser && (
            <Link to="/login">
              <motion.button 
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact
              </motion.button>
            </Link>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <motion.button
            className="p-1 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {isOpen ? (
              <FaTimes size={24} className="text-dark-800" />
            ) : (
              <FaBars size={24} className="text-dark-800" />
            )}
          </motion.button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="md:hidden bg-white shadow-lg absolute left-0 right-0 z-40"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-6 py-6 flex flex-col space-y-4">
              {navItems.map((item, index) => (
                <motion.div
                  key={`mobile-nav-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item.path ? (
                    <Link 
                      to={item.path} 
                      className={`block py-2 ${
                        location.pathname === item.path 
                          ? 'text-primary-500 font-medium' 
                          : 'text-dark-800'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <button
                      onClick={item.onClick}
                      className="block w-full text-left py-2 text-dark-800"
                    >
                      {item.name}
                    </button>
                  )}
                </motion.div>
              ))}
              
              {!currentUser && (
                <Link to="/login" className="block">
                  <motion.button 
                    className="btn-primary w-full mt-4"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Contact
                  </motion.button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;