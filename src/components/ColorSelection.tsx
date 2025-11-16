import React, { useState, useCallback } from 'react';
import { BootstrapIcon } from './BootstrapIcon';

interface ColorOption {
  id: string;
  name: string;
  value: string;
  previewColor: string;
  gradient?: {
    from: string;
    to: string;
    direction?: string;
  };
  pattern?: 'stripe' | 'dots' | 'texture';
  metallic?: boolean;
  accessibility?: {
    description?: string;
    contrastRatio?: number;
  };
}

interface ColorSelectionProps {
  colors: ColorOption[];
  selectedColor?: string;
  onColorChange?: (color: string) => void;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  required?: boolean;
  disabled?: boolean;
  loading?: boolean;
  loadingColorId?: string;
  className?: string;
}

const sizeClasses = {
  sm: {
    container: 'w-8 h-8',
    checkmark: 'w-3 h-3',
    spacing: 'gap-2'
  },
  md: {
    container: 'w-12 h-12',
    checkmark: 'w-4 h-4',
    spacing: 'gap-3'
  },
  lg: {
    container: 'w-16 h-16',
    checkmark: 'w-5 h-5',
    spacing: 'gap-4'
  }
};

export const ColorSelection: React.FC<ColorSelectionProps> = ({
  colors,
  selectedColor = '',
  onColorChange,
  size = 'md',
  label,
  required = false,
  disabled = false,
  loading = false,
  loadingColorId = '',
  className = ''
}) => {
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  const handleColorSelect = useCallback((colorValue: string) => {
    if (disabled) return;
    onColorChange?.(colorValue);
  }, [disabled, onColorChange]);

  const handleMouseEnter = useCallback((colorId: string) => {
    if (!disabled) {
      setHoveredColor(colorId);
    }
  }, [disabled]);

  const handleMouseLeave = useCallback(() => {
    setHoveredColor(null);
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent, colorValue: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleColorSelect(colorValue);
    }
  }, [handleColorSelect]);

  const sizeConfig = sizeClasses[size];

  return (
    <div className={`color-selection-container ${className}`}>
      {label && (
        <label className="color-selection-label font-heading block mb-3">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div 
        className={`color-selection-grid flex flex-wrap ${sizeConfig.spacing}`}
        role="radiogroup"
        aria-label={label || "Select a color"}
      >
        {colors.map((color) => {
          const isSelected = selectedColor === color.value;
          const isHovered = hoveredColor === color.id;
          const isLoading = loading && loadingColorId === color.id;
          
          return (
            <div
              key={color.id}
              className="color-option-wrapper"
              onMouseEnter={() => handleMouseEnter(color.id)}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className={`
                  color-option-button
                  ${sizeConfig.container}
                  border-2
                  relative
                  transition-all
                  duration-200
                  ease-in-out
                  focus:outline-none
                  focus:ring-2
                  focus:ring-primary-blue
                  focus:ring-offset-2
                  ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                  ${isLoading ? 'loading' : ''}
                  ${isSelected 
                    ? 'border-primary-blue shadow-lg transform scale-110' 
                    : 'border-gray-300 hover:border-primary-light-blue hover:shadow-md hover:scale-105'
                  }
                  ${isHovered && !disabled && !isLoading ? 'transform scale-105' : ''}
                `}
                style={{
                  backgroundColor: color.previewColor,
                  borderColor: isSelected ? '#5825efff' : (isHovered ? '#885cf8' : '#d1d5db')
                }}
                onClick={() => handleColorSelect(color.value)}
                onKeyDown={(e) => handleKeyDown(e, color.value)}
                disabled={disabled || isLoading}
                role="radio"
                aria-checked={isSelected}
                aria-label={`Select ${color.name} color${isLoading ? ' (loading)' : ''}`}
                tabIndex={disabled || isLoading ? -1 : 0}
              >
                {/* Enhanced inner color circle with gradient and pattern support */}
                <div
                  className={`
                    color-inner-circle
                    absolute
                    inset-1
                    transition-all
                    duration-200
                    ${isSelected ? 'ring-2 ring-white ring-inset' : ''}
                  `}
                  style={{ 
                    backgroundColor: color.gradient ? 'transparent' : color.previewColor,
                    background: color.gradient 
                      ? `linear-gradient(${color.gradient.direction || '135deg'}, ${color.gradient.from}, ${color.gradient.to})`
                      : color.previewColor
                  }}
                  data-pattern={color.pattern}
                  data-gradient={color.gradient ? 'true' : 'false'}
                >
                  {/* Checkmark for selected state */}
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div 
                        className={`
                          checkmark-background
                          ${sizeConfig.checkmark}
                          bg-white
                          flex
                          items-center
                          justify-center
                          shadow-sm
                        `}
                      >
                        <BootstrapIcon 
                          name="check" 
                          className="text-primary-blue font-bold"
                          style={{ fontSize: size === 'sm' ? '8px' : size === 'md' ? '10px' : '12px' }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Accessibility enhancement - screen reader text */}
                <span className="sr-only">
                  {color.name} {isSelected ? '(selected)' : ''}
                </span>
              </button>

              {/* Color name tooltip/label */}
              {(isHovered || isSelected) && (
                <div className="color-tooltip absolute top-full mt-2 left-1/2 transform -translate-x-1/2 z-10">
                  <div 
                    className={`
                      bg-black
                      text-white
                      px-2
                      py-1
                      rounded
                      text-xs
                      font-body
                      whitespace-nowrap
                      transition-opacity
                      duration-200
                      ${isHovered || isSelected ? 'opacity-100' : 'opacity-0'}
                    `}
                  >
                    {color.name}
                    {/* Tooltip arrow */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2">
                      <div className="border-4 border-transparent border-b-black"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected color display */}
      {selectedColor && (
        <div className="selected-color-display mt-4 flex items-center gap-2">
          <span className="font-body text-sm text-medium-gray">Selected:</span>
          <span className="font-heading text-sm font-medium">
            {colors.find(c => c.value === selectedColor)?.name || selectedColor}
          </span>
        </div>
      )}
    </div>
  );
};

// Default color options for common use cases
export const defaultColors: ColorOption[] = [
  { id: 'black', name: 'Black', value: 'black', previewColor: '#000000' },
  { id: 'white', name: 'White', value: 'white', previewColor: '#ffffff' },
  { id: 'red', name: 'Red', value: 'red', previewColor: '#dc2626' },
  { id: 'blue', name: 'Blue', value: 'blue', previewColor: '#2563eb' },
  { id: 'green', name: 'Green', value: 'green', previewColor: '#16a34a' },
  { id: 'purple', name: 'Purple', value: 'purple', previewColor: '#5825efff' },
  { id: 'pink', name: 'Pink', value: 'pink', previewColor: '#ec4899' },
  { id: 'yellow', name: 'Yellow', value: 'yellow', previewColor: '#eab308' },
  { id: 'orange', name: 'Orange', value: 'orange', previewColor: '#ea580c' },
  { id: 'gray', name: 'Gray', value: 'gray', previewColor: '#6b7280' }
];

// Preset color collections for different product types
export const fashionColors: ColorOption[] = [
  { id: 'midnight-black', name: 'Midnight Black', value: 'midnight-black', previewColor: '#1a1a1a' },
  { id: 'pure-white', name: 'Pure White', value: 'pure-white', previewColor: '#ffffff' },
  { id: 'navy-blue', name: 'Navy Blue', value: 'navy-blue', previewColor: '#1e3a8a' },
  { id: 'burgundy', name: 'Burgundy', value: 'burgundy', previewColor: '#7c2d12' },
  { id: 'emerald', name: 'Emerald', value: 'emerald', previewColor: '#059669' },
  { id: 'royal-purple', name: 'Royal Purple', value: 'royal-purple', previewColor: '#5825efff' },
  { id: 'blush-pink', name: 'Blush Pink', value: 'blush-pink', previewColor: '#f472b6' },
  { id: 'champagne', name: 'Champagne', value: 'champagne', previewColor: '#fbbf24' },
  { id: 'terracotta', name: 'Terracotta', value: 'terracotta', previewColor: '#ea580c' },
  { id: 'sage-green', name: 'Sage Green', value: 'sage-green', previewColor: '#84cc16' }
];

export default ColorSelection;