import React from 'react';

interface BootstrapIconProps {
  /** Bootstrap Icons class name (without 'bi bi-' prefix) */
  name: string;
  /** Size in pixels or CSS unit */
  size?: number | string;
  /** Color of the icon */
  color?: string;
  /** Additional CSS classes */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** onClick handler */
  onClick?: () => void;
  /** Title for accessibility */
  title?: string;
  /** Whether the icon is interactive */
  interactive?: boolean;
}

// Comprehensive icon mapping from common icon usage to Bootstrap Icons
export const BOOTSTRAP_ICON_MAP: Record<string, string> = {
  // Navigation & UI
  'menu': 'list',
  'hamburger': 'list',
  'close': 'x-lg',
  'x': 'x',
  'x-lg': 'x-lg',
  'search': 'search',
  'grid_view': 'grid',
  'grid': 'grid',
  'filter': 'funnel',
  'sort': 'sort-down',
  'home': 'house',
  'back': 'arrow-left',
  'forward': 'arrow-right',
  'arrow-left': 'arrow-left',
  'arrow-right': 'arrow-right',
  'arrow-up': 'arrow-up',
  'arrow-down': 'arrow-down',
  'chevron-left': 'chevron-left',
  'chevron-right': 'chevron-right',
  'chevron-up': 'chevron-up',
  'chevron-down': 'chevron-down',
  'more-horizontal': 'three-dots',
  'more-vertical': 'three-dots-vertical',
  'plus': 'plus',
  'minus': 'dash',
  'check': 'check',
  'checkmark': 'check',
  'tick': 'check',

  // E-commerce & Shopping
  'shopping-cart': 'cart',
  'cart': 'cart',
  'shopping-bag': 'bag',
  'bag': 'bag',
  'heart': 'heart',
  'heart-filled': 'heart-fill',
  'love': 'heart',
  'favorite': 'heart',
  'star': 'star',
  'star-filled': 'star-fill',
  'rating': 'star',
  'eye': 'eye',
  'view': 'eye',
  'quick-view': 'eye',

  // User & Profile
  'user': 'person',
  'person': 'person',
  'profile': 'person-circle',
  'account': 'person-circle',
  'users': 'people',
  'people': 'people',
  'admin': 'person-badge',

  // Communication & Social
  'chat': 'chat',
  'message': 'chat-dots',
  'mail': 'envelope',
  'email': 'envelope',
  'send': 'send',
  'phone': 'telephone',
  'video': 'camera-video',
  'call': 'telephone',

  // Actions & Status
  'edit': 'pencil',
  'delete': 'trash',
  'remove': 'trash',
  'add': 'plus',
  'save': 'check',
  'cancel': 'x',
  'settings': 'gear',
  'config': 'gear',
  'info': 'info-circle',
  'warning': 'exclamation-triangle',
  'error': 'x-circle',
  'success': 'check-circle',
  'loading': 'arrow-repeat',
  'refresh': 'arrow-clockwise',
  'download': 'download',
  'upload': 'upload',
  'share': 'share',
  'copy': 'clipboard',
  'link': 'link-45deg',

  // Media & Files
  'image': 'image',
  'photo': 'image',
  'file': 'file-earmark',
  'document': 'file-earmark-text',
  'pdf': 'file-earmark-pdf',
  'folder': 'folder',
  'camera': 'camera',
  'play': 'play',
  'pause': 'pause',
  'stop': 'stop',
  'volume': 'volume-up',
  'mute': 'volume-mute',

  // Location & Maps
  'location': 'geo-alt',
  'pin': 'geo-alt',
  'map': 'map',
  'navigate': 'signpost',
  'compass': 'compass',

  // Time & Calendar
  'calendar': 'calendar',
  'date': 'calendar-date',
  'clock': 'clock',
  'time': 'clock',

  // Security & Privacy
  'lock': 'lock',
  'unlock': 'unlock',
  'shield': 'shield',
  'key': 'key',
  'security': 'shield-check',

  // Shopping & E-commerce Specific
  'dress': 'person-dress',
  'clothing': 'person-dress',
  'fashion': 'person-dress',
  'checkroom': 'person-dress',
  'shirt': 'person-dress',
  'size': 'rulers',
  'measure': 'rulers',
  'gift': 'gift',
  'tag': 'tag',
  'price': 'currency-dollar',
  'discount': 'percent',
  'sale': 'tag',
  'new': 'plus-circle',
  'trending': 'graph-up-arrow',
  'popular': 'fire',

  // Social Media
  'facebook': 'facebook',
  'twitter': 'twitter',
  'instagram': 'instagram',
  'linkedin': 'linkedin',
  'pinterest': 'pinterest',
  'youtube': 'youtube',
  'tiktok': 'tiktok',

  // Emotions & Expressions (replacing emojis)
  'smile': 'emoji-smile',
  'happy': 'emoji-smile',
  'laugh': 'emoji-laughing',
  'love-eyes': 'emoji-heart-eyes',
  'wink': 'emoji-wink',
  'sad': 'emoji-frown',
  'angry': 'emoji-angry',
  'surprised': 'emoji-surprised',
  'neutral': 'emoji-neutral',

  // African Fashion & Culture Themed
  'crown': 'gem',
  'jewelry': 'gem',
  'diamond': 'gem',
  'royal': 'award',
  'premium': 'award',
  'quality': 'patch-check',
  'authentic': 'patch-check',
  'handmade': 'hand-thumbs-up',
  'thumbs-up': 'hand-thumbs-up',
  'thumbs-down': 'hand-thumbs-down',
  'traditional': 'house-heart',
  'cultural': 'globe-americas',
  'african': 'globe-americas',
  'celebration': 'party-hat',
  'festival': 'calendar-event',

  // Business & Analytics
  'analytics': 'graph-up',
  'chart': 'bar-chart',
  'report': 'file-earmark-bar-graph',
  'dashboard': 'speedometer2',
  'stats': 'graph-up-arrow',
  'growth': 'trending-up',
  'decline': 'trending-down',

  // Shipping & Delivery
  'shipping': 'truck',
  'delivery': 'truck',
  'package': 'box',
  'fast-delivery': 'lightning',
  'tracking': 'geo-alt',
  'returns': 'arrow-return-left',
  'exchange': 'arrow-left-right',

  // Payment & Finance
  'payment': 'credit-card',
  'card': 'credit-card',
  'wallet': 'wallet2',
  'money': 'currency-dollar',
  'cash': 'cash',
  'invoice': 'receipt',
  'receipt': 'receipt',

  // Customer Service
  'help': 'question-circle',
  'support': 'headset',
  'faq': 'question-circle',
  'contact': 'person-lines-fill',
  'feedback': 'chat-square-text',
  'review': 'star-half',
  'testimonial': 'chat-quote',

  // System & Technical
  'wifi': 'wifi',
  'bluetooth': 'bluetooth',
  'battery': 'battery-full',
  'signal': 'reception-4',
  'notification': 'bell',
  'alert': 'bell-fill',
  'bookmark': 'bookmark',
  'flag': 'flag',
  'tag-label': 'tags',
  'layers': 'layers',
  'stack': 'stack',
  'database': 'server',
  'cloud': 'cloud',
  'sync': 'arrow-repeat',
  
  // Business & Finance
  'account_balance': 'bank',
  'bank': 'bank',
  'building': 'building'
};

export function BootstrapIcon({
  name,
  size = 16,
  color = 'currentColor',
  className = '',
  style = {},
  onClick,
  title,
  interactive = false
}: BootstrapIconProps) {
  // Get mapped Bootstrap icon name or use the provided name directly
  const iconName = BOOTSTRAP_ICON_MAP[name] || name;
  
  // Determine if this should be a button or span
  const isClickable = onClick || interactive;
  
  const iconStyles: React.CSSProperties = {
    fontSize: typeof size === 'number' ? `${size}px` : size,
    color,
    cursor: isClickable ? 'pointer' : 'inherit',
    display: 'inline-block',
    lineHeight: 1,
    verticalAlign: 'middle',
    ...style
  };

  const iconClassName = `bi bi-${iconName} ${className}`.trim();

  if (isClickable) {
    return (
      <button
        onClick={onClick}
        className={`bootstrap-icon-btn ${className}`}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          margin: 0,
          ...iconStyles
        }}
        title={title || name}
        type="button"
      >
        <i className={iconClassName} />
      </button>
    );
  }

  return (
    <i 
      className={iconClassName}
      style={iconStyles}
      title={title || name}
      onError={(e) => {
        console.warn(`Bootstrap Icon failed to load: ${iconName}`, e);
      }}
    />
  );
}

// Convenience components for common icons
export function HeartIcon(props: Omit<BootstrapIconProps, 'name'>) {
  return <BootstrapIcon name="heart" {...props} />;
}

export function CartIcon(props: Omit<BootstrapIconProps, 'name'>) {
  return <BootstrapIcon name="cart" {...props} />;
}

export function SearchIcon(props: Omit<BootstrapIconProps, 'name'>) {
  return <BootstrapIcon name="search" {...props} />;
}

export function UserIcon(props: Omit<BootstrapIconProps, 'name'>) {
  return <BootstrapIcon name="user" {...props} />;
}

export function StarIcon(props: Omit<BootstrapIconProps, 'name'>) {
  return <BootstrapIcon name="star" {...props} />;
}

export function MenuIcon(props: Omit<BootstrapIconProps, 'name'>) {
  return <BootstrapIcon name="menu" {...props} />;
}

export function CloseIcon(props: Omit<BootstrapIconProps, 'name'>) {
  return <BootstrapIcon name="close" {...props} />;
}

export function ChatIcon(props: Omit<BootstrapIconProps, 'name'>) {
  return <BootstrapIcon name="chat" {...props} />;
}

export function ArrowLeftIcon(props: Omit<BootstrapIconProps, 'name'>) {
  return <BootstrapIcon name="arrow-left" {...props} />;
}

export function ArrowRightIcon(props: Omit<BootstrapIconProps, 'name'>) {
  return <BootstrapIcon name="arrow-right" {...props} />;
}

export function EyeIcon(props: Omit<BootstrapIconProps, 'name'>) {
  return <BootstrapIcon name="eye" {...props} />;
}

export function SettingsIcon(props: Omit<BootstrapIconProps, 'name'>) {
  return <BootstrapIcon name="settings" {...props} />;
}

export function PhoneIcon(props: Omit<BootstrapIconProps, 'name'>) {
  return <BootstrapIcon name="phone" {...props} />;
}

export function EmailIcon(props: Omit<BootstrapIconProps, 'name'>) {
  return <BootstrapIcon name="email" {...props} />;
}

export function LocationIcon(props: Omit<BootstrapIconProps, 'name'>) {
  return <BootstrapIcon name="location" {...props} />;
}

export function SendIcon(props: Omit<BootstrapIconProps, 'name'>) {
  return <BootstrapIcon name="send" {...props} />;
}

export function CalendarIcon(props: Omit<BootstrapIconProps, 'name'>) {
  return <BootstrapIcon name="calendar" {...props} />;
}

export function DressIcon(props: Omit<BootstrapIconProps, 'name'>) {
  return <BootstrapIcon name="dress" {...props} />;
}

export function CrownIcon(props: Omit<BootstrapIconProps, 'name'>) {
  return <BootstrapIcon name="crown" {...props} />;
}

export function SmileIcon(props: Omit<BootstrapIconProps, 'name'>) {
  return <BootstrapIcon name="smile" {...props} />;
}

export function GridIcon(props: Omit<BootstrapIconProps, 'name'>) {
  return <BootstrapIcon name="grid_view" {...props} />;
}

export function CheckroomIcon(props: Omit<BootstrapIconProps, 'name'>) {
  return <BootstrapIcon name="checkroom" {...props} />;
}

export function ShirtIcon(props: Omit<BootstrapIconProps, 'name'>) {
  return <BootstrapIcon name="shirt" {...props} />;
}

export function LayersIcon(props: Omit<BootstrapIconProps, 'name'>) {
  return <BootstrapIcon name="layers" {...props} />;
}

export function AccountBalanceIcon(props: Omit<BootstrapIconProps, 'name'>) {
  return <BootstrapIcon name="account_balance" {...props} />;
}

export function DiamondIcon(props: Omit<BootstrapIconProps, 'name'>) {
  return <BootstrapIcon name="diamond" {...props} />;
}