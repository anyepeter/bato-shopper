import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import batoLogo from 'figma:asset/39788f429fb25d9683496a9972848a7efa9ddd0a.png';

interface MobileSplashScreenProps {
  isVisible: boolean;
  onComplete: () => void;
}

export function MobileSplashScreen({ isVisible, onComplete }: MobileSplashScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  // African-inspired pattern elements
  const patterns = [
    "M20,30 Q30,20 40,30 T60,30",
    "M10,20 L20,10 L30,20 L20,30 Z",
    "M15,25 Q25,15 35,25 T55,25",
    "M25,35 Q35,25 45,35 T65,35"
  ];

  useEffect(() => {
    if (!isVisible) return;

    const steps = [
      { delay: 0, duration: 800 },      // Logo fade in
      { delay: 800, duration: 1000 },   // African patterns animate
      { delay: 1800, duration: 800 },   // Brand text appears
      { delay: 2600, duration: 600 }    // Loading complete, prepare exit
    ];

    const timers = steps.map((step, index) => 
      setTimeout(() => {
        if (index === steps.length - 1) {
          // Last step - start exit animation
          setIsExiting(true);
          setTimeout(() => {
            onComplete();
          }, 500);
        } else {
          setCurrentStep(index + 1);
        }
      }, step.delay)
    );

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
        }}
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {/* Animated African Pattern Background */}
        <div className="absolute inset-0 overflow-hidden">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 400 800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Animated geometric patterns inspired by African textiles */}
            {patterns.map((path, index) => (
              <motion.path
                key={index}
                d={path}
                stroke="url(#gradient1)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={currentStep >= 1 ? { 
                  pathLength: 1, 
                  opacity: 0.3,
                  y: [0, -10, 0]
                } : {}}
                transition={{
                  pathLength: { duration: 1.5, delay: index * 0.2 },
                  opacity: { duration: 0.5, delay: index * 0.2 },
                  y: { 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: index * 0.3
                  }
                }}
              />
            ))}
            
            {/* Gradient definitions */}
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--primary-blue)" />
                <stop offset="50%" stopColor="var(--primary-light-blue)" />
                <stop offset="100%" stopColor="var(--primary-extra-light-blue)" />
              </linearGradient>
              <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="var(--primary-blue)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
          </svg>

          {/* Floating geometric shapes */}
          <div className="absolute inset-0">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  width: '20px',
                  height: '20px',
                  background: `linear-gradient(45deg, var(--primary-blue), var(--primary-light-blue))`,
                  borderRadius: '8px',
                  left: `${20 + i * 15}%`,
                  top: `${30 + i * 8}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={currentStep >= 1 ? {
                  opacity: [0, 0.6, 0.3],
                  scale: [0, 1, 0.8],
                  rotate: [0, 180, 360],
                  y: [0, -30, 0]
                } : {}}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>

        {/* Main Content Container */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-8 max-w-sm">
          
          {/* Logo Container with Glow Effect */}
          <motion.div
            className="relative mb-8"
            initial={{ opacity: 0, scale: 0.3, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              ease: [0.25, 0.8, 0.25, 1],
              type: "spring",
              stiffness: 100
            }}
          >
            {/* Glow effect behind logo */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(circle, var(--primary-blue) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(20px)',
                transform: 'scale(1.5)',
                zIndex: -1
              }}
              animate={{
                opacity: [0.3, 0.7, 0.3],
                scale: [1.3, 1.7, 1.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <img
              src={batoLogo}
              alt="Bato"
              className="w-20 h-20 object-contain relative z-10"
              style={{
                filter: 'drop-shadow(0 4px 12px rgba(88, 37, 239, 0.4))',
              }}
            />
          </motion.div>

          {/* Brand Name with Typing Effect */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0 }}
            animate={currentStep >= 2 ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.h1 
              className="font-heading text-4xl mb-2"
              style={{ 
                color: 'var(--pure-white)',
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textShadow: '0 2px 8px rgba(88, 37, 239, 0.5)'
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={currentStep >= 2 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Bato
            </motion.h1>
            
            <motion.p 
              className="font-body text-lg"
              style={{ 
                color: 'var(--primary-extra-light-blue)',
                fontFamily: 'var(--font-body)',
                letterSpacing: '0.05em'
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={currentStep >= 2 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              African Fashion Reimagined
            </motion.p>
          </motion.div>

          {/* Animated Loading Indicator */}
          <motion.div
            className="relative"
            initial={{ opacity: 0 }}
            animate={currentStep >= 2 ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.8 }}
          >
            {/* Custom loading dots */}
            <div className="flex items-center justify-center gap-2">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3"
                  style={{
                    background: `linear-gradient(135deg, var(--primary-blue), var(--primary-light-blue))`,
                    borderRadius: '50%',
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
            
            <motion.p 
              className="mt-4 text-sm font-body"
              style={{ 
                color: 'var(--primary-extra-light-blue)',
                opacity: 0.8
              }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Loading your fashion journey...
            </motion.p>
          </motion.div>

          {/* Decorative African-inspired border */}
          <motion.div
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={currentStep >= 1 ? { opacity: 0.6, scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 1.5 }}
          >
            <div 
              className="h-px w-32"
              style={{
                background: `linear-gradient(90deg, transparent, var(--primary-blue), var(--primary-light-blue), transparent)`,
              }}
            />
            <div className="flex justify-center mt-2 gap-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 h-1"
                  style={{
                    background: 'var(--primary-blue)',
                    borderRadius: '50%',
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Subtle grain texture overlay */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(circle at 25% 25%, rgba(88, 37, 239, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(88, 37, 239, 0.1) 0%, transparent 50%)
            `,
            mixBlendMode: 'overlay'
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}