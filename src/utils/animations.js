// Animation variants for Framer Motion

// For page transitions
export const pageTransition = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.2
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

// For individual items in a staggered list/grid
export const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
  hover: { 
    y: -5, 
    scale: 1.03,
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
    transition: { duration: 0.3, ease: "easeOut" }
  },
  tap: { scale: 0.98 }
};

// For modals/dialogs
export const modalVariant = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    transition: { duration: 0.2, ease: "easeIn" }
  }
};

// For navbar items
export const navItemVariant = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  hover: { scale: 1.1, color: "#818cf8" }
};

// For the mobile navbar menu
export const mobileMenuVariant = {
  hidden: { opacity: 0, height: 0 },
  visible: { 
    opacity: 1, 
    height: "auto",
    transition: { duration: 0.3, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    height: 0,
    transition: { duration: 0.2, ease: "easeIn" }
  }
};

// For buttons
export const buttonVariant = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
};

// For glassmorphism card reveal
export const glassCardVariant = {
  initial: { 
    backdropFilter: "blur(0px)",
    backgroundColor: "rgba(255, 255, 255, 0)",
    y: 20
  },
  animate: { 
    backdropFilter: "blur(10px)",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
  hover: { 
    backdropFilter: "blur(15px)",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    y: -5,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

// Parallax effect for background elements
export const parallaxVariant = (depth = 0.2) => ({
  initial: { y: 0 },
  animate: {
    y: 0,
    transition: {
      y: {
        repeat: Infinity,
        repeatType: "mirror",
        duration: 10,
        ease: "easeInOut"
      }
    }
  }
});

// Subtle float effect for cards and elements
export const floatVariant = {
  initial: { y: 0 },
  animate: {
    y: [0, -10, 0],
    transition: {
      repeat: Infinity,
      repeatType: "mirror",
      duration: 4,
      ease: "easeInOut"
    }
  }
};