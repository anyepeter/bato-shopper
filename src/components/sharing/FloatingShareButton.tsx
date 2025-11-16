import { useState, useEffect } from 'react';
import { Share2, Sparkles } from 'lucide-react';

interface FloatingShareButtonProps {
  isVisible: boolean;
  onClick: () => void;
  currentProduct?: {
    id: number;
    name: string;
    price: number;
    image: string;
  };
}

export function FloatingShareButton({ isVisible, onClick, currentProduct }: FloatingShareButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    // Show pulse animation every 8 seconds when visible
    if (isVisible) {
      const interval = setInterval(() => {
        setShowPulse(true);
        setTimeout(() => setShowPulse(false), 2000);
      }, 8000);
      
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const handleClick = () => {
    setIsPressed(true);
    onClick();
    setTimeout(() => setIsPressed(false), 150);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Share Button */}
      <button
        onClick={handleClick}
        className="fixed z-40 transition-all duration-300"
        style={{
          bottom: '120px',
          right: '20px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: isPressed 
            ? 'linear-gradient(135deg, #3d1eb8, #4040f8ff)' 
            : 'linear-gradient(135deg, #5825efff, #4040f8ff)',
          boxShadow: isPressed 
            ? '0 4px 20px rgba(88, 37, 239, 0.4)' 
            : '0 8px 25px rgba(88, 37, 239, 0.6)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          color: 'var(--pure-white)',
          transform: isPressed ? 'scale(0.9)' : 'scale(1)',
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? 'auto' : 'none'
        }}
      >
        <div className="flex items-center justify-center">
          <Share2 size={24} />
        </div>

        {/* Pulse Animation Ring */}
        {showPulse && (
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              background: 'rgba(88, 37, 239, 0.6)',
              zIndex: -1
            }}
          />
        )}

        {/* Sparkle Effect */}
        <div
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #FFE087, #ff6b6b)',
            animation: showPulse ? 'bounce 2s infinite' : 'none'
          }}
        >
          <Sparkles size={10} style={{ color: 'var(--pure-white)' }} />
        </div>
      </button>

      {/* Floating Tooltip */}
      {showPulse && currentProduct && (
        <div
          className="fixed z-39 transition-all duration-300"
          style={{
            bottom: '120px',
            right: '85px',
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '8px',
            padding: '8px 12px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            maxWidth: '200px'
          }}
        >
          <p className="font-body text-xs" style={{ color: 'var(--pure-white)' }}>
            Share "{currentProduct.name}" with friends! 🔥
          </p>
          <div
            className="absolute top-1/2 -right-1 w-2 h-2 rotate-45"
            style={{
              background: 'rgba(0, 0, 0, 0.9)',
              transform: 'translateY(-50%) rotate(45deg)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderLeft: 'none',
              borderTop: 'none'
            }}
          />
        </div>
      )}

      <style>
        {`
          @keyframes bounce {
            0%, 20%, 53%, 80%, 100% {
              transform: translate3d(0,0,0);
            }
            40%, 43% {
              transform: translate3d(0,-8px,0);
            }
            70% {
              transform: translate3d(0,-4px,0);
            }
            90% {
              transform: translate3d(0,-2px,0);
            }
          }
        `}
      </style>
    </>
  );
}