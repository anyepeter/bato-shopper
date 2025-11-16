// African Logistics Partners - Local Transportation Companies and Global Carriers
export interface LogisticsCompany {
  id: string;
  name: string;
  type: 'local_transport' | 'bus_agency' | 'courier_service' | 'international' | 'express';
  country: string;
  region?: string;
  logo?: string;
  description: string;
  services: LogisticsService[];
  coverage: string[];
  specialties: string[];
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
    address: string;
  };
  rating: number;
  isActive: boolean;
  verificationStatus: 'verified' | 'pending' | 'basic';
  operatingHours: string;
  languages: string[];
}

export interface LogisticsService {
  id: string;
  name: string;
  description: string;
  deliveryTime: string;
  basePrice: number;
  currency: 'XAF' | 'USD' | 'NGN' | 'GHS' | 'KES' | 'ZAR';
  maxWeight: number; // kg
  maxDimensions: {
    length: number;
    width: number;
    height: number;
  };
  features: string[];
  restrictions?: string[];
  trackingAvailable: boolean;
  insuranceIncluded: boolean;
  signatureRequired: boolean;
}

// Cameroon Logistics Companies
export const cameroonLogistics: LogisticsCompany[] = [
  {
    id: 'cam-united-express',
    name: 'United Express Voyages',
    type: 'bus_agency',
    country: 'Cameroon',
    region: 'Centre, Littoral, West',
    description: 'Leading passenger and cargo transport company connecting major Cameroonian cities',
    services: [
      {
        id: 'united-standard',
        name: 'Standard Cargo',
        description: 'Reliable inter-city cargo transport',
        deliveryTime: '2-3 business days',
        basePrice: 2500,
        currency: 'XAF',
        maxWeight: 50,
        maxDimensions: { length: 100, width: 80, height: 60 },
        features: ['Door-to-terminal pickup', 'SMS tracking', 'Package protection'],
        trackingAvailable: true,
        insuranceIncluded: false,
        signatureRequired: true
      },
      {
        id: 'united-express',
        name: 'Express Cargo',
        description: 'Fast inter-city delivery service',
        deliveryTime: '1-2 business days',
        basePrice: 4000,
        currency: 'XAF',
        maxWeight: 30,
        maxDimensions: { length: 80, width: 60, height: 40 },
        features: ['Priority handling', 'Real-time tracking', 'Insurance included'],
        trackingAvailable: true,
        insuranceIncluded: true,
        signatureRequired: true
      }
    ],
    coverage: ['Yaoundé', 'Douala', 'Bafoussam', 'Bamenda', 'Ngaoundéré'],
    specialties: ['Fashion items', 'Electronics', 'Documents'],
    contactInfo: {
      phone: '+237 6XX XX XX XX',
      email: 'cargo@unitedexpress.cm',
      website: 'www.unitedexpress.cm',
      address: 'Carrefour Elig-Edzoa, Yaoundé'
    },
    rating: 4.2,
    isActive: true,
    verificationStatus: 'verified',
    operatingHours: '6:00 AM - 8:00 PM',
    languages: ['French', 'English']
  },
  {
    id: 'cam-touristique-express',
    name: 'Touristique Express',
    type: 'bus_agency',
    country: 'Cameroon',
    region: 'Littoral, Centre, West, Northwest',
    description: 'Premium transport service with reliable cargo delivery network',
    services: [
      {
        id: 'touristique-comfort',
        name: 'Comfort Cargo',
        description: 'Premium cargo service with extra care',
        deliveryTime: '1-2 business days',
        basePrice: 3500,
        currency: 'XAF',
        maxWeight: 40,
        maxDimensions: { length: 90, width: 70, height: 50 },
        features: ['Climate-controlled', 'Fragile handling', 'Photo updates'],
        trackingAvailable: true,
        insuranceIncluded: true,
        signatureRequired: true
      }
    ],
    coverage: ['Douala', 'Yaoundé', 'Bafoussam', 'Bamenda', 'Limbe'],
    specialties: ['Delicate fashion', 'Artwork', 'Premium goods'],
    contactInfo: {
      phone: '+237 6XX XX XX XX',
      email: 'logistics@touristiqueexpress.cm',
      address: 'Rond-point Deido, Douala'
    },
    rating: 4.5,
    isActive: true,
    verificationStatus: 'verified',
    operatingHours: '5:30 AM - 9:00 PM',
    languages: ['French', 'English']
  },
  {
    id: 'cam-garanti-express',
    name: 'Garanti Express',
    type: 'bus_agency',
    country: 'Cameroon',
    region: 'National coverage',
    description: 'Nationwide transport agency with comprehensive cargo services',
    services: [
      {
        id: 'garanti-economy',
        name: 'Economy Delivery',
        description: 'Affordable nationwide delivery',
        deliveryTime: '3-5 business days',
        basePrice: 2000,
        currency: 'XAF',
        maxWeight: 60,
        maxDimensions: { length: 120, width: 90, height: 70 },
        features: ['Nationwide coverage', 'Terminal pickup', 'Basic tracking'],
        trackingAvailable: true,
        insuranceIncluded: false,
        signatureRequired: false
      },
      {
        id: 'garanti-premium',
        name: 'Premium Service',
        description: 'Fast and secure delivery service',
        deliveryTime: '1-2 business days',
        basePrice: 5000,
        currency: 'XAF',
        maxWeight: 35,
        maxDimensions: { length: 85, width: 65, height: 45 },
        features: ['Door-to-door', 'Priority handling', 'Full insurance', 'WhatsApp updates'],
        trackingAvailable: true,
        insuranceIncluded: true,
        signatureRequired: true
      }
    ],
    coverage: ['All regions of Cameroon'],
    specialties: ['Fashion', 'Electronics', 'Books', 'Handicrafts'],
    contactInfo: {
      phone: '+237 6XX XX XX XX',
      email: 'service@garantiexpress.cm',
      address: 'Marché Central, Yaoundé'
    },
    rating: 4.0,
    isActive: true,
    verificationStatus: 'verified',
    operatingHours: '24/7',
    languages: ['French', 'English', 'Local languages']
  }
];

// Nigeria Logistics Companies
export const nigeriaLogistics: LogisticsCompany[] = [
  {
    id: 'ng-abc-transport',
    name: 'ABC Transport',
    type: 'bus_agency',
    country: 'Nigeria',
    region: 'National',
    description: 'Leading Nigerian transport company with extensive cargo network',
    services: [
      {
        id: 'abc-standard',
        name: 'Standard Cargo',
        description: 'Reliable inter-state cargo service',
        deliveryTime: '2-4 business days',
        basePrice: 1500,
        currency: 'NGN',
        maxWeight: 50,
        maxDimensions: { length: 100, width: 80, height: 60 },
        features: ['Inter-state delivery', 'SMS notifications', 'Terminal pickup'],
        trackingAvailable: true,
        insuranceIncluded: false,
        signatureRequired: true
      }
    ],
    coverage: ['Lagos', 'Abuja', 'Kano', 'Port Harcourt', 'Ibadan', 'Benin City'],
    specialties: ['Fashion', 'Food items', 'Electronics'],
    contactInfo: {
      phone: '+234 800 ABC TRANSPORT',
      email: 'cargo@abctransport.ng',
      website: 'www.abctransport.ng',
      address: 'Jibowu Terminal, Lagos'
    },
    rating: 4.1,
    isActive: true,
    verificationStatus: 'verified',
    operatingHours: '5:00 AM - 10:00 PM',
    languages: ['English', 'Yoruba', 'Igbo', 'Hausa']
  },
  {
    id: 'ng-god-is-good',
    name: 'God is Good Motors',
    type: 'bus_agency',
    country: 'Nigeria',
    region: 'Southeast, South-South',
    description: 'Premium transport service with reliable cargo delivery',
    services: [
      {
        id: 'gig-express',
        name: 'GIG Express',
        description: 'Fast and secure cargo delivery',
        deliveryTime: '1-3 business days',
        basePrice: 2000,
        currency: 'NGN',
        maxWeight: 40,
        maxDimensions: { length: 90, width: 70, height: 50 },
        features: ['Air-conditioned storage', 'Photo confirmation', 'Insurance coverage'],
        trackingAvailable: true,
        insuranceIncluded: true,
        signatureRequired: true
      }
    ],
    coverage: ['Lagos', 'Enugu', 'Onitsha', 'Aba', 'Port Harcourt', 'Calabar'],
    specialties: ['Fashion', 'Artwork', 'Fragile items'],
    contactInfo: {
      phone: '+234 700 CALL GIG',
      email: 'logistics@gigm.com',
      website: 'www.gigm.com',
      address: 'GIG Park, Enugu'
    },
    rating: 4.3,
    isActive: true,
    verificationStatus: 'verified',
    operatingHours: '6:00 AM - 9:00 PM',
    languages: ['English', 'Igbo']
  }
];

// Ghana Logistics Companies
export const ghanaLogistics: LogisticsCompany[] = [
  {
    id: 'gh-metro-mass',
    name: 'Metro Mass Transit',
    type: 'bus_agency',
    country: 'Ghana',
    region: 'National',
    description: 'National bus service with comprehensive cargo delivery network',
    services: [
      {
        id: 'metro-cargo',
        name: 'Metro Cargo',
        description: 'Nationwide cargo delivery service',
        deliveryTime: '2-4 business days',
        basePrice: 15,
        currency: 'GHS',
        maxWeight: 45,
        maxDimensions: { length: 95, width: 75, height: 55 },
        features: ['Nationwide coverage', 'Affordable rates', 'Terminal collection'],
        trackingAvailable: true,
        insuranceIncluded: false,
        signatureRequired: true
      }
    ],
    coverage: ['Accra', 'Kumasi', 'Tamale', 'Cape Coast', 'Takoradi', 'Ho'],
    specialties: ['Textiles', 'Agricultural products', 'Handicrafts'],
    contactInfo: {
      phone: '+233 30 XXX XXXX',
      email: 'cargo@metromass.gov.gh',
      address: 'Metro Mass Terminal, Accra'
    },
    rating: 3.8,
    isActive: true,
    verificationStatus: 'basic',
    operatingHours: '5:00 AM - 8:00 PM',
    languages: ['English', 'Twi', 'Ga']
  }
];

// International Logistics Companies
export const internationalLogistics: LogisticsCompany[] = [
  {
    id: 'dhl-africa',
    name: 'DHL Express Africa',
    type: 'international',
    country: 'Global',
    region: 'Africa',
    description: 'International express delivery and logistics services across Africa',
    services: [
      {
        id: 'dhl-worldwide',
        name: 'DHL Worldwide Express',
        description: 'International express delivery',
        deliveryTime: '1-3 business days',
        basePrice: 25,
        currency: 'USD',
        maxWeight: 70,
        maxDimensions: { length: 120, width: 80, height: 80 },
        features: ['International delivery', 'Full tracking', 'Insurance included', 'Customs handling'],
        trackingAvailable: true,
        insuranceIncluded: true,
        signatureRequired: true
      }
    ],
    coverage: ['Worldwide'],
    specialties: ['International fashion', 'Documents', 'High-value items'],
    contactInfo: {
      phone: '+237 XX XX XX XX',
      email: 'customerservice@dhl.com',
      website: 'www.dhl.com',
      address: 'Multiple locations across Africa'
    },
    rating: 4.6,
    isActive: true,
    verificationStatus: 'verified',
    operatingHours: '8:00 AM - 6:00 PM',
    languages: ['English', 'French', 'Arabic']
  },
  {
    id: 'fedex-africa',
    name: 'FedEx Africa',
    type: 'international',
    country: 'Global',
    region: 'Africa',
    description: 'Global express transportation and logistics services',
    services: [
      {
        id: 'fedex-international',
        name: 'FedEx International Priority',
        description: 'Fast international delivery',
        deliveryTime: '1-3 business days',
        basePrice: 30,
        currency: 'USD',
        maxWeight: 68,
        maxDimensions: { length: 119, width: 79, height: 79 },
        features: ['Priority handling', 'Real-time tracking', 'Money-back guarantee'],
        trackingAvailable: true,
        insuranceIncluded: true,
        signatureRequired: true
      }
    ],
    coverage: ['Worldwide'],
    specialties: ['Time-sensitive deliveries', 'Fashion', 'Electronics'],
    contactInfo: {
      phone: '+237 XX XX XX XX',
      email: 'customercare@fedex.com',
      website: 'www.fedex.com',
      address: 'Select African cities'
    },
    rating: 4.5,
    isActive: true,
    verificationStatus: 'verified',
    operatingHours: '8:00 AM - 6:00 PM',
    languages: ['English', 'French']
  }
];

// Combined logistics partners
export const allLogisticsCompanies: LogisticsCompany[] = [
  ...cameroonLogistics,
  ...nigeriaLogistics,
  ...ghanaLogistics,
  ...internationalLogistics
];

// Helper function to get logistics companies by country
export const getLogisticsByCountry = (country: string): LogisticsCompany[] => {
  return allLogisticsCompanies.filter(company => 
    company.country === country || company.country === 'Global'
  );
};

// Helper function to get services by logistics company
export const getServicesByCompany = (companyId: string): LogisticsService[] => {
  const company = allLogisticsCompanies.find(c => c.id === companyId);
  return company?.services || [];
};

// Helper function to calculate shipping cost based on weight and distance
export const calculateShippingCost = (
  serviceId: string, 
  weight: number, 
  distance: number = 100
): number => {
  const service = allLogisticsCompanies
    .flatMap(company => company.services)
    .find(s => s.id === serviceId);
  
  if (!service) return 0;
  
  let cost = service.basePrice;
  
  // Weight-based pricing (above 5kg)
  if (weight > 5) {
    cost += (weight - 5) * (service.basePrice * 0.1);
  }
  
  // Distance-based pricing (above 50km)
  if (distance > 50) {
    cost += (distance - 50) * 0.01 * service.basePrice;
  }
  
  return Math.round(cost * 100) / 100;
};

// Default shipping methods for quick setup
export const defaultShippingMethods = [
  {
    id: 'local-standard',
    name: 'Local Standard Delivery',
    time: '2-3 business days',
    price: 5.99,
    description: 'Reliable local delivery service'
  },
  {
    id: 'local-express',
    name: 'Local Express',
    time: '1-2 business days', 
    price: 12.99,
    description: 'Fast local delivery'
  },
  {
    id: 'international',
    name: 'International Shipping',
    time: '5-10 business days',
    price: 25.99,
    description: 'Global delivery service'
  }
];

export default allLogisticsCompanies;