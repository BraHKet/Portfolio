import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTimes, FaSave, FaTrash, FaUserFriends, FaCodeBranch, FaCalendarAlt } from 'react-icons/fa';
import { useFirestore } from '../../hooks/useFirestore';
import { glassCardVariant } from '../../utils/animations';
import ReactMarkdown from 'react-markdown';

const ProjectForm = ({ project = null }) => {
  const { addDocument, updateDocument, deleteDocument, loading } = useFirestore('projects');
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!project || !!id;
  
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
    date: new Date(),
    status: 'completed', // completed, in-progress, archived
    teamMembers: [],
    client: '',
    duration: '',
    challenges: '',
    solution: ''
  });
  
  // Preview mode for markdown
  const [previewMode, setPreviewMode] = useState(false);
  
  // Form validation state
  const [errors, setErrors] = useState({});
  
  // Input states
  const [tagInput, setTagInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [imageInput, setImageInput] = useState('');
  const [teamMemberInput, setTeamMemberInput] = useState('');
  
  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
  // Status options
  const statusOptions = [
    { value: 'completed', label: 'Completato' },
    { value: 'in-progress', label: 'In Corso' },
    { value: 'archived', label: 'Archiviato' }
  ];
  
  // Populate form data when editing - FIXED: Proper data handling
  useEffect(() => {
    console.log('🔄 ProjectForm useEffect - project:', project);
    if (project) {
      console.log('📝 Populating form with project data:', project);
      
      // Handle date conversion properly
      let projectDate = new Date();
      if (project.date) {
        if (project.date.seconds) {
          // Firestore Timestamp
          projectDate = new Date(project.date.seconds * 1000);
        } else if (project.date instanceof Date) {
          projectDate = project.date;
        } else {
          projectDate = new Date(project.date);
        }
      }
      
      const updatedFormData = {
        title: project.title || '',
        description: project.description || '',
        imageUrl: project.imageUrl || '',
        images: project.images || (project.imageUrl ? [project.imageUrl] : []),
        tags: project.tags || [],
        features: project.features || [],
        repoUrl: project.repoUrl || '',
        demoUrl: project.demoUrl || '',
        date: projectDate,
        status: project.status || 'completed',
        teamMembers: project.teamMembers || [],
        client: project.client || '',
        duration: project.duration || '',
        challenges: project.challenges || '',
        solution: project.solution || ''
      };
      
      console.log('📝 Updated form data:', updatedFormData);
      setFormData(updatedFormData);
    }
  }, [project]);
  
  // Show toast notification
  const showToast = (message, type = 'success') => {
    console.log(`🍞 Toast: ${type} - ${message}`);
    setToast({ show: true, message, type });
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };
  
  // Form input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`📝 Input change: ${name} = ${value}`);
    
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      console.log('📝 Updated form data:', updated);
      return updated;
    });
    
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
      console.log('🏷️ Added tag:', tagInput.trim());
    }
  };
  
  // Remove tag
  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
    console.log('🗑️ Removed tag:', tagToRemove);
  };
  
  // Add team member
  const handleAddTeamMember = () => {
    if (teamMemberInput.trim() && !formData.teamMembers.includes(teamMemberInput.trim())) {
      setFormData(prev => ({
        ...prev,
        teamMembers: [...prev.teamMembers, teamMemberInput.trim()]
      }));
      setTeamMemberInput('');
      console.log('👥 Added team member:', teamMemberInput.trim());
    }
  };
  
  // Remove team member
  const handleRemoveTeamMember = (memberToRemove) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter(member => member !== memberToRemove)
    }));
    console.log('🗑️ Removed team member:', memberToRemove);
  };
  
  // Add feature
  const handleAddFeature = () => {
    if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput('');
      console.log('✨ Added feature:', featureInput.trim());
    }
  };
  
  // Remove feature
  const handleRemoveFeature = (featureToRemove) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(feature => feature !== featureToRemove)
    }));
    console.log('🗑️ Removed feature:', featureToRemove);
  };
  
  // Add image URL
  const handleAddImage = () => {
    if (imageInput.trim() && !formData.images.includes(imageInput.trim())) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageInput.trim()]
      }));
      setImageInput('');
      console.log('🖼️ Added image:', imageInput.trim());
    }
  };
  
  // Remove image URL
  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    console.log('🗑️ Removed image at index:', index);
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
    console.log('✅ Form validation errors:', newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Form submission - FIXED: Proper data preparation and error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🚀 Form submission started');
    console.log('📊 Current form data:', formData);
    
    if (!validateForm()) {
      showToast('Correggi gli errori nel form', 'error');
      return;
    }
    
    try {
      // Prepare data for submission - FIXED: Proper data structure
      const projectData = {
        ...formData,
        imageUrl: formData.images[0] || '', // Set first image as main image
        updatedAt: new Date() // Always add updated timestamp
      };
      
      // Remove any undefined values and clean data
      Object.keys(projectData).forEach(key => {
        if (projectData[key] === undefined) {
          delete projectData[key];
        }
      });
      
      console.log('💾 Prepared project data for submission:', projectData);
      
      if (isEditing) {
        console.log('📝 Updating project with ID:', id);
        const result = await updateDocument(id, projectData);
        console.log('✅ Update result:', result);
        
        if (result) {
          showToast('Progetto aggiornato con successo!');
          // Navigate back to admin after successful update
          setTimeout(() => {
            navigate('/admin');
          }, 1500);
        } else {
          throw new Error('Update failed');
        }
      } else {
        console.log('🆕 Creating new project');
        projectData.createdAt = new Date(); // Add creation timestamp for new projects
        
        const result = await addDocument(projectData);
        console.log('✅ Creation result:', result);
        
        if (result) {
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
            date: new Date(),
            status: 'completed',
            teamMembers: [],
            client: '',
            duration: '',
            challenges: '',
            solution: ''
          });
        } else {
          throw new Error('Creation failed');
        }
      }
    } catch (error) {
      console.error('❌ Error saving project:', error);
      showToast(`Si è verificato un errore durante il salvataggio: ${error.message}`, 'error');
    }
  };
  
  // Handle project deletion
  const handleDelete = async () => {
    if (!id) return;
    
    if (window.confirm('Sei sicuro di voler eliminare questo progetto? Questa azione non può essere annullata.')) {
      try {
        console.log('🗑️ Deleting project with ID:', id);
        const result = await deleteDocument(id);
        
        if (result) {
          showToast('Progetto eliminato con successo!');
          navigate('/admin');
        } else {
          throw new Error('Deletion failed');
        }
      } catch (error) {
        console.error('❌ Error deleting project:', error);
        showToast(`Si è verificato un errore durante l'eliminazione: ${error.message}`, 'error');
      }
    }
  };
  
  // Handle cancel
  const handleCancel = () => {
    navigate('/admin');
  };
  
  // Toggle preview mode
  const togglePreviewMode = () => {
    setPreviewMode(!previewMode);
  };
  
  // Debug current form state
  useEffect(() => {
    console.log('🔍 Current form data state:', formData);
  }, [formData]);
  
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
        <AnimatePresence>
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
        </AnimatePresence>
        
        {/* Basic Info Section */}
        <div className="p-4 glass mb-4">
          <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-primary-300 to-secondary-300 bg-clip-text text-transparent">
            Informazioni Base
          </h3>
          
          {/* Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Titolo <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full glass p-3 focus:outline-none focus:ring-2 focus:ring-primary-400 border ${
                errors.title ? 'border-red-400' : 'border-light-200'
              }`}
              placeholder="Titolo del progetto"
            />
            {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
          </div>
          
          {/* Client */}
          <div className="mb-4">
            <label htmlFor="client" className="block text-sm font-medium mb-1">
              Cliente
            </label>
            <input
              type="text"
              id="client"
              name="client"
              value={formData.client}
              onChange={handleInputChange}
              className="w-full glass p-3 focus:outline-none focus:ring-2 focus:ring-primary-400 border border-light-200"
              placeholder="Nome del cliente o azienda"
            />
          </div>
          
          {/* Status */}
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium mb-1">
              Stato del Progetto
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full glass p-3 focus:outline-none focus:ring-2 focus:ring-primary-400 border border-light-200"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Duration */}
          <div>
            <label htmlFor="duration" className="block text-sm font-medium mb-1">
              Durata
            </label>
            <input
              type="text"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              className="w-full glass p-3 focus:outline-none focus:ring-2 focus:ring-primary-400 border border-light-200"
              placeholder="Es. 2 mesi, Gennaio - Marzo 2023"
            />
          </div>
        </div>
        
        {/* Description Section */}
        <div className="p-4 glass mb-4">
          <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-primary-300 to-secondary-300 bg-clip-text text-transparent">
            Descrizione
          </h3>
          
          {/* Description Toggle */}
          <div className="flex justify-end mb-2">
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${!previewMode ? 'text-primary-400 font-bold' : 'text-dark-400'}`}>
                Editor
              </span>
              <button
                type="button"
                onClick={togglePreviewMode}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none bg-dark-300"
              >
                <span
                  className={`${
                    previewMode ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </button>
              <span className={`text-sm ${previewMode ? 'text-primary-400 font-bold' : 'text-dark-400'}`}>
                Anteprima
              </span>
            </div>
          </div>
          
          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Descrizione <span className="text-red-400">*</span>
            </label>
            
            {previewMode ? (
              <div className="glass p-4 min-h-[200px] prose prose-sm max-w-none border border-light-200">
                <ReactMarkdown>
                  {formData.description}
                </ReactMarkdown>
              </div>
            ) : (
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="8"
                className={`w-full glass p-3 focus:outline-none focus:ring-2 focus:ring-primary-400 font-mono border ${
                  errors.description ? 'border-red-400' : 'border-light-200'
                }`}
                placeholder="Descrizione dettagliata del progetto. Supporta la formattazione Markdown: **grassetto**, *corsivo*, ## titoli, elenchi e link [testo](url)"
              ></textarea>
            )}
            
            {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
            
            <div className="mt-2 text-xs text-dark-400">
              <p>Supporta Markdown: **grassetto**, *corsivo*, ## titoli, - elenchi, [link](url)</p>
            </div>
          </div>
          
          {/* Challenges */}
          <div className="mt-4">
            <label htmlFor="challenges" className="block text-sm font-medium mb-1">
              Sfide
            </label>
            <textarea
              id="challenges"
              name="challenges"
              value={formData.challenges}
              onChange={handleInputChange}
              rows="4"
              className="w-full glass p-3 focus:outline-none focus:ring-2 focus:ring-primary-400 font-mono border border-light-200"
              placeholder="Descrivi le sfide affrontate durante lo sviluppo"
            ></textarea>
          </div>
          
          {/* Solution */}
          <div className="mt-4">
            <label htmlFor="solution" className="block text-sm font-medium mb-1">
              Soluzione
            </label>
            <textarea
              id="solution"
              name="solution"
              value={formData.solution}
              onChange={handleInputChange}
              rows="4"
              className="w-full glass p-3 focus:outline-none focus:ring-2 focus:ring-primary-400 font-mono border border-light-200"
              placeholder="Descrivi le soluzioni adottate"
            ></textarea>
          </div>
        </div>
        
        {/* Images Section */}
        <div className="p-4 glass mb-4">
          <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-primary-300 to-secondary-300 bg-clip-text text-transparent">
            Immagini
          </h3>
          
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
                className="flex-grow glass p-3 focus:outline-none focus:ring-2 focus:ring-primary-400 border border-light-200"
                placeholder="URL dell'immagine"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddImage();
                  }
                }}
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
        </div>
        
        {/* Features and Tags Section */}
        <div className="p-4 glass mb-4">
          <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-primary-300 to-secondary-300 bg-clip-text text-transparent">
            Features e Tecnologie
          </h3>
          
          {/* Tags */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">
              Tag <span className="text-red-400">*</span>
            </label>
            <div className="flex items-center mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="flex-grow glass p-3 focus:outline-none focus:ring-2 focus:ring-primary-400 border border-light-200"
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
                className="flex-grow glass p-3 focus:outline-none focus:ring-2 focus:ring-primary-400 border border-light-200"
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
        </div>
        
        {/* Team Section */}
        <div className="p-4 glass mb-4">
          <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-primary-300 to-secondary-300 bg-clip-text text-transparent flex items-center">
            <FaUserFriends className="mr-2" /> Team
          </h3>
          
          {/* Team Members */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Membri del Team
            </label>
            <div className="flex items-center mb-2">
              <input
                type="text"
                value={teamMemberInput}
                onChange={(e) => setTeamMemberInput(e.target.value)}
                className="flex-grow glass p-3 focus:outline-none focus:ring-2 focus:ring-primary-400 border border-light-200"
                placeholder="Nome e ruolo (es. Marco Rossi - UI Designer)"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTeamMember();
                  }
                }}
              />
              <motion.button
                type="button"
                onClick={handleAddTeamMember}
                className="glass-button ml-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPlus />
              </motion.button>
            </div>
            
            <ul className="space-y-2 mt-2">
              {formData.teamMembers.map((member, index) => (
                <motion.li
                  key={index}
                  className="glass p-2 rounded-lg flex items-center justify-between"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <span>{member}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTeamMember(member)}
                    className="text-light-700 hover:text-white"
                  >
                    <FaTimes size={16} />
                  </button>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Links Section */}
        <div className="p-4 glass mb-4">
          <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-primary-300 to-secondary-300 bg-clip-text text-transparent">
            Link
          </h3>
          
          {/* Repository URL */}
          <div className="mb-4">
            <label htmlFor="repoUrl" className="block text-sm font-medium mb-1">
              URL Repository
            </label>
            <input
              type="url"
              id="repoUrl"
              name="repoUrl"
              value={formData.repoUrl}
              onChange={handleInputChange}
              className="w-full glass p-3 focus:outline-none focus:ring-2 focus:ring-primary-400 border border-light-200"
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
              className="w-full glass p-3 focus:outline-none focus:ring-2 focus:ring-primary-400 border border-light-200"
              placeholder="https://demo-site.com"
            />
          </div>
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
              {loading ? 'Salvando...' : (isEditing ? 'Aggiorna' : 'Salva')}
            </motion.button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default ProjectForm;