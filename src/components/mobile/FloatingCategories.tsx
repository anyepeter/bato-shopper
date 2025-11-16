import { motion } from "motion/react";
import { BootstrapIcon } from "../BootstrapIcon";

interface FloatingCategory {
  id: string;
  name: string;
  icon: string;
  action: () => void;
}

interface FloatingCategoriesProps {
  isVisible: boolean;
  categories: FloatingCategory[];
  filterCategory: string;
  isMobileSearchOpen: boolean;
}

export function FloatingCategories({
  isVisible,
  categories,
  filterCategory,
  isMobileSearchOpen
}: FloatingCategoriesProps) {
  if (!isVisible || isMobileSearchOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ type: "spring", duration: 0.5 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        border: 'none',
        background: 'transparent',
        position: 'fixed',
        zIndex: 88,
        top: '154px', // FloatingToggleButton top (100px) + height (44px) + gap (10px) = 154px
        right: '16px',
        gap: '8px',
        padding: '8px'
      }}
    >
      {categories.map((category, index) => (
        <motion.button
          key={category.id}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          onClick={category.action}
          className="btn-moema-icon btn-moema-icon-sm rounded-full"
          style={{
            backgroundColor: (category.id === 'search' && isMobileSearchOpen) || (filterCategory === category.id) 
              ? 'var(--primary-blue)' 
              : 'rgba(0, 0, 0, 0.7)',
            color: 'var(--pure-white)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            fontSize: '18px',
            position: 'relative',
            backdropFilter: 'blur(10px)'
          }}
          title={category.name}
        >
          <BootstrapIcon 
            name={category.icon}
            size={20}
            color="var(--pure-white)"
          />
          
          {((category.id === 'search' && isMobileSearchOpen) || (filterCategory === category.id)) && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '12px',
                height: '12px',
                backgroundColor: '#00ff88',
                borderRadius: '50%',
                border: '2px solid var(--pure-white)',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
              }}
            />
          )}
        </motion.button>
      ))}
    </motion.div>
  );
}