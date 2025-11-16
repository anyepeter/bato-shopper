import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BootstrapIcon, 
  HeartIcon, 
  CartIcon, 
  SearchIcon, 
  UserIcon, 
  StarIcon, 
  MenuIcon, 
  CloseIcon, 
  ChatIcon, 
  ArrowLeftIcon, 
  ArrowRightIcon, 
  EyeIcon, 
  SettingsIcon, 
  PhoneIcon, 
  EmailIcon, 
  LocationIcon, 
  SendIcon, 
  CalendarIcon, 
  DressIcon, 
  CrownIcon, 
  SmileIcon 
} from './BootstrapIcon';

interface BootstrapIconExamplesProps {
  onClose?: () => void;
}

export function BootstrapIconExamples({ onClose }: BootstrapIconExamplesProps) {
  const [selectedCategory, setSelectedCategory] = useState<'basic' | 'ecommerce' | 'emoji' | 'african'>('basic');
  const [favoriteItems, setFavoriteItems] = useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    setFavoriteItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const basicIcons = [
    { name: 'menu', component: MenuIcon, description: 'Navigation menu' },
    { name: 'close', component: CloseIcon, description: 'Close/Cancel' },
    { name: 'search', component: SearchIcon, description: 'Search functionality' },
    { name: 'arrow-left', component: ArrowLeftIcon, description: 'Back navigation' },
    { name: 'arrow-right', component: ArrowRightIcon, description: 'Forward navigation' },
    { name: 'settings', component: SettingsIcon, description: 'Settings & config' },
    { name: 'user', component: UserIcon, description: 'User profile' },
    { name: 'eye', component: EyeIcon, description: 'View/Preview' },
    { name: 'phone', component: PhoneIcon, description: 'Phone contact' },
    { name: 'email', component: EmailIcon, description: 'Email contact' },
    { name: 'location', component: LocationIcon, description: 'Location/Address' },
    { name: 'send', component: SendIcon, description: 'Send message' },
    { name: 'calendar', component: CalendarIcon, description: 'Date/Time' },
    { name: 'chat', component: ChatIcon, description: 'Live chat' }
  ];

  const ecommerceIcons = [
    { name: 'heart', component: HeartIcon, description: 'Favorites/Wishlist' },
    { name: 'cart', component: CartIcon, description: 'Shopping cart' },
    { name: 'star', component: StarIcon, description: 'Ratings & Reviews' },
    { name: 'dress', component: DressIcon, description: 'Fashion/Clothing' },
    { name: 'crown', component: CrownIcon, description: 'Premium/Luxury' },
    { name: 'bag', description: 'Shopping bag' },
    { name: 'tag', description: 'Price tags' },
    { name: 'gift', description: 'Gift items' },
    { name: 'truck', description: 'Shipping/Delivery' },
    { name: 'credit-card', description: 'Payment' },
    { name: 'receipt', description: 'Order receipt' },
    { name: 'return', description: 'Returns' }
  ];

  const emojiReplacements = [
    { emoji: '❤️', icon: 'heart', description: 'Love/Like' },
    { emoji: '🛒', icon: 'cart', description: 'Shopping' },
    { emoji: '⭐', icon: 'star', description: 'Rating/Favorite' },
    { emoji: '👤', icon: 'person', description: 'User/Person' },
    { emoji: '📱', icon: 'phone', description: 'Mobile/Contact' },
    { emoji: '📧', icon: 'envelope', description: 'Email' },
    { emoji: '📍', icon: 'geo-alt', description: 'Location' },
    { emoji: '🔍', icon: 'search', description: 'Search' },
    { emoji: '👗', icon: 'person-dress', description: 'Fashion/Dress' },
    { emoji: '👑', icon: 'gem', description: 'Crown/Premium' },
    { emoji: '😊', icon: 'emoji-smile', description: 'Happy/Smile' },
    { emoji: '🎉', icon: 'party-hat', description: 'Celebration' },
    { emoji: '💎', icon: 'gem', description: 'Premium/Diamond' },
    { emoji: '🌟', icon: 'star', description: 'Special/Featured' },
    { emoji: '💖', icon: 'heart-fill', description: 'Love/Affection' },
    { emoji: '🔥', icon: 'fire', description: 'Hot/Trending' }
  ];

  const africanFashionIcons = [
    { name: 'person-dress', description: 'African fashion/Traditional wear' },
    { name: 'gem', description: 'Jewelry/Precious items' },
    { name: 'award', description: 'Quality/Premium items' },
    { name: 'hand-thumbs-up', description: 'Handmade/Artisan' },
    { name: 'patch-check', description: 'Authentic/Verified' },
    { name: 'house-heart', description: 'Traditional/Cultural' },
    { name: 'globe-americas', description: 'African heritage' },
    { name: 'party-hat', description: 'Celebration/Festival' },
    { name: 'calendar-event', description: 'Cultural events' },
    { name: 'people', description: 'Community/Culture' },
    { name: 'heart-fill', description: 'Made with love' },
    { name: 'lightning', description: 'Fast/Premium service' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 
            className="text-3xl font-bold mb-2"
            style={{ 
              fontFamily: 'var(--font-heading)',
              color: 'var(--primary-blue)'
            }}
          >
            🎯 Bootstrap Icons System
          </h2>
          <p 
            className="text-gray-600"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Comprehensive icon system for the Modish Style application
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <CloseIcon size={24} />
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-4 mb-8 border-b">
        {[
          { key: 'basic' as const, label: 'Basic Icons', icon: 'star' },
          { key: 'ecommerce' as const, label: 'E-commerce', icon: 'cart' },
          { key: 'emoji' as const, label: 'Emoji Replacements', icon: 'emoji-smile' },
          { key: 'african' as const, label: 'African Fashion', icon: 'gem' }
        ].map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg transition-all ${
              selectedCategory === key
                ? 'border-b-2 text-white'
                : 'text-gray-600 hover:text-orange-500 hover:bg-gray-50'
            }`}
            style={{ 
              fontFamily: 'var(--font-body)',
              borderColor: selectedCategory === key ? '#df660d' : 'transparent',
              backgroundColor: selectedCategory === key ? '#df660d' : 'transparent'
            }}
          >
            <BootstrapIcon name={icon} size={20} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Basic Icons */}
      {selectedCategory === 'basic' && (
        <div>
          <h3 className="text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Basic Bootstrap Icons
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {basicIcons.map(({ name, component: IconComponent, description }) => (
              <motion.div
                key={name}
                className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="mb-3 p-3 rounded-full" style={{ backgroundColor: 'rgba(223, 102, 13, 0.1)' }}>
                  {IconComponent ? (
                    <IconComponent size={32} color="#df660d" />
                  ) : (
                    <BootstrapIcon name={name} size={32} color="#df660d" />
                  )}
                </div>
                <h4 
                  className="text-sm font-medium text-center"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {name}
                </h4>
                <p 
                  className="text-xs text-gray-500 text-center mt-1"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* E-commerce Icons */}
      {selectedCategory === 'ecommerce' && (
        <div>
          <h3 className="text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            E-commerce & Shopping Icons
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {ecommerceIcons.map(({ name, component: IconComponent, description }, index) => {
              const isFavorite = favoriteItems.includes(index);
              return (
                <motion.div
                  key={name}
                  className="flex flex-col items-center p-4 rounded-lg hover:bg-orange-50 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => name === 'heart' && toggleFavorite(index)}
                >
                  <div className="mb-3 p-3 rounded-full" style={{ backgroundColor: 'rgba(223, 102, 13, 0.1)' }}>
                    {IconComponent ? (
                      <IconComponent 
                        size={32} 
                        color={name === 'heart' && isFavorite ? '#ef4444' : '#df660d'} 
                      />
                    ) : (
                      <BootstrapIcon 
                        name={name} 
                        size={32} 
                        color="#df660d" 
                      />
                    )}
                  </div>
                  <h4 
                    className="text-sm font-medium text-center"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {name}
                  </h4>
                  <p 
                    className="text-xs text-gray-500 text-center mt-1"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {description}
                  </p>
                  {name === 'heart' && (
                    <p className="text-xs mt-1" style={{ color: '#df660d' }}>
                      Click to toggle!
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Emoji Replacements */}
      {selectedCategory === 'emoji' && (
        <div>
          <h3 className="text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Emoji → Bootstrap Icons Replacements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {emojiReplacements.map(({ emoji, icon, description }, index) => (
              <motion.div
                key={index}
                className="flex items-center p-4 rounded-lg hover:bg-orange-50 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center space-x-4 flex-1">
                  {/* Old Emoji */}
                  <div className="text-center">
                    <div className="text-2xl mb-1">{emoji}</div>
                    <p className="text-xs text-gray-400">Before</p>
                  </div>
                  
                  {/* Arrow */}
                  <ArrowRightIcon size={16} color="#9ca3af" />
                  
                  {/* New Bootstrap Icon */}
                  <div className="text-center">
                    <div className="mb-1">
                      <BootstrapIcon name={icon} size={24} color="#df660d" />
                    </div>
                    <p className="text-xs text-orange-600">After</p>
                  </div>
                  
                  {/* Description */}
                  <div className="flex-1">
                    <p 
                      className="text-sm font-medium"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {description}
                    </p>
                    <p 
                      className="text-xs text-gray-500"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      bi-{icon}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* African Fashion Icons */}
      {selectedCategory === 'african' && (
        <div>
          <h3 className="text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            African Fashion & Cultural Icons
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {africanFashionIcons.map(({ name, description }, index) => (
              <motion.div
                key={name}
                className="flex flex-col items-center p-4 rounded-lg hover:bg-orange-50 transition-colors cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div 
                  className="mb-3 p-3 rounded-full"
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(223, 102, 13, 0.1), rgba(245, 113, 15, 0.1))'
                  }}
                >
                  <BootstrapIcon name={name} size={32} color="#df660d" />
                </div>
                <h4 
                  className="text-sm font-medium text-center"
                  style={{ 
                    fontFamily: 'var(--font-body)',
                    color: '#df660d'
                  }}
                >
                  {name}
                </h4>
                <p 
                  className="text-xs text-gray-500 text-center mt-1"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Demo Section */}
      <div className="mt-12 p-6 rounded-xl" style={{ backgroundColor: 'rgba(223, 102, 13, 0.05)' }}>
        <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          Interactive Demo
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Card Demo */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-medium mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
              Product Card Icons
            </h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <HeartIcon 
                  size={20} 
                  color={favoriteItems.includes(999) ? '#ef4444' : '#9ca3af'}
                  interactive
                  onClick={() => toggleFavorite(999)}
                  className="transition-colors duration-200"
                />
                <EyeIcon size={20} color="#df660d" interactive />
                <CartIcon size={20} color="#df660d" interactive />
              </div>
              <div className="flex items-center space-x-1">
                {[1,2,3,4,5].map(star => (
                  <StarIcon key={star} size={16} color="#fbbf24" />
                ))}
              </div>
            </div>
          </div>

          {/* Contact Info Demo */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-medium mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
              Contact Icons
            </h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <EmailIcon size={16} color="#df660d" />
                <span className="text-sm">hello@modishstyle.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <PhoneIcon size={16} color="#df660d" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <LocationIcon size={16} color="#df660d" />
                <span className="text-sm">123 Fashion Avenue, NY</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Code Example */}
      <div className="mt-8 p-6 bg-gray-900 rounded-xl">
        <h4 className="text-lg font-semibold mb-4 text-white" style={{ fontFamily: 'var(--font-heading)' }}>
          Usage Examples
        </h4>
        <pre className="text-green-400 text-sm overflow-x-auto">
          <code>{`// Component Usage
import { HeartIcon, CartIcon, BootstrapIcon } from "./components/BootstrapIcon";

// Basic icon
<HeartIcon size={20} color="#df660d" />

// Interactive icon
<CartIcon size={24} interactive onClick={handleAddToCart} />

// Custom Bootstrap icon
<BootstrapIcon name="gem" size={32} color="#df660d" />

// Direct Bootstrap CSS classes
<i className="bi bi-heart" style={{ fontSize: '20px', color: '#df660d' }} />

// Replacing emojis
❤️  →  <HeartIcon size={16} />
🛒  →  <CartIcon size={16} />
⭐  →  <StarIcon size={16} />
👤  →  <UserIcon size={16} />

// African fashion themed
<BootstrapIcon name="person-dress" size={24} />  // 👗
<BootstrapIcon name="gem" size={24} />           // 👑/💎
<BootstrapIcon name="party-hat" size={24} />    // 🎉`}</code>
        </pre>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t text-center">
        <p 
          className="text-sm text-gray-500"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          🎯 <strong>1000+</strong> Bootstrap Icons available • 
          🧡 <strong>Modish Style</strong> orange theme ready • 
          ⚡ <strong>CDN optimized</strong> for fast loading • 
          ♿ <strong>Accessible</strong> with proper titles
        </p>
      </div>
    </div>
  );
}