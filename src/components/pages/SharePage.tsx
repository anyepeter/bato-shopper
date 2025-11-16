import { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, Share2, ExternalLink } from 'lucide-react';
import { 
  sharePlatforms, 
  generateShareData, 
  copyToClipboard, 
  openShareWindow, 
  trackShareEvent 
} from '../../utils/shareHelpers';

interface SharePageProps {
  onNavigateBack: () => void;
  product?: {
    id: number;
    name: string;
    price: number;
    image: string;
    description?: string;
  };
}

export function SharePage({ onNavigateBack, product }: SharePageProps) {
  const [copied, setCopied] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Default product if none provided
  const defaultProduct = {
    id: 1,
    name: 'Featured African Fashion',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
    description: 'Beautiful African-inspired fashion from Bato'
  };

  const currentProduct = product || defaultProduct;
  const shareData = generateShareData(currentProduct);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareData.url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackShareEvent('copy-link', currentProduct.id);
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
        trackShareEvent('copy-link', currentProduct.id);
      } else {
        // Use window.open for social platform sharing
        try {
          openShareWindow(shareUrl, platform.name.toLowerCase());
          trackShareEvent(platform.name.toLowerCase(), currentProduct.id);
        } catch (windowError) {
          // If window.open fails, fallback to clipboard
          copyToClipboard(shareData.url);
          trackShareEvent('copy-link-fallback', currentProduct.id);
        }
      }
      
      setTimeout(() => setSelectedPlatform(null), 1000);
    } catch (error) {
      // Silent error handling - don't show errors to users
      try {
        copyToClipboard(shareData.url);
        trackShareEvent('error-fallback', currentProduct.id);
      } catch (clipboardError) {
        // If even clipboard fails, just reset the UI
        console.log('ℹ️ Share attempted - please try again');
      }
      setSelectedPlatform(null);
    }
  };

  // Mobile layout with EXACT same styling as other mobile pages
  if (isMobile) {
    return (
      <div 
        className="min-h-screen"
        style={{
          background: 'transparent',
          color: 'var(--pure-white)',
          paddingBottom: '2rem'
        }}
      >
        {/* Mobile Header - Transparent background */}
        <div 
          className="sticky top-0 z-50 p-4 border-b header"
          style={{
            background: 'transparent',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '0px'
          }}
        >
          <div className="flex items-center justify-between" style={{ background: 'transparent' }}>
            <button 
              onClick={onNavigateBack}
              className="flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-md"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'var(--pure-white)',
                borderRadius: '8px'
              }}
            >
              <ArrowLeft size={20} />
              <span className="font-body">Back</span>
            </button>
            <h1 className="font-heading text-lg" style={{ color: 'var(--pure-white)' }}>
              Share Product
            </h1>
            <div style={{ width: '92px' }}></div>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6" style={{ background: 'transparent' }}>
          {/* Hero Section - Share This Fire! 🔥 */}
          <div style={{ background: 'transparent' }}>
            <div className="text-center mb-6" style={{ background: 'transparent' }}>
              <div className="flex items-center justify-center gap-2 mb-4" style={{ background: 'transparent' }}>
                <Share2 size={32} style={{ color: '#5825efff' }} />
                <span 
                  className="font-heading text-2xl" 
                  style={{ color: '#5825efff', fontWeight: '900', background: 'transparent' }}
                >
                  Share
                </span>
              </div>
              <h2 className="font-heading text-2xl mb-3" style={{ color: 'var(--pure-white)', background: 'transparent' }}>
                Share This Fire! 🔥
              </h2>
              <p className="font-body" style={{ color: 'rgba(255, 255, 255, 0.8)', background: 'transparent' }}>
                Spread the fashion love with your friends! ✨
              </p>
            </div>
          </div>

          {/* Product Preview - Transparent background */}
          <div style={{ background: 'transparent' }}>
            <div className="flex items-center gap-4" style={{ background: 'transparent' }}>
              <div 
                className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0"
                style={{ borderRadius: '8px' }}
              >
                <img 
                  src={currentProduct.image} 
                  alt={currentProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0" style={{ background: 'transparent' }}>
                <h3 className="font-heading text-lg truncate" style={{ color: 'var(--pure-white)', fontWeight: '600', background: 'transparent' }}>
                  {currentProduct.name}
                </h3>
                <p className="font-body text-lg" style={{ color: '#4040f8ff', fontWeight: '700', background: 'transparent' }}>
                  ${currentProduct.price}
                </p>
                <p className="font-body text-xs mt-1" style={{ color: 'rgba(255, 255, 255, 0.7)', background: 'transparent' }}>
                  Tap a platform below to share
                </p>
              </div>
            </div>
          </div>

          {/* Share Platforms Grid - Choose Your Platform 📱 */}
          <div style={{ background: 'transparent' }}>
            <h3 className="font-heading text-lg mb-4" style={{ color: 'var(--pure-white)', fontWeight: '600', background: 'transparent' }}>
              Choose Your Platform 📱
            </h3>
            <div style={{ background: 'transparent' }}>
              <div className="grid grid-cols-2 gap-3" style={{ background: 'transparent' }}>
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
                      transform: selectedPlatform === platform.name ? 'scale(0.95)' : 'scale(1)',
                      borderRadius: '8px'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                        style={{ 
                          background: platform.gradient,
                          borderRadius: '50%'
                        }}
                      >
                        {platform.emoji}
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <div className="font-body truncate" style={{ color: 'var(--pure-white)', fontWeight: '600' }}>
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
          </div>

          {/* Copy Link Section - Or Copy Link 🔗 */}
          <div style={{ background: 'transparent' }}>
            <h3 className="font-heading text-lg mb-3" style={{ color: 'var(--pure-white)', fontWeight: '600', background: 'transparent' }}>
              Or Copy Link 🔗
            </h3>
            <div style={{ background: 'transparent' }}>
              <div className="flex items-center gap-3" style={{ background: 'transparent' }}>
                <div 
                  className="flex-1 p-3 rounded-lg min-w-0"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px'
                  }}
                >
                  <p className="font-body text-sm truncate" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    {shareData.url}
                  </p>
                </div>
                <button
                  onClick={handleCopyLink}
                  className="p-3 rounded-lg transition-all flex-shrink-0"
                  style={{
                    background: copied ? 'linear-gradient(135deg, #00ff88, #00cc6a)' : 'linear-gradient(135deg, #4040f8ff, #5825efff)',
                    color: 'var(--pure-white)',
                    borderRadius: '8px'
                  }}
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
              {copied && (
                <p className="font-body text-xs mt-2 text-center" style={{ color: '#00ff88', background: 'transparent' }}>
                  Link copied to clipboard! ✅
                </p>
              )}
            </div>
          </div>

          {/* Fun Message - Share the fashion vibes and spread the love! 💖✨ */}
          <div 
            className="text-center"
            style={{ background: 'transparent' }}
          >
            <p className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.9)', background: 'transparent' }}>
              Share the fashion vibes and spread the love! 💖✨
            </p>
            <p className="font-body text-xs mt-1" style={{ color: 'rgba(255, 255, 255, 0.7)', background: 'transparent' }}>
              Help your friends discover amazing African fashion
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Desktop layout - Clean and professional
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'transparent' }}>
      <div className="max-w-md w-full space-y-8" style={{ background: 'transparent' }}>
        {/* Header */}
        <div className="flex items-center mb-8" style={{ background: 'transparent' }}>
          <button
            onClick={onNavigateBack}
            className="mr-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
            style={{
              color: 'var(--primary-blue)',
              borderRadius: 'var(--radius-lg)'
            }}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-3" style={{ background: 'transparent' }}>
            <div 
              className="w-8 h-8 flex items-center justify-center"
              style={{ 
                backgroundColor: 'var(--warning-yellow)',
                borderRadius: 'var(--radius-full)'
              }}
            >
              <span 
                className="font-bold text-lg font-heading"
                style={{ color: 'var(--primary-blue)' }}
              >
                B
              </span>
            </div>
            <h1 
              className="text-2xl font-bold font-heading"
              style={{ 
                color: 'var(--primary-blue)',
                fontFamily: 'var(--font-heading)',
                background: 'transparent'
              }}
            >
              Bato
            </h1>
          </div>
        </div>

        {/* Share Content */}
        <div 
          className="p-8 shadow-lg"
          style={{ 
            backgroundColor: 'var(--pure-white)',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <div className="text-center mb-8" style={{ background: 'transparent' }}>
            <div 
              className="mx-auto w-16 h-16 flex items-center justify-center mb-4"
              style={{ 
                backgroundColor: 'var(--primary-extra-light-blue)',
                borderRadius: 'var(--radius-lg)'
              }}
            >
              <Share2 
                className="h-8 w-8"
                style={{ color: 'var(--primary-blue)' }}
              />
            </div>
            <h2 
              className="text-3xl font-bold mb-2 font-heading"
              style={{ 
                color: 'var(--primary-blue)',
                fontFamily: 'var(--font-heading)',
                background: 'transparent'
              }}
            >
              Share Product
            </h2>
            <p 
              className="text-gray-600 font-body"
              style={{ fontFamily: 'var(--font-body)', background: 'transparent' }}
            >
              Share this amazing product with your friends
            </p>
          </div>

          {/* Product Preview */}
          <div 
            className="mb-6 p-4"
            style={{ 
              backgroundColor: 'var(--light-gray)',
              borderRadius: 'var(--radius-lg)'
            }}
          >
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 overflow-hidden"
                style={{ borderRadius: 'var(--radius-lg)' }}
              >
                <img 
                  src={currentProduct.image} 
                  alt={currentProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-heading font-semibold" style={{ color: 'var(--dark-gray)' }}>
                  {currentProduct.name}
                </h3>
                <p className="font-body" style={{ color: 'var(--primary-blue)', fontWeight: '600' }}>
                  ${currentProduct.price}
                </p>
              </div>
            </div>
          </div>

          {/* Share Platforms */}
          <div className="space-y-4 mb-6" style={{ background: 'transparent' }}>
            <h3 className="font-heading font-semibold" style={{ color: 'var(--dark-gray)', background: 'transparent' }}>
              Choose Platform
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {sharePlatforms.slice(0, 6).map((platform) => (
                <button
                  key={platform.name}
                  onClick={() => handlePlatformShare(platform)}
                  className="p-3 border transition-colors hover:shadow-lg"
                  style={{
                    borderRadius: 'var(--radius-lg)',
                    borderColor: 'var(--border)',
                    color: 'var(--dark-gray)'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{platform.emoji}</span>
                    <span className="font-body text-sm">{platform.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Copy Link */}
          <div className="space-y-3" style={{ background: 'transparent' }}>
            <h3 className="font-heading font-semibold" style={{ color: 'var(--dark-gray)', background: 'transparent' }}>
              Copy Link
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareData.url}
                readOnly
                className="flex-1 p-3 border rounded-lg font-body text-sm"
                style={{
                  borderRadius: 'var(--radius-lg)',
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--light-gray)'
                }}
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-3 btn-moema btn-moema-primary"
                style={{
                  borderRadius: 'var(--radius-lg)',
                  fontFamily: 'var(--font-body)'
                }}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            {copied && (
              <p className="font-body text-sm text-center" style={{ color: 'var(--success-green)', background: 'transparent' }}>
                Link copied to clipboard!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}