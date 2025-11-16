import { useState, useEffect } from 'react';
import { X, Copy, Check, Share2, ExternalLink } from 'lucide-react';
import { 
  sharePlatforms, 
  generateShareData, 
  copyToClipboard, 
  openShareWindow, 
  trackShareEvent 
} from '../../utils/shareHelpers';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    description?: string;
  };
}

export function ShareModal({ isOpen, onClose, product }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const shareData = generateShareData(product);

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareData.url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackShareEvent('copy-link', product.id);
    }
  };

  const handlePlatformShare = (platform: typeof sharePlatforms[0]) => {
    try {
      setSelectedPlatform(platform.name);
      const shareUrl = platform.generateUrl(shareData);
      
      // Safety check: never use native share API or suspicious URLs
      if (platform.name.toLowerCase() === 'native' || 
          shareUrl.includes('navigator.share') || 
          shareUrl.includes('share://')) {
        // Fallback to copy to clipboard for any native share attempts
        copyToClipboard(shareData.url);
        trackShareEvent('copy-link', product.id);
      } else {
        // Use window.open for social platform sharing
        try {
          openShareWindow(shareUrl, platform.name.toLowerCase());
          trackShareEvent(platform.name.toLowerCase(), product.id);
        } catch (windowError) {
          // If window.open fails, fallback to clipboard
          copyToClipboard(shareData.url);
          trackShareEvent('copy-link-fallback', product.id);
        }
      }
      
      setTimeout(() => setSelectedPlatform(null), 1000);
    } catch (error) {
      // Silent error handling - don't show errors to users
      try {
        copyToClipboard(shareData.url);
        trackShareEvent('error-fallback', product.id);
      } catch (clipboardError) {
        // If even clipboard fails, just reset the UI
        console.log('ℹ️ Share attempted - please try again');
      }
      setSelectedPlatform(null);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end"
      style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a1810 100%)'
      }}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0"
        onClick={onClose}
        style={{ background: 'rgba(0, 0, 0, 0.8)' }}
      />

      {/* Modal Content */}
      <div 
        className="relative w-full max-h-[90vh] overflow-y-auto"
        style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          boxShadow: '0 -10px 50px rgba(88, 37, 239, 0.3)'
        }}
      >
        {/* Header */}
        <div 
          className="sticky top-0 z-10 px-6 py-4 border-b"
          style={{
            background: 'linear-gradient(135deg, #5825efff, #4040f8ff)',
            borderColor: 'rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-xl" style={{ color: 'var(--pure-white)', fontWeight: '700' }}>
                Share This Fire! 🔥
              </h2>
              <p className="font-body text-sm mt-1" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Spread the fashion love ✨
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full transition-all"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'var(--pure-white)'
              }}
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Product Preview */}
          <div 
            className="p-4 rounded-lg"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-lg overflow-hidden"
                style={{ borderRadius: '8px' }}
              >
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-lg" style={{ color: 'var(--pure-white)', fontWeight: '600' }}>
                  {product.name}
                </h3>
                <p className="font-body text-lg" style={{ color: '#4040f8ff', fontWeight: '700' }}>
                  ${product.price}
                </p>
              </div>
            </div>
          </div>

          {/* Share Platforms Grid */}
          <div>
            <h3 className="font-heading text-lg mb-4" style={{ color: 'var(--pure-white)', fontWeight: '600' }}>
              Choose Your Platform 📱
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {sharePlatforms.map((platform) => (
                <button
                  key={platform.name}
                  onClick={() => handlePlatformShare(platform)}
                  className="p-4 rounded-lg transition-all duration-300 active:scale-95"
                  style={{
                    background: selectedPlatform === platform.name 
                      ? platform.gradient 
                      : 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transform: selectedPlatform === platform.name ? 'scale(0.95)' : 'scale(1)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                      style={{ background: platform.gradient }}
                    >
                      {platform.emoji}
                    </div>
                    <div className="text-left">
                      <div className="font-body" style={{ color: 'var(--pure-white)', fontWeight: '600' }}>
                        {platform.name}
                      </div>
                      <div className="font-body text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Share now
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Copy Link Section */}
          <div 
            className="p-4 rounded-lg"
            style={{
              background: 'rgba(64, 64, 248, 0.1)',
              border: '1px solid rgba(64, 64, 248, 0.3)'
            }}
          >
            <h3 className="font-heading text-lg mb-3" style={{ color: 'var(--pure-white)', fontWeight: '600' }}>
              Or Copy Link 🔗
            </h3>
            <div className="flex items-center gap-3">
              <div 
                className="flex-1 p-3 rounded-lg"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <p className="font-body text-sm truncate" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  {shareData.url}
                </p>
              </div>
              <button
                onClick={handleCopyLink}
                className="p-3 rounded-lg transition-all"
                style={{
                  background: copied ? 'linear-gradient(135deg, #00ff88, #00cc6a)' : 'linear-gradient(135deg, #4040f8ff, #5825efff)',
                  color: 'var(--pure-white)'
                }}
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
            {copied && (
              <p className="font-body text-xs mt-2 text-center" style={{ color: '#00ff88' }}>
                Link copied to clipboard! ✅
              </p>
            )}
          </div>

          {/* Fun Message */}
          <div className="text-center">
            <p className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Share the fashion vibes and spread the love! 💖✨
            </p>
          </div>
        </div>

        {/* Bottom Safe Area */}
        <div style={{ height: '20px' }} />
      </div>
    </div>
  );
}