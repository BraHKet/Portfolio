import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  
  // Handle image navigation
  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };
  
  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };
  
  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxOpen) {
        switch (e.key) {
          case 'ArrowLeft':
            prevImage();
            break;
          case 'ArrowRight':
            nextImage();
            break;
          case 'Escape':
            setLightboxOpen(false);
            break;
          default:
            break;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);
  
  // If no images, return a placeholder
  if (!images || images.length === 0) {
    return (
      <div className="card flex items-center justify-center h-64">
        <p className="text-dark-500">No images available</p>
      </div>
    );
  }
  
  return (
    <>
      {/* Carousel */}
      <div className="card overflow-hidden relative">
        <div className="relative aspect-[16/9] w-full">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={images[currentIndex] || "/api/placeholder/800/450"}
              alt={`Project image ${currentIndex + 1}`}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setLightboxOpen(true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>
          
          {/* Image counter */}
          <div className="absolute bottom-4 right-4 bg-dark-800 text-white px-3 py-1 rounded-lg text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
        
        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <motion.button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white text-dark-800 p-2 rounded-full shadow-md"
              onClick={prevImage}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Previous image"
            >
              <FaChevronLeft />
            </motion.button>
            
            <motion.button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white text-dark-800 p-2 rounded-full shadow-md"
              onClick={nextImage}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Next image"
            >
              <FaChevronRight />
            </motion.button>
          </>
        )}
        
        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex mt-4 px-4 pb-4 space-x-2 overflow-x-auto">
            {images.map((image, index) => (
              <motion.button
                key={index}
                className={`h-20 w-28 rounded-md overflow-hidden flex-shrink-0 ${
                  index === currentIndex 
                    ? 'ring-2 ring-primary-500' 
                    : 'ring-1 ring-light-200 hover:ring-primary-300'
                }`}
                onClick={() => setCurrentIndex(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src={image || "/api/placeholder/100/100"}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.button>
            ))}
          </div>
        )}
      </div>
      
      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900 bg-opacity-90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              className="absolute top-4 right-4 bg-white text-dark-800 p-2 rounded-full z-10 shadow-lg"
              onClick={() => setLightboxOpen(false)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Close lightbox"
            >
              <FaTimes />
            </motion.button>
            
            <div className="relative w-full h-full flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  src={images[currentIndex] || "/api/placeholder/1200/800"}
                  alt={`Project image ${currentIndex + 1}`}
                  className="max-w-full max-h-full object-contain p-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>
              
              {images.length > 1 && (
                <>
                  <motion.button
                    className="absolute left-4 bg-white text-dark-800 p-3 rounded-full shadow-lg"
                    onClick={prevImage}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Previous image"
                  >
                    <FaChevronLeft size={20} />
                  </motion.button>
                  
                  <motion.button
                    className="absolute right-4 bg-white text-dark-800 p-3 rounded-full shadow-lg"
                    onClick={nextImage}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Next image"
                  >
                    <FaChevronRight size={20} />
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImageCarousel;