import { useState, useCallback, useEffect } from 'react';

interface InternationalizationState {
  currentLocale: string;
  supportedLocales: Locale[];
  currencies: Currency[];
  currentCurrency: string;
  exchangeRates: ExchangeRates;
  translations: Record<string, Record<string, string>>;
  regionalSettings: RegionalSettings;
  complianceData: ComplianceData;
  isLoading: boolean;
  error: string | null;
}

interface Locale {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  direction: 'ltr' | 'rtl';
  dateFormat: string;
  timeFormat: string;
  numberFormat: {
    decimal: string;
    thousands: string;
    currency: {
      symbol: string;
      position: 'before' | 'after';
    };
  };
  isActive: boolean;
  completion: number; // Translation completion percentage
}

interface Currency {
  code: string;
  name: string;
  symbol: string;
  decimals: number;
  isActive: boolean;
  isCrypto: boolean;
  supportedCountries: string[];
  minimumAmount: number;
  maximumAmount: number;
}

interface ExchangeRates {
  baseCurrency: string;
  lastUpdated: Date;
  rates: Record<string, number>;
  provider: string;
}

interface RegionalSettings {
  [countryCode: string]: {
    countryName: string;
    locale: string;
    currency: string;
    timezone: string;
    taxRate: number;
    shippingZone: string;
    paymentMethods: string[];
    regulations: RegionalRegulation[];
    businessHours: BusinessHours;
    holidays: Holiday[];
  };
}

interface RegionalRegulation {
  type: 'tax' | 'shipping' | 'data_privacy' | 'consumer_protection' | 'import_duty';
  title: string;
  description: string;
  complianceRequired: boolean;
  documentation: string[];
}

interface BusinessHours {
  timezone: string;
  workingDays: string[];
  hours: { start: string; end: string };
  supportLanguages: string[];
}

interface Holiday {
  date: string;
  name: string;
  type: 'national' | 'religious' | 'cultural';
  affectsShipping: boolean;
  affectsSupport: boolean;
}

interface ComplianceData {
  gdprCompliance: GDPRCompliance;
  taxCompliance: TaxCompliance;
  shippingCompliance: ShippingCompliance;
  dataLocalization: DataLocalization;
}

interface GDPRCompliance {
  isEnabled: boolean;
  consentTracking: boolean;
  dataRetentionPeriod: number;
  rightToBeForgotten: boolean;
  dataPortability: boolean;
  cookieBanner: boolean;
  privacyPolicyUpdated: Date;
}

interface TaxCompliance {
  vatRegistrations: VATRegistration[];
  automaticTaxCalculation: boolean;
  taxReporting: boolean;
  digitalServicesTax: boolean;
  customsDutyCalculation: boolean;
}

interface VATRegistration {
  country: string;
  vatNumber: string;
  registrationDate: Date;
  isActive: boolean;
  threshold: number;
}

interface ShippingCompliance {
  restrictedCountries: string[];
  prohibitedItems: string[];
  customsDocumentation: boolean;
  commercialInvoiceGeneration: boolean;
  harmonizedCodes: Record<string, string>;
}

interface DataLocalization {
  requiresLocalStorage: string[];
  dataResidencyCompliance: boolean;
  crossBorderDataTransfer: boolean;
  encryptionRequired: boolean;
  auditLogging: boolean;
}

const initialState: InternationalizationState = {
  currentLocale: 'en',
  supportedLocales: [],
  currencies: [],
  currentCurrency: 'USD',
  exchangeRates: {
    baseCurrency: 'USD',
    lastUpdated: new Date(),
    rates: {},
    provider: 'ExchangeRate-API',
  },
  translations: {},
  regionalSettings: {},
  complianceData: {
    gdprCompliance: {
      isEnabled: true,
      consentTracking: true,
      dataRetentionPeriod: 365,
      rightToBeForgotten: true,
      dataPortability: true,
      cookieBanner: true,
      privacyPolicyUpdated: new Date(),
    },
    taxCompliance: {
      vatRegistrations: [],
      automaticTaxCalculation: true,
      taxReporting: true,
      digitalServicesTax: true,
      customsDutyCalculation: true,
    },
    shippingCompliance: {
      restrictedCountries: [],
      prohibitedItems: [],
      customsDocumentation: true,
      commercialInvoiceGeneration: true,
      harmonizedCodes: {},
    },
    dataLocalization: {
      requiresLocalStorage: [],
      dataResidencyCompliance: true,
      crossBorderDataTransfer: true,
      encryptionRequired: true,
      auditLogging: true,
    },
  },
  isLoading: false,
  error: null,
};

export function useInternationalization() {
  const [state, setState] = useState<InternationalizationState>(initialState);

  // 🌍 LOCALE MANAGEMENT
  const changeLocale = useCallback(async (localeCode: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Check if locale is supported
      const locale = state.supportedLocales.find(l => l.code === localeCode);
      if (!locale) {
        throw new Error(`Locale ${localeCode} is not supported`);
      }

      // Load translations if not already loaded
      if (!state.translations[localeCode]) {
        const translations = await loadTranslations(localeCode);
        setState(prev => ({
          ...prev,
          translations: {
            ...prev.translations,
            [localeCode]: translations,
          },
        }));
      }

      // Update current locale
      setState(prev => ({
        ...prev,
        currentLocale: localeCode,
        isLoading: false,
      }));

      // Save to localStorage
      localStorage.setItem('bato-locale', localeCode);

      // Update document language and direction
      document.documentElement.lang = localeCode;
      document.documentElement.dir = locale.direction;

      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to change locale',
        isLoading: false,
      }));
      throw error;
    }
  }, [state.supportedLocales, state.translations]);

  // 💱 CURRENCY MANAGEMENT
  const changeCurrency = useCallback(async (currencyCode: string) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      // Check if currency is supported
      const currency = state.currencies.find(c => c.code === currencyCode);
      if (!currency) {
        throw new Error(`Currency ${currencyCode} is not supported`);
      }

      // Update exchange rates if needed
      const ratesNeedUpdate = shouldUpdateExchangeRates(state.exchangeRates);
      if (ratesNeedUpdate) {
        await updateExchangeRates();
      }

      setState(prev => ({
        ...prev,
        currentCurrency: currencyCode,
        isLoading: false,
      }));

      // Save to localStorage
      localStorage.setItem('bato-currency', currencyCode);

      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to change currency',
        isLoading: false,
      }));
      throw error;
    }
  }, [state.currencies, state.exchangeRates]);

  // 🔄 EXCHANGE RATE MANAGEMENT
  const updateExchangeRates = useCallback(async () => {
    try {
      const rates = await fetchExchangeRates(state.exchangeRates.baseCurrency);
      
      setState(prev => ({
        ...prev,
        exchangeRates: {
          ...prev.exchangeRates,
          rates: rates.rates,
          lastUpdated: new Date(),
        },
      }));

      return rates;
    } catch (error) {
      console.error('Failed to update exchange rates:', error);
      throw error;
    }
  }, [state.exchangeRates.baseCurrency]);

  // 💰 PRICE CONVERSION
  const convertPrice = useCallback((
    amount: number,
    fromCurrency: string = 'USD',
    toCurrency: string = state.currentCurrency
  ) => {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    const { rates } = state.exchangeRates;
    
    // Convert to base currency first, then to target currency
    let convertedAmount = amount;
    
    if (fromCurrency !== state.exchangeRates.baseCurrency) {
      convertedAmount = amount / (rates[fromCurrency] || 1);
    }
    
    if (toCurrency !== state.exchangeRates.baseCurrency) {
      convertedAmount = convertedAmount * (rates[toCurrency] || 1);
    }

    return Math.round(convertedAmount * 100) / 100;
  }, [state.exchangeRates, state.currentCurrency]);

  // 📝 TRANSLATION SYSTEM
  const translate = useCallback((
    key: string,
    params?: Record<string, string | number>,
    locale: string = state.currentLocale
  ) => {
    const translations = state.translations[locale] || state.translations['en'] || {};
    let translation = translations[key] || key;

    // Parameter substitution
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        const placeholder = `{{${paramKey}}}`;
        translation = translation.replace(new RegExp(placeholder, 'g'), String(value));
      });
    }

    return translation;
  }, [state.translations, state.currentLocale]);

  // 🏪 REGIONAL SETTINGS
  const getRegionalSettings = useCallback((countryCode: string) => {
    return state.regionalSettings[countryCode] || state.regionalSettings['US'];
  }, [state.regionalSettings]);

  // 📊 TAX CALCULATION
  const calculateTax = useCallback((
    amount: number,
    countryCode: string,
    productCategory: string = 'general'
  ) => {
    const regionalSettings = getRegionalSettings(countryCode);
    const taxRate = regionalSettings.taxRate || 0;
    
    // Apply category-specific tax rules
    const categoryTaxRates = {
      'clothing': taxRate,
      'accessories': taxRate,
      'digital': taxRate * 1.2, // Digital services tax
      'luxury': taxRate * 1.5, // Luxury tax
    };

    const applicableTaxRate = categoryTaxRates[productCategory] || taxRate;
    const taxAmount = amount * applicableTaxRate;

    return {
      taxRate: applicableTaxRate,
      taxAmount: Math.round(taxAmount * 100) / 100,
      totalAmount: Math.round((amount + taxAmount) * 100) / 100,
    };
  }, [getRegionalSettings]);

  // 🚚 SHIPPING CALCULATION
  const calculateShipping = useCallback((
    weight: number,
    dimensions: { length: number; width: number; height: number },
    fromCountry: string,
    toCountry: string,
    serviceLevel: 'standard' | 'express' | 'overnight' = 'standard'
  ) => {
    // Base shipping calculation
    const baseRates = {
      standard: 5.00,
      express: 15.00,
      overnight: 35.00,
    };

    const baseRate = baseRates[serviceLevel];
    const weightMultiplier = Math.max(1, Math.ceil(weight));
    const dimensionalWeight = (dimensions.length * dimensions.width * dimensions.height) / 5000;
    const billableWeight = Math.max(weight, dimensionalWeight);

    // International shipping adjustments
    const isInternational = fromCountry !== toCountry;
    const internationalMultiplier = isInternational ? 2.5 : 1;

    // Zone-based pricing
    const shippingZones = {
      'domestic': 1,
      'international-tier1': 2,
      'international-tier2': 3,
      'international-tier3': 4,
    };

    const zone = isInternational ? 'international-tier1' : 'domestic';
    const zoneMultiplier = shippingZones[zone];

    const shippingCost = baseRate * weightMultiplier * internationalMultiplier * zoneMultiplier;
    
    // Estimate delivery time
    const deliveryTimes = {
      standard: isInternational ? '7-14 days' : '3-5 days',
      express: isInternational ? '3-7 days' : '1-3 days',
      overnight: isInternational ? '1-3 days' : 'Next day',
    };

    return {
      cost: Math.round(shippingCost * 100) / 100,
      estimatedDelivery: deliveryTimes[serviceLevel],
      isInternational,
      trackingIncluded: serviceLevel !== 'standard',
      insuranceIncluded: serviceLevel === 'overnight',
    };
  }, []);

  // 📋 COMPLIANCE CHECKING
  const checkCompliance = useCallback((countryCode: string, operation: 'sale' | 'shipping' | 'data_collection') => {
    const regionalSettings = getRegionalSettings(countryCode);
    const regulations = regionalSettings.regulations || [];

    const relevantRegulations = regulations.filter(reg => {
      switch (operation) {
        case 'sale':
          return ['tax', 'consumer_protection'].includes(reg.type);
        case 'shipping':
          return ['shipping', 'import_duty'].includes(reg.type);
        case 'data_collection':
          return ['data_privacy'].includes(reg.type);
        default:
          return true;
      }
    });

    const complianceIssues = relevantRegulations.filter(reg => reg.complianceRequired);
    
    return {
      isCompliant: complianceIssues.length === 0,
      issues: complianceIssues,
      recommendations: generateComplianceRecommendations(complianceIssues),
    };
  }, [getRegionalSettings]);

  // 📄 DOCUMENT GENERATION
  const generateInternationalDocuments = useCallback(async (
    orderId: string,
    items: any[],
    shippingAddress: any,
    value: number
  ) => {
    try {
      const documents = [];

      // Commercial Invoice
      const commercialInvoice = await generateCommercialInvoice({
        orderId,
        items,
        shippingAddress,
        value,
        currency: state.currentCurrency,
      });
      documents.push(commercialInvoice);

      // Customs Declaration
      if (shippingAddress.country !== 'US') {
        const customsDeclaration = await generateCustomsDeclaration({
          orderId,
          items,
          shippingAddress,
          value,
        });
        documents.push(customsDeclaration);
      }

      // Certificate of Origin (if required)
      if (value > 1000) {
        const certificateOfOrigin = await generateCertificateOfOrigin({
          orderId,
          items,
          originCountry: 'US',
        });
        documents.push(certificateOfOrigin);
      }

      return documents;
    } catch (error) {
      console.error('Failed to generate international documents:', error);
      throw error;
    }
  }, [state.currentCurrency]);

  // 🔍 MARKET ANALYSIS
  const getMarketAnalysis = useCallback((countryCode: string) => {
    // Simulate market data analysis
    const marketData = {
      marketSize: Math.floor(Math.random() * 1000000) + 100000,
      competition: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      growthRate: Math.floor(Math.random() * 20) + 5,
      averageOrderValue: Math.floor(Math.random() * 100) + 50,
      seasonalTrends: generateSeasonalTrends(),
      popularCategories: ['dresses', 'tops', 'accessories'],
      paymentPreferences: getPaymentPreferences(countryCode),
      shippingPreferences: getShippingPreferences(countryCode),
      culturalConsiderations: getCulturalConsiderations(countryCode),
    };

    return marketData;
  }, []);

  // Initialize internationalization
  useEffect(() => {
    const initializeInternationalization = async () => {
      setState(prev => ({ ...prev, isLoading: true }));

      try {
        // Load supported locales
        const supportedLocales = generateSupportedLocales();
        
        // Load supported currencies
        const currencies = generateSupportedCurrencies();
        
        // Load regional settings
        const regionalSettings = generateRegionalSettings();
        
        // Load base translations
        const baseTranslations = await loadTranslations('en');
        
        // Get initial exchange rates
        const exchangeRates = await fetchExchangeRates('USD');

        // Get saved preferences
        const savedLocale = localStorage.getItem('bato-locale') || detectUserLocale();
        const savedCurrency = localStorage.getItem('bato-currency') || detectUserCurrency();

        setState(prev => ({
          ...prev,
          supportedLocales,
          currencies,
          regionalSettings,
          currentLocale: savedLocale,
          currentCurrency: savedCurrency,
          translations: { en: baseTranslations },
          exchangeRates: {
            ...prev.exchangeRates,
            ...exchangeRates,
          },
          isLoading: false,
        }));

        // Load translations for saved locale if different from English
        if (savedLocale !== 'en') {
          const savedLocaleTranslations = await loadTranslations(savedLocale);
          setState(prev => ({
            ...prev,
            translations: {
              ...prev.translations,
              [savedLocale]: savedLocaleTranslations,
            },
          }));
        }

        // Update document language
        document.documentElement.lang = savedLocale;
        
        // Start periodic exchange rate updates
        const exchangeRateInterval = setInterval(updateExchangeRates, 4 * 60 * 60 * 1000); // Every 4 hours
        
        return () => clearInterval(exchangeRateInterval);
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: 'Failed to initialize internationalization',
          isLoading: false,
        }));
      }
    };

    initializeInternationalization();
  }, [updateExchangeRates]);

  return {
    // State
    ...state,
    
    // Locale Management
    changeLocale,
    translate,
    
    // Currency Management
    changeCurrency,
    convertPrice,
    updateExchangeRates,
    
    // Regional Services
    getRegionalSettings,
    calculateTax,
    calculateShipping,
    
    // Compliance
    checkCompliance,
    generateInternationalDocuments,
    
    // Market Intelligence
    getMarketAnalysis,
  };
}

// 🔧 HELPER FUNCTIONS

function shouldUpdateExchangeRates(exchangeRates: ExchangeRates): boolean {
  const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);
  return exchangeRates.lastUpdated < fourHoursAgo;
}

async function loadTranslations(locale: string): Promise<Record<string, string>> {
  // Simulate loading translations from API or files
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const translationMaps = {
    'en': {
      'welcome': 'Welcome',
      'product.name': 'Product Name',
      'product.price': 'Price',
      'cart.add': 'Add to Cart',
      'cart.total': 'Total: {{amount}}',
      'shipping.free': 'Free Shipping',
      'currency.symbol': '$',
    },
    'fr': {
      'welcome': 'Bienvenue',
      'product.name': 'Nom du Produit',
      'product.price': 'Prix',
      'cart.add': 'Ajouter au Panier',
      'cart.total': 'Total: {{amount}}',
      'shipping.free': 'Livraison Gratuite',
      'currency.symbol': '€',
    },
    'es': {
      'welcome': 'Bienvenido',
      'product.name': 'Nombre del Producto',
      'product.price': 'Precio',
      'cart.add': 'Añadir al Carrito',
      'cart.total': 'Total: {{amount}}',
      'shipping.free': 'Envío Gratis',
      'currency.symbol': '€',
    },
  };

  return translationMaps[locale] || translationMaps['en'];
}

async function fetchExchangeRates(baseCurrency: string) {
  // Simulate API call to exchange rate service
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock exchange rates
  const mockRates = {
    'USD': 1,
    'EUR': 0.85,
    'GBP': 0.73,
    'CAD': 1.25,
    'AUD': 1.35,
    'JPY': 110.0,
    'XAF': 600.0, // Central African CFA franc
    'NGN': 411.0, // Nigerian Naira
    'GHS': 6.1,   // Ghanaian Cedi
    'KES': 108.0, // Kenyan Shilling
    'ZAR': 14.5,  // South African Rand
  };

  return {
    baseCurrency,
    rates: mockRates,
    lastUpdated: new Date(),
    provider: 'ExchangeRate-API',
  };
}

function detectUserLocale(): string {
  // Detect user's preferred locale
  return navigator.language.split('-')[0] || 'en';
}

function detectUserCurrency(): string {
  // Simple currency detection based on locale
  const locale = navigator.language;
  const currencyMap = {
    'en-US': 'USD',
    'en-CA': 'CAD',
    'en-GB': 'GBP',
    'fr': 'EUR',
    'es': 'EUR',
    'de': 'EUR',
    'ja': 'JPY',
    'fr-CM': 'XAF',
  };
  
  return currencyMap[locale] || 'USD';
}

function generateComplianceRecommendations(issues: any[]): string[] {
  return issues.map(issue => {
    switch (issue.type) {
      case 'tax':
        return 'Register for VAT in applicable countries';
      case 'data_privacy':
        return 'Implement GDPR compliance measures';
      case 'shipping':
        return 'Obtain required shipping certifications';
      default:
        return 'Review local regulations';
    }
  });
}

async function generateCommercialInvoice(data: any) {
  return {
    type: 'commercial_invoice',
    id: `CI_${data.orderId}`,
    url: '/documents/commercial_invoice.pdf',
    generatedAt: new Date(),
  };
}

async function generateCustomsDeclaration(data: any) {
  return {
    type: 'customs_declaration',
    id: `CD_${data.orderId}`,
    url: '/documents/customs_declaration.pdf',
    generatedAt: new Date(),
  };
}

async function generateCertificateOfOrigin(data: any) {
  return {
    type: 'certificate_of_origin',
    id: `CO_${data.orderId}`,
    url: '/documents/certificate_of_origin.pdf',
    generatedAt: new Date(),
  };
}

function generateSeasonalTrends() {
  return {
    'Q1': { demand: 'medium', categories: ['accessories', 'tops'] },
    'Q2': { demand: 'high', categories: ['dresses', 'summer wear'] },
    'Q3': { demand: 'high', categories: ['dresses', 'summer wear'] },
    'Q4': { demand: 'very high', categories: ['formal wear', 'holiday clothing'] },
  };
}

function getPaymentPreferences(countryCode: string) {
  const preferences = {
    'US': ['credit_card', 'paypal', 'apple_pay'],
    'GB': ['credit_card', 'paypal', 'bank_transfer'],
    'DE': ['bank_transfer', 'paypal', 'credit_card'],
    'FR': ['credit_card', 'paypal', 'bank_transfer'],
    'CM': ['mobile_money', 'bank_transfer', 'cash_on_delivery'],
    'NG': ['bank_transfer', 'mobile_money', 'credit_card'],
  };
  
  return preferences[countryCode] || preferences['US'];
}

function getShippingPreferences(countryCode: string) {
  const preferences = {
    'US': { speed: 'fast', packaging: 'minimal', tracking: 'required' },
    'DE': { speed: 'reliable', packaging: 'eco-friendly', tracking: 'required' },
    'CM': { speed: 'affordable', packaging: 'secure', tracking: 'optional' },
  };
  
  return preferences[countryCode] || preferences['US'];
}

function getCulturalConsiderations(countryCode: string) {
  const considerations = {
    'US': ['Informal communication', 'Fast service expected'],
    'DE': ['Formal communication', 'Punctuality important'],
    'CM': ['Respectful communication', 'Community-oriented'],
    'NG': ['Relationship-building important', 'Bargaining culture'],
  };
  
  return considerations[countryCode] || [];
}

function generateSupportedLocales(): Locale[] {
  return [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
      direction: 'ltr',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      numberFormat: {
        decimal: '.',
        thousands: ',',
        currency: { symbol: '$', position: 'before' },
      },
      isActive: true,
      completion: 100,
    },
    {
      code: 'fr',
      name: 'French',
      nativeName: 'Français',
      flag: '🇫🇷',
      direction: 'ltr',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      numberFormat: {
        decimal: ',',
        thousands: ' ',
        currency: { symbol: '€', position: 'after' },
      },
      isActive: true,
      completion: 85,
    },
    {
      code: 'es',
      name: 'Spanish',
      nativeName: 'Español',
      flag: '🇪🇸',
      direction: 'ltr',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      numberFormat: {
        decimal: ',',
        thousands: '.',
        currency: { symbol: '€', position: 'after' },
      },
      isActive: true,
      completion: 78,
    },
  ];
}

function generateSupportedCurrencies(): Currency[] {
  return [
    {
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
      decimals: 2,
      isActive: true,
      isCrypto: false,
      supportedCountries: ['US', 'EC', 'SV'],
      minimumAmount: 0.01,
      maximumAmount: 50000,
    },
    {
      code: 'EUR',
      name: 'Euro',
      symbol: '€',
      decimals: 2,
      isActive: true,
      isCrypto: false,
      supportedCountries: ['DE', 'FR', 'IT', 'ES'],
      minimumAmount: 0.01,
      maximumAmount: 50000,
    },
    {
      code: 'XAF',
      name: 'Central African CFA Franc',
      symbol: 'FCFA',
      decimals: 0,
      isActive: true,
      isCrypto: false,
      supportedCountries: ['CM', 'CF', 'TD', 'CG', 'GQ', 'GA'],
      minimumAmount: 1,
      maximumAmount: 30000000,
    },
    {
      code: 'NGN',
      name: 'Nigerian Naira',
      symbol: '₦',
      decimals: 2,
      isActive: true,
      isCrypto: false,
      supportedCountries: ['NG'],
      minimumAmount: 1,
      maximumAmount: 20000000,
    },
  ];
}

function generateRegionalSettings(): RegionalSettings {
  return {
    'US': {
      countryName: 'United States',
      locale: 'en',
      currency: 'USD',
      timezone: 'America/New_York',
      taxRate: 0.08,
      shippingZone: 'domestic',
      paymentMethods: ['credit_card', 'paypal', 'apple_pay', 'google_pay'],
      regulations: [
        {
          type: 'tax',
          title: 'Sales Tax',
          description: 'State and local sales tax applies',
          complianceRequired: true,
          documentation: ['Tax Registration Certificate'],
        },
      ],
      businessHours: {
        timezone: 'America/New_York',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        hours: { start: '09:00', end: '17:00' },
        supportLanguages: ['en'],
      },
      holidays: [
        {
          date: '2024-07-04',
          name: 'Independence Day',
          type: 'national',
          affectsShipping: true,
          affectsSupport: true,
        },
      ],
    },
    'CM': {
      countryName: 'Cameroon',
      locale: 'fr',
      currency: 'XAF',
      timezone: 'Africa/Douala',
      taxRate: 0.1925,
      shippingZone: 'international',
      paymentMethods: ['mobile_money', 'bank_transfer', 'cash_on_delivery'],
      regulations: [
        {
          type: 'import_duty',
          title: 'Import Duties',
          description: 'Import duties apply to international shipments',
          complianceRequired: true,
          documentation: ['Commercial Invoice', 'Import License'],
        },
      ],
      businessHours: {
        timezone: 'Africa/Douala',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        hours: { start: '08:00', end: '17:00' },
        supportLanguages: ['fr', 'en'],
      },
      holidays: [
        {
          date: '2024-05-20',
          name: 'National Day',
          type: 'national',
          affectsShipping: true,
          affectsSupport: true,
        },
      ],
    },
  };
}