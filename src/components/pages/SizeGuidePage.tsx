import { useState, useEffect } from "react";
import { Ruler, User, Shirt, ArrowUpDown, ArrowLeftRight, Info, ArrowLeft, Sparkles, Target } from "lucide-react";
import { Button } from "../ui/button";

export function SizeGuidePage() {
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleGoBack = () => {
    window.history.back();
  };

  // Mobile layout with consistent Bato design system
  if (isMobile) {
    return (
      <div 
        className="min-h-screen"
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a1810 100%)',
          color: 'var(--pure-white)',
          paddingBottom: '2rem'
        }}
      >
        {/* Mobile Header */}
        <div 
          className="sticky top-0 z-50 p-4 border-b header"
          style={{
            background: 'transparent',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '0px',
            borderTopLeftRadius: '0px',
            borderTopRightRadius: '0px',
            borderBottomLeftRadius: '0px', 
            borderBottomRightRadius: '0px'
          }}
        >
          <div className="flex items-center justify-between">
            <button 
              onClick={handleGoBack}
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
              Size Guide
            </h1>
            <div style={{ width: '80px' }}></div>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Hero Section */}
          <div 
            className="text-center p-6 rounded-lg"
            style={{
              background: 'rgba(88, 37, 239, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(88, 37, 239, 0.2)',
              borderRadius: '8px'
            }}
          >
            <Ruler size={48} style={{ margin: '0 auto 1rem', color: '#5825efff' }} />
            <h1 className="font-heading text-2xl mb-3" style={{ color: 'var(--pure-white)' }}>
              Find Your Perfect Fit! 📏
            </h1>
            <p className="font-body" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Get the perfect fit with our comprehensive sizing guide! No more guessing! 🎯
            </p>
          </div>

          {/* How to Measure */}
          <div 
            className="p-6 rounded-lg"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px'
            }}
          >
            <h2 className="font-heading text-xl mb-4" style={{ color: 'var(--pure-white)' }}>
              How to Measure 📐
            </h2>
            <p className="font-body mb-6" style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
              Follow these simple steps for accurate measurements!
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div 
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #5825efff, #5825efff)',
                    borderRadius: '8px',
                    width: '40px',
                    height: '40px'
                  }}
                >
                  <ArrowLeftRight size={20} color="white" />
                </div>
                <div>
                  <div className="font-heading mb-1" style={{ color: 'var(--pure-white)', fontSize: '1rem' }}>
                    Bust/Chest 💗
                  </div>
                  <div className="font-body" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                    Around fullest part of chest, under arms
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div 
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #5825efff, #5825efff)',
                    borderRadius: '8px',
                    width: '40px',
                    height: '40px'
                  }}
                >
                  <Target size={20} color="white" />
                </div>
                <div>
                  <div className="font-heading mb-1" style={{ color: 'var(--pure-white)', fontSize: '1rem' }}>
                    Waist ⭐
                  </div>
                  <div className="font-body" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                    Natural waistline, narrowest part
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div 
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #5825efff, #5825efff)',
                    borderRadius: '8px',
                    width: '40px',
                    height: '40px'
                  }}
                >
                  <Sparkles size={20} color="white" />
                </div>
                <div>
                  <div className="font-heading mb-1" style={{ color: 'var(--pure-white)', fontSize: '1rem' }}>
                    Hips 💃
                  </div>
                  <div className="font-body" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                    Around fullest part of hips
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div 
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #5825efff, #5825efff)',
                    borderRadius: '8px',
                    width: '40px',
                    height: '40px'
                  }}
                >
                  <ArrowUpDown size={20} color="white" />
                </div>
                <div>
                  <div className="font-heading mb-1" style={{ color: 'var(--pure-white)', fontSize: '1rem' }}>
                    Length 📏
                  </div>
                  <div className="font-body" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                    From shoulder to desired length
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Size Chart */}
          <div 
            className="p-6 rounded-lg"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px'
            }}
          >
            <h3 className="font-heading text-xl mb-6" style={{ color: 'var(--pure-white)' }}>
              Women's Size Chart 👗
            </h3>

            <div 
              className="rounded-lg p-4"
              style={{ 
                background: 'rgba(88, 37, 239, 0.1)',
                border: '1px solid rgba(88, 37, 239, 0.2)',
                borderRadius: '8px',
                overflowX: 'auto'
              }}
            >
              <table style={{ 
                width: '100%', 
                fontSize: '0.9rem',
                color: 'var(--pure-white)'
              }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
                    <th className="font-heading" style={{ padding: '0.75rem 0.5rem', textAlign: 'left' }}>Size</th>
                    <th className="font-heading" style={{ padding: '0.75rem 0.5rem', textAlign: 'left' }}>US</th>
                    <th className="font-heading" style={{ padding: '0.75rem 0.5rem', textAlign: 'left' }}>Bust</th>
                    <th className="font-heading" style={{ padding: '0.75rem 0.5rem', textAlign: 'left' }}>Waist</th>
                    <th className="font-heading" style={{ padding: '0.75rem 0.5rem', textAlign: 'left' }}>Hips</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', fontWeight: '600' }}>XS</td>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', color: 'rgba(255, 255, 255, 0.7)' }}>0-2</td>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', color: 'rgba(255, 255, 255, 0.7)' }}>32-33"</td>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', color: 'rgba(255, 255, 255, 0.7)' }}>24-25"</td>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', color: 'rgba(255, 255, 255, 0.7)' }}>34-35"</td>
                  </tr>
                  <tr>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', fontWeight: '600' }}>S</td>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', color: 'rgba(255, 255, 255, 0.7)' }}>4-6</td>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', color: 'rgba(255, 255, 255, 0.7)' }}>34-35"</td>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', color: 'rgba(255, 255, 255, 0.7)' }}>26-27"</td>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', color: 'rgba(255, 255, 255, 0.7)' }}>36-37"</td>
                  </tr>
                  <tr>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', fontWeight: '600' }}>M</td>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', color: 'rgba(255, 255, 255, 0.7)' }}>8-10</td>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', color: 'rgba(255, 255, 255, 0.7)' }}>36-37"</td>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', color: 'rgba(255, 255, 255, 0.7)' }}>28-29"</td>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', color: 'rgba(255, 255, 255, 0.7)' }}>38-39"</td>
                  </tr>
                  <tr>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', fontWeight: '600' }}>L</td>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', color: 'rgba(255, 255, 255, 0.7)' }}>12-14</td>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', color: 'rgba(255, 255, 255, 0.7)' }}>38-40"</td>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', color: 'rgba(255, 255, 255, 0.7)' }}>30-32"</td>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', color: 'rgba(255, 255, 255, 0.7)' }}>40-42"</td>
                  </tr>
                  <tr>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', fontWeight: '600' }}>XL</td>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', color: 'rgba(255, 255, 255, 0.7)' }}>16-18</td>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', color: 'rgba(255, 255, 255, 0.7)' }}>42-44"</td>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', color: 'rgba(255, 255, 255, 0.7)' }}>34-36"</td>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', color: 'rgba(255, 255, 255, 0.7)' }}>44-46"</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* African Fashion Fit Guide */}
          <div 
            className="p-6 rounded-lg"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px'
            }}
          >
            <h3 className="font-heading text-xl mb-6" style={{ color: 'var(--pure-white)' }}>
              African Fashion Fits 🌍
            </h3>

            <div 
              className="p-4 rounded-lg mb-4"
              style={{ 
                background: 'rgba(88, 37, 239, 0.1)',
                border: '1px solid rgba(88, 37, 239, 0.2)',
                borderRadius: '8px'
              }}
            >
              <h4 className="font-heading mb-3" style={{ color: 'var(--pure-white)' }}>
                Traditional Styles 👘
              </h4>
              <div className="font-body space-y-2" style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                <div><strong>Ankara Dresses:</strong> Relaxed fit for comfort 💃</div>
                <div><strong>Dashiki Tops:</strong> Loose, focus on bust measurement 🌟</div>
                <div><strong>Kaftans:</strong> Flowing design, shoulder & bust key 💫</div>
              </div>
            </div>

            <div 
              className="p-4 rounded-lg"
              style={{ 
                background: 'rgba(88, 37, 239, 0.1)',
                border: '1px solid rgba(88, 37, 239, 0.2)',
                borderRadius: '8px'
              }}
            >
              <h4 className="font-heading mb-3" style={{ color: 'var(--pure-white)' }}>
                Modern African Styles 💎
              </h4>
              <div className="font-body space-y-2" style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                <div><strong>Fitted Dresses:</strong> Follow standard sizing ✨</div>
                <div><strong>Print Blazers:</strong> Similar to Western blazers 👔</div>
                <div><strong>Contemporary Tops:</strong> Standard sizing applies 🔥</div>
              </div>
            </div>
          </div>

          {/* Measuring Tips */}
          <div 
            className="p-6 rounded-lg"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px'
            }}
          >
            <h3 className="font-heading text-xl mb-6" style={{ color: 'var(--pure-white)' }}>
              Pro Measuring Tips 🎯
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div 
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #5825efff, #5825efff)',
                    borderRadius: '8px',
                    width: '40px',
                    height: '40px'
                  }}
                >
                  <Info size={20} color="white" />
                </div>
                <div>
                  <div className="font-heading mb-1" style={{ color: 'var(--pure-white)', fontSize: '1rem' }}>
                    Use a Flexible Tape 📏
                  </div>
                  <div className="font-body" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                    A cloth measuring tape works best!
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div 
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #5825efff, #5825efff)',
                    borderRadius: '8px',
                    width: '40px',
                    height: '40px'
                  }}
                >
                  <User size={20} color="white" />
                </div>
                <div>
                  <div className="font-heading mb-1" style={{ color: 'var(--pure-white)', fontSize: '1rem' }}>
                    Get Help 🤝
                  </div>
                  <div className="font-body" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                    Have someone help for accuracy
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div 
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #5825efff, #5825efff)',
                    borderRadius: '8px',
                    width: '40px',
                    height: '40px'
                  }}
                >
                  <Shirt size={20} color="white" />
                </div>
                <div>
                  <div className="font-heading mb-1" style={{ color: 'var(--pure-white)', fontSize: '1rem' }}>
                    Measure Over Undergarments 🩱
                  </div>
                  <div className="font-body" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                    Or close-fitting clothes for accuracy
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* International Conversion */}
          <div 
            className="p-6 rounded-lg"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px'
            }}
          >
            <h3 className="font-heading text-xl mb-6" style={{ color: 'var(--pure-white)' }}>
              Size Conversion 🌍
            </h3>

            <div 
              className="rounded-lg p-4"
              style={{ 
                background: 'rgba(88, 37, 239, 0.1)',
                border: '1px solid rgba(88, 37, 239, 0.2)',
                borderRadius: '8px',
                overflowX: 'auto'
              }}
            >
              <table style={{ 
                width: '100%', 
                fontSize: '0.9rem',
                color: 'var(--pure-white)'
              }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
                    <th className="font-heading" style={{ padding: '0.75rem 0.5rem', textAlign: 'left' }}>US</th>
                    <th className="font-heading" style={{ padding: '0.75rem 0.5rem', textAlign: 'left' }}>UK</th>
                    <th className="font-heading" style={{ padding: '0.75rem 0.5rem', textAlign: 'left' }}>EU</th>
                    <th className="font-heading" style={{ padding: '0.75rem 0.5rem', textAlign: 'left' }}>AU</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', fontWeight: '600' }}>XS (0-2)</td>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', color: 'rgba(255, 255, 255, 0.7)' }}>4-6</td>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', color: 'rgba(255, 255, 255, 0.7)' }}>32-34</td>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', color: 'rgba(255, 255, 255, 0.7)' }}>4-6</td>
                  </tr>
                  <tr>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', fontWeight: '600' }}>S (4-6)</td>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', color: 'rgba(255, 255, 255, 0.7)' }}>8-10</td>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', color: 'rgba(255, 255, 255, 0.7)' }}>36-38</td>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', color: 'rgba(255, 255, 255, 0.7)' }}>8-10</td>
                  </tr>
                  <tr>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', fontWeight: '600' }}>M (8-10)</td>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', color: 'rgba(255, 255, 255, 0.7)' }}>12-14</td>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', color: 'rgba(255, 255, 255, 0.7)' }}>40-42</td>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', color: 'rgba(255, 255, 255, 0.7)' }}>12-14</td>
                  </tr>
                  <tr>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', fontWeight: '600' }}>L (12-14)</td>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', color: 'rgba(255, 255, 255, 0.7)' }}>16-18</td>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', color: 'rgba(255, 255, 255, 0.7)' }}>44-46</td>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', color: 'rgba(255, 255, 255, 0.7)' }}>16-18</td>
                  </tr>
                  <tr>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', fontWeight: '600' }}>XL (16-18)</td>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', color: 'rgba(255, 255, 255, 0.7)' }}>20-22</td>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', color: 'rgba(255, 255, 255, 0.7)' }}>48-50</td>
                    <td className="font-body" style={{ padding: '0.75rem 0.5rem', color: 'rgba(255, 255, 255, 0.7)' }}>20-22</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Help Section */}
          <div 
            className="p-6 rounded-lg"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px'
            }}
          >
            <h3 className="font-heading text-xl mb-4" style={{ color: 'var(--pure-white)' }}>
              Need Sizing Help? 💬
            </h3>
            <p className="font-body mb-6 text-center" style={{ 
              color: 'rgba(255, 255, 255, 0.8)', 
              fontSize: '0.9rem'
            }}>
              Our sizing experts are here to help you find the perfect fit! No stress, just style! ✨
            </p>
            
            <div className="space-y-4">
              <button 
                className="w-full py-4 px-6 rounded-lg font-heading transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #5825efff, #5825efff)',
                  color: 'var(--pure-white)',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              >
                💬 Chat with Size Expert
              </button>
              <button 
                className="w-full py-4 px-6 rounded-lg font-heading transition-all duration-300"
                style={{
                  background: 'transparent',
                  color: 'var(--pure-white)',
                  border: '1px solid rgba(88, 37, 239, 0.5)',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              >
                📧 Email Sizing Help
              </button>
            </div>

            <div className="text-center mt-6 font-body" style={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.8rem'
            }}>
              Free exchanges if the size doesn't fit perfectly! 🔄
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop layout remains unchanged
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-80 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.1)_10px,rgba(255,255,255,0.1)_20px)]"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <div className="flex items-center space-x-2 mb-4">
              <Ruler className="h-8 w-8 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">Perfect Fit Guide</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
              Size Guide
            </h1>
            <p className="text-xl mb-8 opacity-90 animate-fade-in-delay">
              Find your perfect fit with our comprehensive sizing charts
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* How to Measure */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How to Take Your Measurements</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowLeftRight className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Bust/Chest</h3>
                <p className="text-gray-600 text-sm">Measure around the fullest part of your chest, keeping the tape level under your arms and across your back</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowLeftRight className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Waist</h3>
                <p className="text-gray-600 text-sm">Measure around your natural waistline, the narrowest part of your torso, usually just above your belly button</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowLeftRight className="h-8 w-8 text-pink-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Hips</h3>
                <p className="text-gray-600 text-sm">Measure around the fullest part of your hips, approximately 7-9 inches below your waistline</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowUpDown className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Length</h3>
                <p className="text-gray-600 text-sm">For dresses and tops, measure from your shoulder point to desired length. For pants, measure inseam length</p>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-blue-50 rounded-xl">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Measuring Tips</h4>
                  <div className="text-gray-700 space-y-1">
                    <p>• Use a flexible measuring tape for accurate results</p>
                    <p>• Measure over your undergarments or close-fitting clothes</p>
                    <p>• Stand naturally with your arms at your sides</p>
                    <p>• Have someone help you measure for best accuracy</p>
                    <p>• Don't pull the tape too tight - it should sit comfortably</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Women's Size Charts */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Women's Size Charts</h2>
            
            {/* Dresses & Tops */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dresses & Tops</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Size</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">US</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Bust (inches)</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Waist (inches)</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Hips (inches)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3">XS</td>
                      <td className="border border-gray-300 px-4 py-3">0-2</td>
                      <td className="border border-gray-300 px-4 py-3">32-33</td>
                      <td className="border border-gray-300 px-4 py-3">24-25</td>
                      <td className="border border-gray-300 px-4 py-3">34-35</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3">S</td>
                      <td className="border border-gray-300 px-4 py-3">4-6</td>
                      <td className="border border-gray-300 px-4 py-3">34-35</td>
                      <td className="border border-gray-300 px-4 py-3">26-27</td>
                      <td className="border border-gray-300 px-4 py-3">36-37</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3">M</td>
                      <td className="border border-gray-300 px-4 py-3">8-10</td>
                      <td className="border border-gray-300 px-4 py-3">36-37</td>
                      <td className="border border-gray-300 px-4 py-3">28-29</td>
                      <td className="border border-gray-300 px-4 py-3">38-39</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3">L</td>
                      <td className="border border-gray-300 px-4 py-3">12-14</td>
                      <td className="border border-gray-300 px-4 py-3">38-40</td>
                      <td className="border border-gray-300 px-4 py-3">30-32</td>
                      <td className="border border-gray-300 px-4 py-3">40-42</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3">XL</td>
                      <td className="border border-gray-300 px-4 py-3">16-18</td>
                      <td className="border border-gray-300 px-4 py-3">42-44</td>
                      <td className="border border-gray-300 px-4 py-3">34-36</td>
                      <td className="border border-gray-300 px-4 py-3">44-46</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* International Size Conversion */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">International Size Conversion</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">US Size</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">UK</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">European</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Australian</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3">XS (0-2)</td>
                      <td className="border border-gray-300 px-4 py-3">4-6</td>
                      <td className="border border-gray-300 px-4 py-3">32-34</td>
                      <td className="border border-gray-300 px-4 py-3">4-6</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3">S (4-6)</td>
                      <td className="border border-gray-300 px-4 py-3">8-10</td>
                      <td className="border border-gray-300 px-4 py-3">36-38</td>
                      <td className="border border-gray-300 px-4 py-3">8-10</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3">M (8-10)</td>
                      <td className="border border-gray-300 px-4 py-3">12-14</td>
                      <td className="border border-gray-300 px-4 py-3">40-42</td>
                      <td className="border border-gray-300 px-4 py-3">12-14</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3">L (12-14)</td>
                      <td className="border border-gray-300 px-4 py-3">16-18</td>
                      <td className="border border-gray-300 px-4 py-3">44-46</td>
                      <td className="border border-gray-300 px-4 py-3">16-18</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3">XL (16-18)</td>
                      <td className="border border-gray-300 px-4 py-3">20-22</td>
                      <td className="border border-gray-300 px-4 py-3">48-50</td>
                      <td className="border border-gray-300 px-4 py-3">20-22</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* African Fashion Specific Fit Guide */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">African Fashion Fit Guide</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">👘</span>
                  Traditional African Styles
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Ankara Dresses</h4>
                    <p className="text-gray-700 text-sm">Traditionally cut with a relaxed fit. Focus on bust and hip measurements for the most comfortable fit.</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Dashiki Tops</h4>
                    <p className="text-gray-700 text-sm">Loose-fitting design. Chest measurement is most important for comfortable shoulder and arm movement.</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Kaftans</h4>
                    <p className="text-gray-700 text-sm">Flowing, oversized design. Consider shoulder width and desired length for the perfect drape.</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">💎</span>
                  Modern African Styles
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Fitted African Print Dresses</h4>
                    <p className="text-gray-700 text-sm">Follow our standard sizing chart. These are tailored to contemporary Western fits.</p>
                  </div>
                  <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <h4 className="font-semibold text-gray-900 mb-2">African Print Blazers</h4>
                    <p className="text-gray-700 text-sm">Sized similarly to Western blazers. Pay attention to shoulder and bust measurements.</p>
                  </div>
                  <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Contemporary African Tops</h4>
                    <p className="text-gray-700 text-sm">Standard sizing applies. Consider the style - some are meant to be oversized for a modern look.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fit & Care Tips */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Fit & Care Tips</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div className="flex items-center mb-4">
                  <Target className="h-8 w-8 text-blue-600 mr-3" />
                  <h3 className="font-semibold text-gray-900">Perfect Fit</h3>
                </div>
                <p className="text-gray-700 text-sm">When in doubt, size up for traditional styles and follow exact measurements for fitted pieces.</p>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="flex items-center mb-4">
                  <Sparkles className="h-8 w-8 text-green-600 mr-3" />
                  <h3 className="font-semibold text-gray-900">Fabric Care</h3>
                </div>
                <p className="text-gray-700 text-sm">African prints may shrink slightly. Consider this when choosing between sizes.</p>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200">
                <div className="flex items-center mb-4">
                  <Info className="h-8 w-8 text-purple-600 mr-3" />
                  <h3 className="font-semibold text-gray-900">Size Guide</h3>
                </div>
                <p className="text-gray-700 text-sm">Each product page includes specific fit notes and model measurements for reference.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Help & Support */}
        <section>
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Need Help Finding Your Size?</h2>
            <p className="text-lg opacity-90 mb-8">Our sizing experts are here to help you find the perfect fit</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold px-8"
              >
                Chat with Size Expert
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-indigo-600 font-semibold px-8"
              >
                Email Sizing Help
              </Button>
            </div>
            
            <p className="text-sm opacity-80 mt-6">
              Free exchanges available if your size doesn't fit perfectly
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}