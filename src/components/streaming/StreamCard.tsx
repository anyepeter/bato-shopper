import React, { useState } from 'react';
import { Stream } from '../../types';
import { BootstrapIcon } from '../BootstrapIcon';
import { Badge } from '../ui/badge';

// Import shop pages CSS for consistent styling
import "../../styles/shop-pages.css";

interface StreamCardProps {
  stream: Stream;
  onStreamClick: (stream: Stream) => void;
  onNavigateToPage: (page: string) => void;
}

export function StreamCard({ stream, onStreamClick, onNavigateToPage }: StreamCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.abs(now.getTime() - date.getTime());
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (stream.isLive) {
      if (hours > 0) {
        return `Live for ${hours}h ${minutes % 60}m`;
      }
      return `Live for ${minutes}m`;
    } else {
      if (hours > 0) {
        return `Starts in ${hours}h ${minutes % 60}m`;
      }
      return `Starts in ${minutes}m`;
    }
  };

  const formatViewers = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  // Generate simulated star rating based on viewer count for visual consistency with product cards
  const generateStarRating = (viewerCount: number) => {
    const rating = Math.min(5, Math.max(3.5, 3 + (viewerCount / 2000)));
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(<BootstrapIcon key={i} name="star-fill" size={16} color="#fbbf24" />);
    }
    if (hasHalfStar) {
      stars.push(<BootstrapIcon key="half" name="star-half" size={16} color="#fbbf24" />);
    }
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<BootstrapIcon key={`empty-${i}`} name="star" size={16} color="#d1d5db" />);
    }
    return stars;
  };

  const handleStreamClick = () => {
    onStreamClick(stream);
  };

  return (
    <div 
      className="group relative transition-all duration-300 overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleStreamClick}
      style={{
        backgroundColor: 'var(--pure-white)',
        borderRadius: '3px',
        boxShadow: 'var(--shadow-standard-desktop)',
        border: 'var(--border-standard-desktop)',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)'
      }}
    >
      {/* Stream Status Badge - Same position as product badge */}
      {stream.isLive && (
        <Badge 
          className="absolute top-3 left-3 z-10 bg-red-500 text-white"
          style={{
            borderRadius: '3px'
          }}
        >
          LIVE
        </Badge>
      )}

      {/* Viewer Count Badge - Same position as discount badge */}
      <Badge 
        className="absolute top-3 right-3 z-10 bg-blue-500 text-white"
        style={{
          borderRadius: '3px'
        }}
      >
        {formatViewers(stream.viewerCount)} viewers
      </Badge>

      {/* Stream Thumbnail - EXACT SAME ASPECT RATIO AS PRODUCT CARD */}
      <div className="relative aspect-[3/4] overflow-hidden" style={{ borderRadius: '3px' }}>
        <img
          src={stream.thumbnailImage}
          alt={stream.title}
          className={`w-full h-full object-cover transition-all duration-700 ease-out ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
          style={{
            filter: 'none',
            transformOrigin: 'center center',
            borderRadius: '3px'
          }}
        />
        
        {/* Overlay Actions - Same styling as product card */}
        <div className={`absolute inset-0 flex items-center justify-center gap-2 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} style={{ borderRadius: '3px' }}>
          <button
            className="btn-moema-icon btn-moema-secondary"
            style={{
              backgroundColor: 'var(--pure-white)',
              color: 'var(--medium-gray)',
              border: 'none',
              borderRadius: '3px',
              boxShadow: 'var(--shadow-standard-desktop)'
            }}
            onClick={(e) => {
              e.stopPropagation();
              console.log('Stream favorite toggle:', stream.title);
            }}
            title="Add to Favorites"
          >
            <BootstrapIcon name="heart" size={16} />
          </button>
          
          <button
            className="btn-moema-icon btn-moema-secondary"
            style={{
              backgroundColor: 'var(--pure-white)',
              color: 'var(--medium-gray)',
              border: 'none',
              borderRadius: '3px',
              boxShadow: 'var(--shadow-standard-desktop)'
            }}
            onClick={(e) => {
              e.stopPropagation();
              // Quick view functionality for streams could show stream details
            }}
            title="Quick View"
          >
            <BootstrapIcon name="eye" size={16} />
          </button>
          
          <button
            className="btn-moema-icon btn-moema-gradient-orange"
            onClick={(e) => {
              e.stopPropagation();
              if (stream.isLive) {
                onNavigateToPage('watch-live-stream');
              } else {
                handleStreamClick();
              }
            }}
            title="Watch Stream"
            style={{
              borderRadius: '3px'
            }}
          >
            <BootstrapIcon name="play-circle" size={16} />
          </button>
        </div>
      </div>

      {/* Stream Info - EXACT SAME STRUCTURE AS PRODUCT CARD */}
      <div className="p-4">
        <div className="text-sm font-medium mb-1" style={{ color: 'var(--primary-blue)' }}>{stream.category}</div>
        
        <h3 className="font-semibold mb-2 line-clamp-2 transition-colors font-heading" style={{ 
          color: isHovered ? 'var(--primary-blue)' : 'var(--black)' 
        }}>
          {stream.title}
        </h3>
        
        {/* Rating - Using simulated rating based on popularity */}
        <div className="flex items-center gap-1 mb-3">
          {generateStarRating(stream.viewerCount)}
          <span className="text-sm ml-1 font-body" style={{ color: 'var(--medium-gray)' }}>
            ({(Math.min(5, Math.max(3.5, 3 + (stream.viewerCount / 2000)))).toFixed(1)})
          </span>
        </div>

        {/* Streamer Info - Replaces price section */}
        <div className="flex items-center gap-2 mb-3">
          <img
            src={stream.streamerAvatar}
            alt={stream.streamerName}
            className="w-6 h-6 rounded-full object-cover"
            style={{ borderRadius: '3px' }}
          />
          <span className="text-lg font-bold font-body" style={{ color: 'var(--black)' }}>{stream.streamerName}</span>
        </div>

        {/* Stream Status - Replaces size selection */}
        <div className="mb-3">
          <div className="text-sm font-medium mb-2 font-body" style={{ color: 'var(--medium-gray)' }}>Status:</div>
          <div className="flex gap-1 flex-wrap items-center">
            <button
              className="px-2 py-1 text-xs border transition-colors text-white"
              style={{
                borderColor: stream.isLive ? '#10b981' : 'var(--primary-blue)',
                backgroundColor: stream.isLive ? '#10b981' : 'var(--primary-blue)',
                borderRadius: '3px'
              }}
            >
              {stream.isLive ? 'LIVE NOW' : 'UPCOMING'}
            </button>
            
            <span className="text-xs ml-2 font-body" style={{ color: 'var(--medium-gray)' }}>
              {formatTime(stream.startTime)}
            </span>
          </div>
        </div>

        {/* Featured Products - Simple thumbnail display */}
        {stream.products && stream.products.length > 0 && (
          <div className="mb-4">
            <div className="text-sm font-medium mb-2 font-body" style={{ color: 'var(--medium-gray)' }}>Featured Products:</div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {stream.products.slice(0, 3).map((product) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 w-12 h-12 rounded overflow-hidden"
                  style={{ borderRadius: '3px' }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {stream.products.length > 3 && (
                <div
                  className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-xs font-medium"
                  style={{
                    backgroundColor: 'var(--light-gray)',
                    color: 'var(--medium-gray)',
                    borderRadius: '3px'
                  }}
                >
                  +{stream.products.length - 3}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Watch Stream Button - Same style as Add to Cart button */}
        <button 
          className="btn-moema-gradient-orange btn-moema-rounded-lg w-full"
          style={{ 
            borderRadius: '3px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            height: '50px'
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (stream.isLive) {
              onNavigateToPage('watch-live-stream');
            } else {
              handleStreamClick();
            }
          }}
        >
          <BootstrapIcon name="play-circle" size={16} />
          {stream.isLive ? 'Watch Live' : 'Set Reminder'}
        </button>
      </div>
    </div>
  );
}