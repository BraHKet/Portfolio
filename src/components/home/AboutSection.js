import React from 'react';
import { motion } from 'framer-motion';
import { glassCardVariant } from '../../utils/animations';

const AboutSection = () => {
  // Skills data
  const skills = [
    { name: 'React', level: 90 },
    { name: 'JavaScript', level: 85 },
    { name: 'Firebase', level: 80 },
    { name: 'Node.js', level: 75 },
    { name: 'Tailwind CSS', level: 85 },
    { name: 'Fisica Computazionale', level: 80 },
  ];

  // Section container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Individual skill animation
  const skillVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
            Chi Sono
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-400 to-secondary-400 mx-auto"></div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Bio section */}
          <motion.div 
            className="lg:w-1/2"
            variants={glassCardVariant}
            initial="initial"
            animate="animate"
            whileHover="hover"
          >
            <div className="glass-card h-full">
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary-300 to-secondary-300 bg-clip-text text-transparent">
                La mia storia
              </h3>
              
              <motion.p
                className="text-light-800 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Laureato in Fisica con una passione per la programmazione, ho unito queste due discipline 
                per creare soluzioni digitali eleganti e funzionali. Il mio background scientifico mi 
                fornisce un approccio analitico alla risoluzione dei problemi, mentre la mia esperienza 
                nello sviluppo web mi permette di trasformare concetti complessi in interfacce intuitive.
              </motion.p>
              
              <motion.p
                className="text-light-800 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Mi specializzo nello sviluppo di applicazioni web moderne con React e nell'integrazione di 
                servizi Firebase per creare esperienze utente fluide e reattive. Sono appassionato di 
                visualizzazione dati e di rendere accessibili concetti scientifici complessi attraverso 
                interfacce interattive.
              </motion.p>
              
              <motion.p
                className="text-light-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Quando non sto scrivendo codice, mi dedico allo studio della fisica computazionale, alla lettura 
                di libri di scienza e alla scoperta di nuove tecnologie emergenti.
              </motion.p>
            </div>
          </motion.div>
          
          {/* Skills section */}
          <motion.div 
            className="lg:w-1/2"
            variants={glassCardVariant}
            initial="initial"
            animate="animate"
            whileHover="hover"
          >
            <div className="glass-card h-full">
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary-300 to-secondary-300 bg-clip-text text-transparent">
                Le mie competenze
              </h3>
              
              <motion.div
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {skills.map((skill, index) => (
                  <motion.div 
                    key={skill.name} 
                    className="mb-4"
                    variants={skillVariants}
                  >
                    <div className="flex justify-between mb-1">
                      <span className="text-light-800 font-medium">{skill.name}</span>
                      <span className="text-light-700">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-dark-300 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ 
                          duration: 1.5, 
                          delay: 0.2 * index, 
                          ease: "easeOut" 
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;