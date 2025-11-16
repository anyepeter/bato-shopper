import React, { useState } from 'react';
import { ColorSelection, defaultColors, fashionColors } from './ColorSelection';

interface ColorSelectionDemoProps {
  onNavigateToPage?: (page: string) => void;
}

export const ColorSelectionDemo: React.FC<ColorSelectionDemoProps> = ({ onNavigateToPage }) => {
  const [selectedColor1, setSelectedColor1] = useState('');
  const [selectedColor2, setSelectedColor2] = useState('purple');
  const [selectedColor3, setSelectedColor3] = useState('');
  const [selectedColor4, setSelectedColor4] = useState('navy-blue');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingColorId, setLoadingColorId] = useState('');

  // Custom color set for demonstration
  const customColors = [
    { id: 'coral', name: 'Coral', value: 'coral', previewColor: '#ff7875' },
    { id: 'mint', name: 'Mint', value: 'mint', previewColor: '#87d068' },
    { id: 'lavender', name: 'Lavender', value: 'lavender', previewColor: '#b37feb' },
    { id: 'peach', name: 'Peach', value: 'peach', previewColor: '#ffbb96' },
    { id: 'sky', name: 'Sky Blue', value: 'sky', previewColor: '#69c0ff' }
  ];

  // Handler with loading simulation for demonstration
  const handleColorChangeWithLoading = (colorValue: string, colorId: string, setter: (value: string) => void) => {
    setIsLoading(true);
    setLoadingColorId(colorId);
    
    // Simulate async color change (like fetching product variants)
    setTimeout(() => {
      setter(colorValue);
      setIsLoading(false);
      setLoadingColorId('');
    }, 1000);
  };

  return (
    <div className="color-selection-demo min-h-screen bg-light-gray">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-2xl font-medium text-black">
                Color Selection Component Demo
              </h1>
              <p className="font-body text-medium-gray mt-1">
                100% circular color selection with smooth animations
              </p>
            </div>
            {onNavigateToPage && (
              <button
                onClick={() => onNavigateToPage('home')}
                className="btn-moema-secondary px-4 py-2"
              >
                Back to Home
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Demo 1: Default Colors - Small Size */}
          <div className="demo-card bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="font-heading text-lg font-medium mb-4">
              Small Size - Default Colors
            </h2>
            <ColorSelection
              colors={defaultColors}
              selectedColor={selectedColor1}
              onColorChange={setSelectedColor1}
              size="sm"
              label="Select your preferred color"
            />
            <div className="mt-4 p-3 bg-gray-50 rounded">
              <p className="font-body text-sm">
                <strong>Selected:</strong> {selectedColor1 || 'None'}
              </p>
            </div>
          </div>

          {/* Demo 2: Fashion Colors - Medium Size */}
          <div className="demo-card bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="font-heading text-lg font-medium mb-4">
              Medium Size - Fashion Colors
            </h2>
            <ColorSelection
              colors={fashionColors}
              selectedColor={selectedColor2}
              onColorChange={setSelectedColor2}
              size="md"
              label="Choose fabric color"
              required
            />
            <div className="mt-4 p-3 bg-gray-50 rounded">
              <p className="font-body text-sm">
                <strong>Selected:</strong> {selectedColor2 || 'None'}
              </p>
            </div>
          </div>

          {/* Demo 3: Custom Colors - Large Size with Loading Animation */}
          <div className="demo-card bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="font-heading text-lg font-medium mb-4">
              Large Size - Custom Colors (with Loading Spinner)
            </h2>
            <ColorSelection
              colors={customColors}
              selectedColor={selectedColor3}
              onColorChange={(colorValue) => {
                const colorId = customColors.find(c => c.value === colorValue)?.id || '';
                handleColorChangeWithLoading(colorValue, colorId, setSelectedColor3);
              }}
              size="lg"
              label="Pick accent color"
              loading={isLoading}
              loadingColorId={loadingColorId}
            />
            <div className="mt-4 p-3 bg-gray-50 rounded">
              <p className="font-body text-sm">
                <strong>Selected:</strong> {selectedColor3 || 'None'}
                {isLoading && <span className="text-primary-blue ml-2">⏳ Loading...</span>}
              </p>
            </div>
          </div>

          {/* Demo 4: Disabled State */}
          <div className="demo-card bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="font-heading text-lg font-medium mb-4">
              Disabled State
            </h2>
            <ColorSelection
              colors={fashionColors}
              selectedColor={selectedColor4}
              onColorChange={setSelectedColor4}
              size="md"
              label="Disabled color selection"
              disabled
            />
            <div className="mt-4 p-3 bg-gray-50 rounded">
              <p className="font-body text-sm">
                <strong>Selected:</strong> {selectedColor4 || 'None'}
              </p>
              <p className="font-body text-xs text-medium-gray mt-1">
                This color selection is disabled
              </p>
            </div>
          </div>

          {/* Product Integration Example */}
          <div className="demo-card bg-white rounded-lg p-6 shadow-sm border lg:col-span-2">
            <h2 className="font-heading text-lg font-medium mb-4">
              Product Integration Example
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Product Image Mock */}
              <div className="product-preview">
                <div className="aspect-w-3 aspect-h-4 bg-gray-100 rounded-lg mb-4">
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-2"></div>
                      <p className="font-body text-sm text-medium-gray">Product Image</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Options */}
              <div className="product-options space-y-6">
                <div>
                  <h3 className="font-heading font-medium mb-3">African Print Dress</h3>
                  <p className="font-body text-medium-gray mb-4">
                    Beautiful traditional dress with modern styling
                  </p>
                </div>

                <ColorSelection
                  colors={fashionColors}
                  selectedColor={selectedColor2}
                  onColorChange={setSelectedColor2}
                  size="md"
                  label="Available Colors"
                  required
                />

                <div className="price-section">
                  <p className="font-heading text-xl font-medium">$89.99</p>
                  <p className="font-body text-sm text-medium-gray">Free shipping on orders over $100</p>
                </div>

                <button className="btn-moema-primary w-full py-3">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Example */}
          <div className="demo-card bg-black rounded-lg p-6 text-white lg:col-span-2">
            <h2 className="font-heading text-lg font-medium mb-4 text-white">
              Mobile/TikTok Style Example
            </h2>
            <div className="bg-gray-900 rounded-lg p-4 max-w-sm mx-auto">
              <div className="text-center mb-4">
                <h3 className="font-heading text-white mb-2">Trending Now</h3>
                <p className="font-body text-gray-300 text-sm">Swipe to see colors</p>
              </div>
              
              <ColorSelection
                colors={fashionColors.slice(0, 6)}
                selectedColor={selectedColor3}
                onColorChange={setSelectedColor3}
                size="lg"
                label="Pick your vibe"
                className="justify-center"
              />
              
              <div className="mt-4 text-center">
                <button className="btn-moema-primary px-6 py-2 text-sm">
                  🔥 Shop Now
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Advanced Features Demo */}
        <div className="demo-card bg-white rounded-lg p-6 shadow-sm border">
          <h2 className="font-heading text-lg font-medium mb-4">
            🎨 Advanced Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gradient Colors */}
            <div>
              <h3 className="font-heading text-md font-medium mb-3">Gradient Colors</h3>
              <div className="flex gap-3">
                <button 
                  className="color-option-button w-12 h-12 border-2 border-gray-300"
                  data-gradient="true"
                  style={{
                    '--color-1': '#ff6b6b',
                    '--color-2': '#ff8e53'
                  } as React.CSSProperties}
                >
                  <div className="color-inner-circle" style={{
                    background: 'linear-gradient(135deg, #ff6b6b, #ff8e53)'
                  }} />
                </button>
                <button 
                  className="color-option-button w-12 h-12 border-2 border-gray-300"
                  data-gradient="true"
                >
                  <div className="color-inner-circle" style={{
                    background: 'linear-gradient(135deg, #5825ef, #885cf8)'
                  }} />
                </button>
              </div>
            </div>

            {/* Pattern Colors */}
            <div>
              <h3 className="font-heading text-md font-medium mb-3">Pattern Colors</h3>
              <div className="flex gap-3">
                <button 
                  className="color-option-button w-12 h-12 border-2 border-gray-300"
                  data-pattern="stripe"
                >
                  <div className="color-inner-circle" style={{ backgroundColor: '#ff6b6b' }} />
                </button>
                <button 
                  className="color-option-button w-12 h-12 border-2 border-gray-300"
                  data-pattern="stripe"
                >
                  <div className="color-inner-circle" style={{ backgroundColor: '#5825ef' }} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Code Example */}
        <div className="mt-12 bg-gray-900 rounded-lg p-6 text-white">
          <h2 className="font-heading text-lg font-medium mb-4 text-white">
            💻 Enhanced Usage Example
          </h2>
          <pre className="font-mono text-sm overflow-x-auto">
            <code>{`import { ColorSelection, fashionColors } from './components/ColorSelection';

const [selectedColor, setSelectedColor] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [loadingColorId, setLoadingColorId] = useState('');

// Handler with loading simulation
const handleColorChange = (colorValue) => {
  const colorId = fashionColors.find(c => c.value === colorValue)?.id;
  setIsLoading(true);
  setLoadingColorId(colorId);
  
  // Simulate async operation (e.g., fetching product variants)
  setTimeout(() => {
    setSelectedColor(colorValue);
    setIsLoading(false);
    setLoadingColorId('');
  }, 1000);
};

<ColorSelection
  colors={fashionColors}
  selectedColor={selectedColor}
  onColorChange={handleColorChange}
  size="md"
  label="Choose your color"
  loading={isLoading}
  loadingColorId={loadingColorId}
  required
/>

/* 🎯 ENHANCED FEATURES:
✨ Gentle spinning on hover (desktop only)
🌟 Pulsing spin animation when selected  
⏳ Loading spinner for async operations
🎨 Gradient and pattern color support
📱 Mobile-optimized touch interactions
♿ Full accessibility compliance
🌓 Dark mode support
🖨️ Print-friendly styles
🔧 High contrast mode support
📐 Reduced motion preferences
🎪 Advanced tooltips with animations
💫 Checkmark spin-in animations
🎯 Perfect circular design (100% border-radius)
⚡ Performance optimized animations
🛡️ Comprehensive error boundaries */`}</code>
          </pre>
        </div>

        {/* Performance & Accessibility Notes */}
        <div className="demo-card bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="font-heading text-lg font-medium mb-4 text-blue-900">
            🏆 Performance & Accessibility Excellence
          </h2>
          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex items-start gap-2">
              <span className="text-blue-600">🚀</span>
              <span><strong>Performance:</strong> Uses CSS transforms and will-change for 60fps animations</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600">♿</span>
              <span><strong>Accessibility:</strong> Full ARIA support, keyboard navigation, screen reader optimized</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600">📱</span>
              <span><strong>Mobile:</strong> Touch-optimized with disabled hover states, 44px minimum touch targets</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600">🎯</span>
              <span><strong>Design:</strong> Perfect circles, consistent with Bato's 3px border-radius system</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600">🌟</span>
              <span><strong>Animations:</strong> Respects reduced motion preferences, smooth cubic-bezier easing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorSelectionDemo;