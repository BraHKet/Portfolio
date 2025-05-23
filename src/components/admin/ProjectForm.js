import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlus, FaTimes, FaSave, FaTrash } from 'react-icons/fa';
import { useFirestore } from '../../hooks/useFirestore';
import { glassCardVariant } from '../../utils/animations';

const ProjectForm = ({ project = null }) => {
  const { addDocument, updateDocument, deleteDocument, loading } = useFirestore('projects');
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!project;
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    images: [],
    tags: [],
    features: [],
    repoUrl: '',
    demoUrl: '',
    date: new Date()
  });
  
  // Form validation state
  const [errors, setErrors] = useState({});
  
  // Input states
  const [tagInput, setTagInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [imageInput, setImageInput] = useState('');
  
  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
  // Populate form data when editing
  useEffect(() => {
    if (project) {
      setFormData({
        ...project,
        date: project.date ? project.date : new Date(),
        images: project.images || [project.imageUrl || ''],
        tags: project.tags || [],
        features: project.features || []
      });
    }
  }, [project]);
  
  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };
  
  // Form input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Add tag
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };
  
  // Remove tag
  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };
  
  // Add feature
  const handleAddFeature = () => {
    if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput('');
    }
  };
  
  // Remove feature
  const handleRemoveFeature = (featureToRemove) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(feature => feature !== featureToRemove)
    }));
  };
  
  // Add image URL
  const handleAddImage = () => {
    if (imageInput.trim() && !formData.images.includes(imageInput.trim())) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageInput.trim()]
      }));
      setImageInput('');
    }
  };
  
  // Remove image URL
  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };
  
  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Il titolo è obbligatorio';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La descrizione è obbligatoria';
    }
    
    if (formData.images.length === 0) {
      newErrors.images = 'Almeno un\'immagine è obbligatoria';
    }
    
    if (formData.tags.length === 0) {
      newErrors.tags = 'Almeno un tag è obbligatorio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Correggi gli errori nel form', 'error');
      return;
    }
    
    try {
      // Prepare data for submission
      const projectData = {
        ...formData,
        imageUrl: formData.images[0] // Set first image as main image
      };
      
      if (isEditing) {
        await updateDocument(id, projectData);
        showToast('Progetto aggiornato con successo!');
      } else {
        await addDocument(projectData);
        showToast('Progetto creato con successo!');
        // Reset form after successful creation
        setFormData({
          title: '',
          description: '',
          imageUrl: '',
          images: [],
          tags: [],
          features: [],
          repoUrl: '',
          demoUrl: '',
          date: new Date()
        });
      }
    } catch (error) {
      console.error('Error saving project:', error);
      showToast('Si è verificato un errore durante il salvataggio', 'error');
    }
  };
  
  // Handle project deletion
  const handleDelete = async () => {
    if (!id) return;
    
    if (window.confirm('Sei sicuro di voler eliminare questo progetto? Questa azione non può essere annullata.')) {
      try {
        await deleteDocument(id);
        showToast('Progetto eliminato con successo!');
        navigate('/admin');
      } catch (error) {
        console.error('Error deleting project:', error);
        showToast('Si è verificato un errore durante l\'eliminazione', 'error');
      }
    }
  };
  
  // Handle cancel
  const handleCancel = () => {
    navigate('/admin');
  };
  
  return (
    <motion.div
      className="glass-card"
      variants={glassCardVariant}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary-300 to-secondary-300 bg-clip-text text-transparent">
          {isEditing ? 'Modifica Progetto' : 'Nuovo Progetto'}
        </h2>
        
        {/* Toast notification */}
        {toast.show && (
          <motion.div
            className={`p-4 rounded-lg mb-6 ${
              toast.type === 'error' 
                ? 'bg-red-400 bg-opacity-20 text-red-300' 
                : 'bg-green-400 bg-opacity-20 text-green-300'
            }`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {toast.message}
          </motion.div>
        )}
        
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Titolo <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`w-full glass p-3 focus:outline-none focus:ring-2 focus:ring-primary-400 ${
              errors.title ? 'border-red-400' : 'border-light-200'
            }`}
            placeholder="Titolo del progetto"
          />
          {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
        </div>
        
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Descrizione <span className="text-red-400">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="6"
            className={`w-full glass p-3 focus:outline-none focus:ring-2 focus:ring-primary-400 ${
              errors.description ? 'border-red-400' : 'border-light-200'
            }`}
            placeholder="Descrizione dettagliata del progetto"
          ></textarea>
          {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
        </div>
        
        {/* Images */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Immagini <span className="text-red-400">*</span>
          </label>
          <div className="flex items-center mb-2">
            <input
              type="text"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              className="flex-grow glass p-3 focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder="URL dell'immagine"
            />
            <motion.button
              type="button"
              onClick={handleAddImage}
              className="glass-button ml-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlus />
            </motion.button>
          </div>
          {errors.images && <p className="mt-1 text-sm text-red-400">{errors.images}</p>}
          
          {/* Image previews */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4">
            {formData.images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image || "/api/placeholder/100/100"}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-light-200"
                />
                <motion.button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 glass p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTimes size={12} />
                </motion.button>
                {index === 0 && (
                  <span className="absolute bottom-2 left-2 glass px-2 py-1 rounded text-xs">
                    Principale
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Tags */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Tag <span className="text-red-400">*</span>
          </label>
          <div className="flex items-center mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="flex-grow glass p-3 focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder="Aggiungi un tag (es. React, Firebase)"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <motion.button
              type="button"
              onClick={handleAddTag}
              className="glass-button ml-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlus />
            </motion.button>
          </div>
          {errors.tags && <p className="mt-1 text-sm text-red-400">{errors.tags}</p>}
          
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map((tag, index) => (
              <motion.span
                key={index}
                className="glass px-3 py-1 rounded-full text-sm inline-flex items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-light-700 hover:text-white"
                >
                  <FaTimes size={12} />
                </button>
              </motion.span>
            ))}
          </div>
        </div>
        
        {/* Features */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Caratteristiche
          </label>
          <div className="flex items-center mb-2">
            <input
              type="text"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              className="flex-grow glass p-3 focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder="Aggiungi una caratteristica del progetto"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddFeature();
                }
              }}
            />
            <motion.button
              type="button"
              onClick={handleAddFeature}
              className="glass-button ml-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlus />
            </motion.button>
          </div>
          
          <ul className="space-y-2 mt-2">
            {formData.features.map((feature, index) => (
              <motion.li
                key={index}
                className="glass p-2 rounded-lg flex items-center justify-between"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <span>{feature}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(feature)}
                  className="text-light-700 hover:text-white"
                >
                  <FaTimes size={16} />
                </button>
              </motion.li>
            ))}
          </ul>
        </div>
        
        {/* Repository URL */}
        <div>
          <label htmlFor="repoUrl" className="block text-sm font-medium mb-1">
            URL Repository
          </label>
          <input
            type="url"
            id="repoUrl"
            name="repoUrl"
            value={formData.repoUrl}
            onChange={handleInputChange}
            className="w-full glass p-3 focus:outline-none focus:ring-2 focus:ring-primary-400"
            placeholder="https://github.com/username/repository"
          />
        </div>
        
        {/* Demo URL */}
        <div>
          <label htmlFor="demoUrl" className="block text-sm font-medium mb-1">
            URL Demo
          </label>
          <input
            type="url"
            id="demoUrl"
            name="demoUrl"
            value={formData.demoUrl}
            onChange={handleInputChange}
            className="w-full glass p-3 focus:outline-none focus:ring-2 focus:ring-primary-400"
            placeholder="https://demo-site.com"
          />
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-between pt-4">
          <div>
            {isEditing && (
              <motion.button
                type="button"
                onClick={handleDelete}
                className="glass-button bg-red-400 bg-opacity-20 text-red-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
              >
                <FaTrash className="mr-2" /> Elimina
              </motion.button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <motion.button
              type="button"
              onClick={handleCancel}
              className="glass-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
            >
              Annulla
            </motion.button>
            
            <motion.button
              type="submit"
              className="glass-button bg-primary-400 bg-opacity-20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
            >
              <FaSave className="mr-2" />
              {loading ? 'Saving...' : (isEditing ? 'Aggiorna' : 'Salva')}
            </motion.button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default ProjectForm;