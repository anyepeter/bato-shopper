import { useState } from "react";
import { MapPin, Phone, Clock, Star, ArrowLeft, Navigation, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  sizes: string[];
  colors: string[];
  badge?: string;
  description?: string;
}

interface Store {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  distance: number;
  rating: number;
  hours: {
    weekday: string;
    weekend: string;
  };
  availability: {
    inStock: boolean;
    stockLevel: 'high' | 'medium' | 'low';
    availableSizes: string[];
    availableColors: string[];
  };
  features: string[];
}

interface StoreLocatorPageProps {
  product: Product | null;
  onNavigateBack: () => void;
}

export function StoreLocatorPage({ product, onNavigateBack }: StoreLocatorPageProps) {
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  // Mock store data with availability for the selected product
  const stores: Store[] = [
    {
      id: 1,
      name: "Modish Style Downtown",
      address: "123 Fashion Avenue",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      phone: "(555) 123-4567",
      distance: 2.3,
      rating: 4.8,
      hours: {
        weekday: "10:00 AM - 9:00 PM",
        weekend: "10:00 AM - 8:00 PM"
      },
      availability: {
        inStock: true,
        stockLevel: 'high',
        availableSizes: product?.sizes || ['S', 'M', 'L', 'XL'],
        availableColors: product?.colors || ['Multi', 'Blue', 'Green']
      },
      features: ['Personal Styling', 'Alterations', 'VIP Lounge', 'Online Pickup']
    },
    {
      id: 2,
      name: "Modish Style Mall Plaza",
      address: "456 Shopping Center Blvd",
      city: "New York",
      state: "NY", 
      zipCode: "10002",
      phone: "(555) 234-5678",
      distance: 4.1,
      rating: 4.6,
      hours: {
        weekday: "10:00 AM - 9:00 PM",
        weekend: "10:00 AM - 8:00 PM"
      },
      availability: {
        inStock: true,
        stockLevel: 'medium',
        availableSizes: product?.sizes?.slice(0, 3) || ['S', 'M', 'L'],
        availableColors: product?.colors?.slice(0, 2) || ['Multi', 'Blue']
      },
      features: ['Personal Styling', 'Gift Wrapping', 'Online Pickup']
    },
    {
      id: 3,
      name: "Modish Style Fashion District",
      address: "789 Designer Row",
      city: "New York",
      state: "NY",
      zipCode: "10003",
      phone: "(555) 345-6789",
      distance: 6.8,
      rating: 4.9,
      hours: {
        weekday: "9:00 AM - 10:00 PM",
        weekend: "10:00 AM - 9:00 PM"
      },
      availability: {
        inStock: true,
        stockLevel: 'low',
        availableSizes: product?.sizes?.slice(0, 2) || ['S', 'M'],
        availableColors: product?.colors?.slice(0, 1) || ['Multi']
      },
      features: ['Personal Styling', 'Alterations', 'VIP Lounge', 'Private Appointments', 'Online Pickup']
    },
    {
      id: 4,
      name: "Modish Style Brooklyn Heights",
      address: "321 Trendy Street",
      city: "Brooklyn",
      state: "NY",
      zipCode: "11201",
      phone: "(555) 456-7890",
      distance: 8.2,
      rating: 4.7,
      hours: {
        weekday: "10:00 AM - 8:00 PM",
        weekend: "10:00 AM - 7:00 PM"
      },
      availability: {
        inStock: false,
        stockLevel: 'low',
        availableSizes: [],
        availableColors: []
      },
      features: ['Personal Styling', 'Gift Wrapping']
    }
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-3 w-3 fill-yellow-400/50 text-yellow-400" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-3 w-3 text-gray-300" />);
    }

    return stars;
  };

  const getStockLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStockLevelText = (level: string) => {
    switch (level) {
      case 'high': return 'In Stock';
      case 'medium': return 'Limited Stock';
      case 'low': return 'Low Stock';
      default: return 'Out of Stock';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div 
        className="px-4 sm:px-6 lg:px-8 py-6"
        style={{ 
          background: 'var(--blue-gradient)',
          color: 'var(--pure-white)'
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onNavigateBack}
              className="text-white hover:bg-white/10 p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 
              className="text-2xl font-bold font-heading"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Find in Store
            </h1>
          </div>
          
          {product && (
            <div className="flex items-center gap-4 bg-white/10 rounded-lg p-4">
              <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 
                  className="font-semibold text-lg font-heading"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {product.name}
                </h2>
                <p 
                  className="text-white/80 font-body"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  ${product.price.toFixed(2)} • {product.category}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Enter your city, state, or ZIP code"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button 
              className="btn-moema-primary btn-moema-sm"
              style={{ 
                borderRadius: 'var(--radius-sm)',
                height: '40px',
                padding: '0 24px'
              }}
            >
              <Navigation className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Store List */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 
                className="text-xl font-bold mb-2 font-heading"
                style={{ 
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--primary-blue)'
                }}
              >
                Nearby Stores ({stores.length})
              </h2>
              <p 
                className="text-gray-600 font-body"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Showing availability for "{product?.name || 'selected item'}"
              </p>
            </div>

            <div className="space-y-4">
              {stores.map((store) => (
                <div
                  key={store.id}
                  className={`bg-white rounded-lg shadow-sm border-2 p-6 cursor-pointer transition-all duration-200 ${
                    selectedStore?.id === store.id 
                      ? 'border-orange-500 shadow-md' 
                      : 'border-gray-200 hover:border-orange-300 hover:shadow-md'
                  }`}
                  onClick={() => setSelectedStore(store)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 
                        className="text-lg font-semibold mb-1 font-heading"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {store.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          {renderStars(store.rating)}
                        </div>
                        <span 
                          className="text-sm text-gray-600 font-body"
                          style={{ fontFamily: 'var(--font-body)' }}
                        >
                          {store.rating} • {store.distance} miles away
                        </span>
                      </div>
                      <div 
                        className="flex items-center gap-2 text-gray-600 mb-2 font-body"
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        <MapPin className="h-4 w-4" />
                        <span>
                          {store.address}, {store.city}, {store.state} {store.zipCode}
                        </span>
                      </div>
                    </div>
                    
                    <Badge 
                      className={`${
                        store.availability.inStock 
                          ? getStockLevelColor(store.availability.stockLevel)
                          : 'bg-gray-500'
                      } text-white`}
                    >
                      {store.availability.inStock 
                        ? getStockLevelText(store.availability.stockLevel)
                        : 'Out of Stock'
                      }
                    </Badge>
                  </div>

                  {store.availability.inStock && (
                    <div className="mb-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 
                            className="text-sm font-medium text-gray-700 mb-2 font-heading"
                            style={{ fontFamily: 'var(--font-heading)' }}
                          >
                            Available Sizes:
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {store.availability.availableSizes.map((size) => (
                              <span 
                                key={size}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-body"
                                style={{ fontFamily: 'var(--font-body)' }}
                              >
                                {size}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 
                            className="text-sm font-medium text-gray-700 mb-2 font-heading"
                            style={{ fontFamily: 'var(--font-heading)' }}
                          >
                            Available Colors:
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {store.availability.availableColors.map((color) => (
                              <span 
                                key={color}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-body"
                                style={{ fontFamily: 'var(--font-body)' }}
                              >
                                {color}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    {store.features.map((feature) => (
                      <span 
                        key={feature}
                        className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded font-body"
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div 
                      className="flex items-center gap-4 text-sm text-gray-600 font-body"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        <span>{store.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Open until 9:00 PM</span>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-orange-600 border-orange-300 hover:bg-orange-50"
                    >
                      Get Directions
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Store Details Sidebar */}
          <div className="lg:col-span-1">
            {selectedStore ? (
              <div 
                className="bg-white rounded-lg shadow-sm p-6 sticky top-4"
                style={{ borderRadius: 'var(--radius-lg)' }}
              >
                <h3 
                  className="text-lg font-bold mb-4 font-heading"
                  style={{ 
                    fontFamily: 'var(--font-heading)',
                    color: 'var(--primary-blue)'
                  }}
                >
                  {selectedStore.name}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 
                      className="font-medium text-gray-700 mb-2 font-heading"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      Address
                    </h4>
                    <p 
                      className="text-gray-600 font-body"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {selectedStore.address}<br />
                      {selectedStore.city}, {selectedStore.state} {selectedStore.zipCode}
                    </p>
                  </div>
                  
                  <div>
                    <h4 
                      className="font-medium text-gray-700 mb-2 font-heading"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      Hours
                    </h4>
                    <p 
                      className="text-gray-600 font-body"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      <strong>Mon-Fri:</strong> {selectedStore.hours.weekday}<br />
                      <strong>Sat-Sun:</strong> {selectedStore.hours.weekend}
                    </p>
                  </div>
                  
                  <div>
                    <h4 
                      className="font-medium text-gray-700 mb-2 font-heading"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      Contact
                    </h4>
                    <p 
                      className="text-gray-600 font-body"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {selectedStore.phone}
                    </p>
                  </div>

                  <div className="space-y-2 pt-4">
                    <Button 
                      className="btn-moema-gradient-orange w-full"
                      style={{ 
                        borderRadius: 'var(--radius-sm)',
                        height: '44px'
                      }}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Store
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-orange-300 text-orange-600 hover:bg-orange-50"
                      style={{ height: '44px' }}
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Get Directions
                    </Button>
                    {selectedStore.availability.inStock && (
                      <Button 
                        variant="outline" 
                        className="w-full border-green-300 text-green-600 hover:bg-green-50"
                        style={{ height: '44px' }}
                      >
                        Reserve for Pickup
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div 
                className="bg-gray-100 rounded-lg p-8 text-center sticky top-4"
                style={{ borderRadius: 'var(--radius-lg)' }}
              >
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p 
                  className="text-gray-600 font-body"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Select a store from the list to view detailed information and contact details.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}