import React from 'react';
import { useApp } from '../AppProvider';
import { STREAM_CATEGORIES, STREAM_CATEGORY_LABELS } from '../../constants/streamingData';
import { BootstrapIcon } from '../BootstrapIcon';

const CATEGORY_ICONS = {
  'all': 'grid',
  'traditional-designs': 'star',
  'contemporary-african': 'palette',
  'designer-showcases': 'award',
  'cultural-events': 'calendar-event',
  'new-arrivals': 'lightning',
  'styling-tips': 'lightbulb'
};

export function StreamCategories() {
  const { state, actions } = useApp();

  const handleCategorySelect = (category: string) => {
    actions.filterStreamsByCategory(category);
  };

  if (state.isMobile) {
    return (
      <div className="px-6 py-6">
        <div className="flex gap-4 overflow-x-auto pb-2">
          {STREAM_CATEGORIES.map((category) => {
            const isSelected = state.selectedStreamCategory === category;
            const iconName = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS];
            
            return (
              <button
                key={category}
                data-category={category}
                onClick={() => handleCategorySelect(category)}
                className={`
                  flex-shrink-0 flex items-center gap-3 px-6 py-3 rounded-full font-body text-base font-bold transition-all duration-300 backdrop-blur-md
                  ${isSelected 
                    ? 'scale-105 shadow-xl' 
                    : 'hover:scale-105 active:scale-95'
                  }
                `}
                style={{ 
                  borderRadius: 'var(--radius-xl)',
                  background: isSelected 
                    ? 'linear-gradient(45deg, #00f2ea, #ff00c7)'
                    : 'linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(0, 242, 234, 0.1))',
                  border: isSelected 
                    ? '1px solid rgba(0, 242, 234, 0.5)'
                    : '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: isSelected 
                    ? '0 0 30px rgba(0, 242, 234, 0.4), 0 8px 32px rgba(0, 0, 0, 0.3)'
                    : '0 8px 32px rgba(0, 0, 0, 0.2)',
                  color: 'white',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                }}
              >
                <BootstrapIcon 
                  name={iconName} 
                  className="w-5 h-5 text-white"
                  style={{ 
                    filter: isSelected ? 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))' : 'none'
                  }}
                />
                <span className="whitespace-nowrap">
                  {STREAM_CATEGORY_LABELS[category as keyof typeof STREAM_CATEGORY_LABELS]}
                </span>
                {isSelected && (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ boxShadow: '0 0 8px white' }}></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="bg-white rounded-lg p-4 border border-border h-fit sticky top-6">
      <h3 className="font-heading text-lg text-black mb-4">Categories</h3>
      <div className="space-y-2">
        {STREAM_CATEGORIES.map((category) => {
          const isSelected = state.selectedStreamCategory === category;
          const iconName = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS];
          
          return (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`
                w-full flex items-center gap-3 px-3 py-2 rounded-lg font-body text-sm transition-all duration-200
                ${isSelected 
                  ? 'bg-primary-extra-light-blue text-primary-blue border border-primary-blue/20' 
                  : 'text-medium-gray hover:bg-light-gray hover:text-black'
                }
              `}
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              <BootstrapIcon 
                name={iconName} 
                className={`w-4 h-4 ${isSelected ? 'text-primary-blue' : 'text-medium-gray'}`} 
              />
              <span className="font-medium">
                {STREAM_CATEGORY_LABELS[category as keyof typeof STREAM_CATEGORY_LABELS]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}