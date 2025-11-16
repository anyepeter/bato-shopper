import React from 'react';
import { motion } from 'motion/react';
import { BootstrapIcon } from '../BootstrapIcon';

interface WatchStreamButtonProps {
  onClick: () => void;
}

export function WatchStreamButton({ onClick }: WatchStreamButtonProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4" style={{ 
      background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)',
      paddingTop: '20px'
    }}>
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 font-body text-white"
        style={{
          backgroundColor: '#df660d',
          borderRadius: '3px',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          textAlign: 'center'
        }}
      >
        <BootstrapIcon name="lightning-fill" className="w-5 h-5 text-white" />
        <span style={{ 
          lineHeight: '1',
          fontWeight: 'bold',
          fontSize: '16px',
          letterSpacing: '0.5px'
        }}>
          WATCH STREAM ⚡
        </span>
      </motion.button>
    </div>
  );
}