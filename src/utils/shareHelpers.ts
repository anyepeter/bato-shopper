// Share helper functions for social media platforms

export interface ShareData {
  url: string;
  title: string;
  text: string;
  image?: string;
}

export interface SharePlatform {
  name: string;
  icon: string;
  color: string;
  gradient: string;
  emoji: string;
  generateUrl: (data: ShareData) => string;
}

export const shareText = (productName: string, price: number): string => {
  return `Check out this amazing ${productName} for $${price}! 🔥✨ #AfricanFashion #Bato`;
};

export const generateProductUrl = (productId: number): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/product/${productId}`;
};

export const sharePlatforms: SharePlatform[] = [
  {
    name: 'WhatsApp',
    icon: 'whatsapp',
    color: '#25D366',
    gradient: 'linear-gradient(135deg, #25D366, #128C7E)',
    emoji: '💬',
    generateUrl: (data: ShareData) => 
      `https://wa.me/?text=${encodeURIComponent(`${data.text} ${data.url}`)}`
  },
  {
    name: 'TikTok',
    icon: 'tiktok',
    color: '#000000',
    gradient: 'linear-gradient(135deg, #ff0050, #000000)',
    emoji: '🎵',
    generateUrl: (data: ShareData) => 
      `https://www.tiktok.com/share?text=${encodeURIComponent(data.text)}&url=${encodeURIComponent(data.url)}`
  },
  {
    name: 'Instagram',
    icon: 'instagram',
    color: '#E4405F',
    gradient: 'linear-gradient(135deg, #833AB4, #FD1D1D, #FCB045)',
    emoji: '📸',
    generateUrl: (data: ShareData) => 
      `https://www.instagram.com/`
  },
  {
    name: 'Facebook',
    icon: 'facebook',
    color: '#1877F2',
    gradient: 'linear-gradient(135deg, #1877F2, #42A5F5)',
    emoji: '👥',
    generateUrl: (data: ShareData) => 
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}`
  },
  {
    name: 'X (Twitter)',
    icon: 'twitter',
    color: '#000000',
    gradient: 'linear-gradient(135deg, #000000, #1DA1F2)',
    emoji: '🐦',
    generateUrl: (data: ShareData) => 
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(data.text)}&url=${encodeURIComponent(data.url)}`
  },
  {
    name: 'Email',
    icon: 'envelope',
    color: '#FF6B6B',
    gradient: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
    emoji: '📧',
    generateUrl: (data: ShareData) => 
      `mailto:?subject=${encodeURIComponent(`Check out ${data.title}`)}&body=${encodeURIComponent(`${data.text}\n\n${data.url}`)}`
  },
  {
    name: 'SMS',
    icon: 'chat-dots',
    color: '#4040f8ff',
    gradient: 'linear-gradient(135deg, #4040f8ff, #5825efff)',
    emoji: '💬',
    generateUrl: (data: ShareData) => 
      `sms:?body=${encodeURIComponent(`${data.text} ${data.url}`)}`
  },
  {
    name: 'Telegram',
    icon: 'telegram',
    color: '#0088CC',
    gradient: 'linear-gradient(135deg, #0088CC, #00A3E0)',
    emoji: '✈️',
    generateUrl: (data: ShareData) => 
      `https://t.me/share/url?url=${encodeURIComponent(data.url)}&text=${encodeURIComponent(data.text)}`
  }
];

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};

// Check if native Web Share API is available and properly supported
export const isNativeShareSupported = (): boolean => {
  try {
    return 'share' in navigator && 
           typeof navigator.share === 'function' &&
           window.location.protocol === 'https:' || 
           window.location.hostname === 'localhost';
  } catch (err) {
    return false;
  }
};

// Safe native share function with fallback
export const nativeShare = async (shareData: ShareData): Promise<boolean> => {
  // Don't use native share API to avoid permission errors
  // Always use our custom share modal implementation
  return false;
};

// Enhanced share function that prioritizes custom modals
export const shareProduct = async (shareData: ShareData, onShowModal?: () => void): Promise<void> => {
  try {
    // Always use custom share modal instead of native API
    // This prevents the Web Share API permission errors
    if (onShowModal) {
      onShowModal();
      return;
    }
    
    // Fallback: copy to clipboard if no modal handler
    const success = await copyToClipboard(shareData.url);
    if (success) {
      console.log('Product URL copied to clipboard');
    } else {
      console.warn('Failed to copy URL to clipboard');
    }
  } catch (err) {
    console.error('Share failed:', err);
    // Silent fail - don't throw errors that could break the app
  }
};

export const openShareWindow = (url: string, platform: string): void => {
  const width = 600;
  const height = 400;
  const left = window.innerWidth / 2 - width / 2;
  const top = window.innerHeight / 2 - height / 2;
  
  window.open(
    url,
    `share-${platform}`,
    `width=${width},height=${height},left=${left},top=${top},toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes`
  );
};

export const trackShareEvent = (platform: string, productId: number): void => {
  // Analytics tracking for share events
  console.log(`Product ${productId} shared via ${platform}`);
  
  // Here you would typically send this data to your analytics service
  // Example: gtag('event', 'share', { method: platform, content_id: productId });
};

export const generateShareData = (product: { id: number; name: string; price: number; image: string; description?: string }): ShareData => {
  return {
    url: generateProductUrl(product.id),
    title: product.name,
    text: shareText(product.name, product.price),
    image: product.image
  };
};