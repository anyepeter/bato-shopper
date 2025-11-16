import { motion } from "motion/react";
import { X } from "lucide-react";
import { BootstrapIcon } from "../BootstrapIcon";

interface MobileSearchOverlayProps {
  isOpen: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent | React.KeyboardEvent) => void;
}

export function MobileSearchOverlay({
  isOpen,
  searchQuery,
  onSearchChange,
  onClose,
  onSubmit
}: MobileSearchOverlayProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ width: 44, opacity: 0 }}
      animate={{ width: 'calc(100vw - 32px)', opacity: 1 }}
      exit={{ width: 44, opacity: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      style={{
        position: 'fixed',
        top: '154px', // FloatingToggleButton top (100px) + height (44px) + gap (10px) = 154px
        right: '16px',
        zIndex: 87,
        height: '44px',
        borderRadius: '24px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)'
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 px-4"
      >
        <input
          type="text"
          placeholder="Search for African fashion..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              onSubmit(e);
            }
          }}
          className="w-full bg-transparent border-none outline-none font-body text-base text-white placeholder-gray-300"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '16px'
          }}
          autoFocus
        />
      </motion.div>
      
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        onClick={() => onSubmit({ preventDefault: () => {} } as React.FormEvent)}
        className="p-2 mr-2 rounded-full transition-colors"
        style={{
          backgroundColor: 'var(--primary-blue)',
          color: 'var(--pure-white)',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        <BootstrapIcon 
          name="search"
          size={16}
          color="var(--pure-white)"
        />
      </motion.button>
      
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        onClick={onClose}
        className="p-2 mr-2 rounded-full transition-colors"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          color: 'var(--pure-white)',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        <X className="h-4 w-4" />
      </motion.button>
    </motion.div>
  );
}