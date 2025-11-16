import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectSeparator,
  SelectGroup
} from './ui/select';

export function SelectAnimationDemo() {
  return (
    <div className="w-full max-w-4xl mx-auto p-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="font-heading text-3xl" style={{ color: 'var(--primary-blue)' }}>
          ✨ Captivating Select Animations
        </h1>
        <p className="font-body text-lg" style={{ color: 'var(--medium-gray)' }}>
          Experience the graceful expanding dropdowns with elegant animations
        </p>
      </div>

      {/* Demo Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Standard Select */}
        <div className="space-y-4">
          <h3 className="font-heading text-xl" style={{ color: 'var(--primary-blue)' }}>
            🎭 Standard Select
          </h3>
          <p className="font-body text-sm" style={{ color: 'var(--medium-gray)' }}>
            Click to see the graceful expanding animation with smooth descent
          </p>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dresses">👗 African Dresses</SelectItem>
              <SelectItem value="tops">👚 Traditional Tops</SelectItem>
              <SelectItem value="accessories">💍 Accessories</SelectItem>
              <SelectItem value="shoes">👠 Footwear</SelectItem>
              <SelectItem value="bags">👜 Handbags</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Grouped Select */}
        <div className="space-y-4">
          <h3 className="font-heading text-xl" style={{ color: 'var(--primary-blue)' }}>
            🌟 Grouped Options
          </h3>
          <p className="font-body text-sm" style={{ color: 'var(--medium-gray)' }}>
            Watch the staggered item animations with elegant grouping
          </p>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose your style..." />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Traditional Wear</SelectLabel>
                <SelectItem value="ankara">🌍 Ankara Prints</SelectItem>
                <SelectItem value="kente">🎨 Kente Cloth</SelectItem>
                <SelectItem value="dashiki">👘 Dashiki Shirts</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Modern Fusion</SelectLabel>
                <SelectItem value="contemporary">💫 Contemporary</SelectItem>
                <SelectItem value="casual">😊 Casual Wear</SelectItem>
                <SelectItem value="formal">🎩 Formal Attire</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Size Select */}
        <div className="space-y-4">
          <h3 className="font-heading text-xl" style={{ color: 'var(--primary-blue)' }}>
            📏 Size Selection
          </h3>
          <p className="font-body text-sm" style={{ color: 'var(--medium-gray)' }}>
            Notice the subtle background changes and shadow depth effects
          </p>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select size..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="xs">XS - Extra Small</SelectItem>
              <SelectItem value="s">S - Small</SelectItem>
              <SelectItem value="m">M - Medium</SelectItem>
              <SelectItem value="l">L - Large</SelectItem>
              <SelectItem value="xl">XL - Extra Large</SelectItem>
              <SelectItem value="xxl">XXL - Double Extra Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Color Select */}
        <div className="space-y-4">
          <h3 className="font-heading text-xl" style={{ color: 'var(--primary-blue)' }}>
            🎨 Color Options
          </h3>
          <p className="font-body text-sm" style={{ color: 'var(--medium-gray)' }}>
            Experience the smooth easing and natural responsive feel
          </p>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose color..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="red">🔴 Vibrant Red</SelectItem>
              <SelectItem value="blue">🔵 Royal Blue</SelectItem>
              <SelectItem value="green">🟢 Forest Green</SelectItem>
              <SelectItem value="yellow">🟡 Golden Yellow</SelectItem>
              <SelectItem value="purple">🟣 Deep Purple</SelectItem>
              <SelectItem value="orange">🟠 Sunset Orange</SelectItem>
            </SelectContent>
          </Select>
        </div>

      </div>

      {/* Features List */}
      <div 
        className="p-6 rounded-lg border"
        style={{
          backgroundColor: 'rgba(88, 37, 239, 0.05)',
          borderColor: 'rgba(88, 37, 239, 0.2)',
          borderRadius: '3px'
        }}
      >
        <h3 className="font-heading text-xl mb-4" style={{ color: 'var(--primary-blue)' }}>
          🎪 Animation Features
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="font-body">✨ <strong>Graceful Expansion:</strong> Height gradually increases as dropdown descends</div>
            <div className="font-body">🌊 <strong>Soft Easing:</strong> Elegant cubic-bezier transitions for natural feel</div>
            <div className="font-body">⏱️ <strong>Perfect Timing:</strong> Slight delay before full reveal invites focus</div>
            <div className="font-body">🎭 <strong>Staggered Items:</strong> Options appear with beautiful cascading effect</div>
          </div>
          <div className="space-y-2">
            <div className="font-body">🌈 <strong>Depth & Dimension:</strong> Enhanced shadows and background changes</div>
            <div className="font-body">💫 <strong>Smooth Interactions:</strong> Hover and focus states with gentle feedback</div>
            <div className="font-body">📱 <strong>Mobile Optimized:</strong> Touch-friendly with enhanced mobile animations</div>
            <div className="font-body">⚡ <strong>Performance:</strong> GPU-accelerated for smooth 60fps animations</div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center space-y-2">
        <p className="font-body" style={{ color: 'var(--medium-gray)' }}>
          💡 <strong>Try clicking on any dropdown above to experience the captivating animations!</strong>
        </p>
        <p className="font-body text-sm" style={{ color: 'var(--medium-gray)' }}>
          Notice the graceful expansion, elegant easing, and delightful visual depth effects
        </p>
      </div>
    </div>
  );
}