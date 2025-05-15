import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Layout components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Admin from './pages/Admin';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

// Context providers
import { AuthProvider } from './context/AuthContext';

// Admin components
import ProjectForm from './components/admin/ProjectForm';
import { useFirestore } from './hooks/useFirestore';

const App = () => {
  const { getDocument } = useFirestore('projects');
  
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          
          <main className="flex-grow">
            <AnimatePresence mode="wait">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/login" element={<Login />} />
                
                {/* Protected admin routes */}
                <Route element={<ProtectedRoute requireAdmin={true} />}>
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/admin/new" element={
                    <div className="container mx-auto px-4 py-16">
                      <h1 className="text-3xl font-bold mb-8">Nuovo Progetto</h1>
                      <ProjectForm />
                    </div>
                  } />
                  <Route path="/admin/edit/:id" element={
                    <EditProjectWrapper getDocument={getDocument} />
                  } />
                </Route>
                
                {/* 404 route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </main>
          
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

// Helper component to fetch project data for edit page
const EditProjectWrapper = ({ getDocument }) => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectData = await getDocument(id);
        setProject(projectData);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProject();
  }, [getDocument, id]);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="glass-card p-8">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-t-4 border-b-4 border-primary-500 rounded-full animate-spin"></div>
            <p className="mt-4">Caricamento progetto...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !project) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="glass-card p-8 text-center text-red-400">
          <p className="mb-4">Si è verificato un errore durante il caricamento del progetto.</p>
          <Link to="/admin">
            <motion.button
              className="glass-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Torna all'admin
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Modifica Progetto</h1>
      <ProjectForm project={project} />
    </div>
  );
};

export default App;