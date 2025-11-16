import { Stream, Product } from '../types';
import { SAMPLE_PRODUCTS } from './products';

// Mock streaming data for Modish Style live streaming platform
export const STREAM_CATEGORIES = [
  'all',
  'traditional-designs',
  'contemporary-african',
  'designer-showcases',
  'cultural-events',
  'new-arrivals',
  'styling-tips'
];

export const STREAM_CATEGORY_LABELS = {
  'all': 'All Streams',
  'traditional-designs': 'Traditional Designs',
  'contemporary-african': 'Contemporary African',
  'designer-showcases': 'Designer Showcases',
  'cultural-events': 'Cultural Events',
  'new-arrivals': 'New Arrivals',
  'styling-tips': 'Styling Tips'
};

// Featured products for live streams - using actual products from the main catalog
export const STREAM_FEATURED_PRODUCTS: Product[] = [
  SAMPLE_PRODUCTS[0], // Vibrant Ankara Maxi Dress
  SAMPLE_PRODUCTS[1], // Traditional African Print Top
  SAMPLE_PRODUCTS[2], // Elegant African Print Ensemble
  SAMPLE_PRODUCTS[6], // Traditional African Beaded Jewelry Set
  SAMPLE_PRODUCTS[7], // Colorful African Headwrap
  SAMPLE_PRODUCTS[8], // Handwoven African Tote Bag
  SAMPLE_PRODUCTS[9], // Elegant Kente Print Midi Dress
  SAMPLE_PRODUCTS[10], // African Print Wrap Blouse
  SAMPLE_PRODUCTS[11], // Statement African Earrings
  SAMPLE_PRODUCTS[12], // Contemporary Dashiki Shirt
  SAMPLE_PRODUCTS[15], // Bold African Print Kimono
  SAMPLE_PRODUCTS[16], // Traditional Kente Scarf
];

export const MOCK_STREAMS: Stream[] = [
  {
    id: 'stream-1',
    title: 'Ankara Fashion Show: New Spring Collection',
    description: 'Discover the latest Ankara designs perfect for spring celebrations and everyday elegance.',
    thumbnailImage: 'https://images.unsplash.com/photo-1594736797933-d0a9ba54d9f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0OTcxN3wwfDF8c2VhcmNofDEyfHxhZnJpY2FuJTIwZmFzaGlvbiUyMGRyZXNzfGVufDB8fHx8MTY5OTM2NTczOXww&ixlib=rb-4.1.0&q=80&w=600',
    isLive: true,
    viewerCount: 247,
    category: 'traditional-designs',
    startTime: new Date(Date.now() - 30 * 60 * 1000), // Started 30 minutes ago
    streamerName: 'Adaora Fashions',
    streamerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0OTcxN3wwfDF8c2VhcmNofDF8fGFmcmljYW4lMjB3b21hbiUyMHBvcnRyYWl0fGVufDB8fHx8MTY5OTM2NTczOXww&ixlib=rb-4.1.0&q=80&w=150',
    products: [STREAM_FEATURED_PRODUCTS[0], STREAM_FEATURED_PRODUCTS[2], STREAM_FEATURED_PRODUCTS[9]], // Ankara Maxi, Ensemble, Kente Midi
    tags: ['ankara', 'spring', 'new-collection', 'traditional'],
    featured: true
  },
  {
    id: 'stream-2',
    title: 'Kente Styling Masterclass',
    description: 'Learn how to style authentic Kente pieces for modern professional and casual looks.',
    thumbnailImage: 'https://images.unsplash.com/photo-1583391733981-3b783b5e1c7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0OTcxN3wwfDF8c2VhcmNofDZ8fGFmcmljYW4lMjBmYXNoaW9uJTIwdG9wfGVufDB8fHx8MTY5OTM2NTczOXww&ixlib=rb-4.1.0&q=80&w=600',
    isLive: true,
    viewerCount: 89,
    category: 'styling-tips',
    startTime: new Date(Date.now() - 15 * 60 * 1000), // Started 15 minutes ago
    streamerName: 'Kwame Style Guide',
    streamerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0OTcxN3wwfDF8c2VhcmNofDF8fGFmcmljYW4lMjBtYW4lMjBwb3J0cmFpdHxlbnwwfHx8fDE2OTkzNjU3Mzl8MA&ixlib=rb-4.1.0&q=80&w=150',
    products: [STREAM_FEATURED_PRODUCTS[1], STREAM_FEATURED_PRODUCTS[9], STREAM_FEATURED_PRODUCTS[11]], // Traditional Top, Kente Midi, Kente Scarf
    tags: ['kente', 'styling', 'professional', 'masterclass'],
    featured: false
  },
  {
    id: 'stream-3',
    title: 'Contemporary African Evening Wear',
    description: 'Elegant African-inspired evening wear perfect for special occasions and cultural celebrations.',
    thumbnailImage: 'https://images.unsplash.com/photo-1616847304977-1b5a34f21814?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0OTcxN3wwfDF8c2VhcmNofDR8fGFmcmljYW4lMjBldmVuaW5nJTIwZHJlc3N8ZW58MHx8fHwxNjk5MzY1NzM5fDA&ixlib=rb-4.1.0&q=80&w=600',
    isLive: false,
    viewerCount: 156,
    category: 'contemporary-african',
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // Starts in 2 hours
    streamerName: 'Amara Elegance',
    streamerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0OTcxN3wwfDF8c2VhcmNofDJ8fGFmcmljYW4lMjB3b21hbiUyMHBvcnRyYWl0fGVufDB8fHx8MTY5OTM2NTczOXww&ixlib=rb-4.1.0&q=80&w=150',
    products: [STREAM_FEATURED_PRODUCTS[0], STREAM_FEATURED_PRODUCTS[2], STREAM_FEATURED_PRODUCTS[10]], // Ankara Maxi, Ensemble, Wrap Blouse
    tags: ['evening-wear', 'elegant', 'contemporary', 'celebration'],
    featured: true
  },
  {
    id: 'stream-4',
    title: 'African Jewelry & Accessories Showcase',
    description: 'Discover authentic African jewelry and accessories that tell stories of heritage and craftsmanship.',
    thumbnailImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0OTcxN3wwfDF8c2VhcmNofDN8fGFmcmljYW4lMjBqZXdlbHJ5fGVufDB8fHx8MTY5OTM2NTczOXww&ixlib=rb-4.1.0&q=80&w=600',
    isLive: false,
    viewerCount: 78,
    category: 'designer-showcases',
    startTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // Starts in 4 hours
    streamerName: 'Heritage Crafts',
    streamerAvatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0OTcxN3wwfDF8c2VhcmNofDN8fGFmcmljYW4lMjB3b21hbiUyMHBvcnRyYWl0fGVufDB8fHx8MTY5OTM2NTczOXww&ixlib=rb-4.1.0&q=80&w=150',
    products: [STREAM_FEATURED_PRODUCTS[3], STREAM_FEATURED_PRODUCTS[4], STREAM_FEATURED_PRODUCTS[8]], // Jewelry Set, Headwrap, Earrings
    tags: ['jewelry', 'accessories', 'heritage', 'handcrafted'],
    featured: false
  },
  {
    id: 'stream-5',
    title: 'Cultural Fashion Week Highlights',
    description: 'Relive the best moments from African Cultural Fashion Week with exclusive designer interviews.',
    thumbnailImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0OTcxN3wwfDF8c2VhcmNofDV8fGZhc2hpb24lMjBzaG93fGVufDB8fHx8MTY5OTM2NTczOXww&ixlib=rb-4.1.0&q=80&w=600',
    isLive: false,
    viewerCount: 312,
    category: 'cultural-events',
    startTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // Starts in 6 hours
    streamerName: 'Fashion Week Live',
    streamerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0OTcxN3wwfDF8c2VhcmNofDR8fGFmcmljYW4lMjB3b21hbiUyMHBvcnRyYWl0fGVufDB8fHx8MTY5OTM2NTczOXww&ixlib=rb-4.1.0&q=80&w=150',
    products: [STREAM_FEATURED_PRODUCTS[6], STREAM_FEATURED_PRODUCTS[7], STREAM_FEATURED_PRODUCTS[10]], // Dashiki, Kimono, Wrap Blouse
    tags: ['fashion-week', 'cultural', 'designers', 'interviews'],
    featured: true
  },
  {
    id: 'stream-6',
    title: 'New Designer Spotlight: Zara Couture',
    description: 'Meet emerging designer Zara and explore her latest collection of modern African fusion wear.',
    thumbnailImage: 'https://images.unsplash.com/photo-1445205170230-053b83016050?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0OTcxN3wwfDF8c2VhcmNofDd8fGZhc2hpb24lMjBkZXNpZ25lcnxlbnwwfHx8fDE2OTkzNjU3Mzl8MA&ixlib=rb-4.1.0&q=80&w=600',
    isLive: false,
    viewerCount: 64,
    category: 'new-arrivals',
    startTime: new Date(Date.now() + 8 * 60 * 60 * 1000), // Starts in 8 hours
    streamerName: 'Zara Couture',
    streamerAvatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0OTcxN3wwfDF8c2VhcmNofDV8fGFmcmljYW4lMjB3b21hbiUyMHBvcnRyYWl0fGVufDB8fHx8MTY5OTM2NTczOXww&ixlib=rb-4.1.0&q=80&w=150',
    products: [STREAM_FEATURED_PRODUCTS[5], STREAM_FEATURED_PRODUCTS[8], STREAM_FEATURED_PRODUCTS[11]], // Tote Bag, Earrings, Kente Scarf
    tags: ['new-designer', 'modern', 'fusion', 'spotlight'],
    featured: false
  }
];

export const FEATURED_STREAMS = MOCK_STREAMS.filter(stream => stream.featured);
export const LIVE_STREAMS = MOCK_STREAMS.filter(stream => stream.isLive);
export const UPCOMING_STREAMS = MOCK_STREAMS.filter(stream => !stream.isLive && stream.startTime > new Date());

export const STREAM_QUALITY_OPTIONS = [
  { value: 'low', label: '480p', bandwidth: 'Low bandwidth' },
  { value: 'medium', label: '720p', bandwidth: 'Medium bandwidth' },
  { value: 'high', label: '1080p', bandwidth: 'High bandwidth' }
];