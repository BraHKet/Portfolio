import React from 'react';
import { motion } from 'framer-motion';
import { FaReact, FaDatabase, FaServer, FaChartLine, FaAtom, FaLaptopCode } from 'react-icons/fa';
import { glassCardVariant } from '../../utils/animations';

const ServicesSection = () => {
  // Services data
  const services = [
    {
      title: 'Sviluppo React',
      description: 'Creazione di interfacce moderne, reattive e performanti con React e le ultime tecnologie frontend.',
      icon: <FaReact size={36} className="text-primary-400" />
    },
    {
      title: 'Integrazione Firebase',
      description: 'Implementazione di autenticazione, database e funzionalità cloud con Firebase per applicazioni scalabili.',
      icon: <FaDatabase size={36} className="text-primary-400" />
    },
    {
      title: 'Backend & API',
      description: 'Sviluppo di API RESTful e soluzioni backend con Node.js, Express e integrazione con database.',
      icon: <FaServer size={36} className="text-primary-400" />
    },
    {
      title: 'Visualizzazione Dati',
      description: 'Creazione di dashboard interattive e grafici per visualizzare dati complessi in modo intuitivo.',
      icon: <FaChartLine size={36} className="text-primary-400" />
    },
    {
      title: 'Fisica Computazionale',
      description: 'Modellazione di sistemi fisici e simulazioni computazionali per applicazioni scientifiche.',
      icon: <FaAtom size={36} className="text-primary-400" />
    },
    {
      title: 'Consulenza Tech',
      description: 'Consulenza su architetture software, strategie di sviluppo e soluzioni tecnologiche.',
      icon: <FaLaptopCode size={36} className="text-primary-400" />
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section id="services" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
            Cosa Faccio
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-400 to-secondary-400 mx-auto mb-6"></div>
          <p className="text-light-700 max-w-2xl mx-auto">
            Un mix di competenze tecniche e scientifiche per creare soluzioni digitali innovative e accessibili.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <motion.div 
                className="glass-card h-full flex flex-col"
                variants={glassCardVariant}
                initial="initial"
                animate="animate"
                whileHover="hover"
              >
                <div className="mb-6">
                  {service.icon}
                </div>
                
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                
                <p className="text-light-700 mt-auto">
                  {service.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;