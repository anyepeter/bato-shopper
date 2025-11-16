import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useInternationalization } from '../../hooks/useInternationalization';
import { BootstrapIcon } from '../BootstrapIcon';

export function InternationalDashboard() {
  const {
    currentLocale,
    supportedLocales,
    currencies,
    currentCurrency,
    exchangeRates,
    regionalSettings,
    complianceData,
    isLoading,
    error,
    changeLocale,
    changeCurrency,
    convertPrice,
    translate,
    calculateTax,
    calculateShipping,
    getMarketAnalysis,
  } = useInternationalization();

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [marketData, setMarketData] = useState<any>(null);

  useEffect(() => {
    const loadMarketData = async () => {
      const data = getMarketAnalysis(selectedCountry);
      setMarketData(data);
    };
    loadMarketData();
  }, [selectedCountry, getMarketAnalysis]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading international features...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">International Expansion</h1>
          <p className="text-gray-600">Manage global markets, currencies, and compliance</p>
        </div>
        
        <div className="flex space-x-2">
          <Select value={currentLocale} onValueChange={changeLocale}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {supportedLocales.map((locale) => (
                <SelectItem key={locale.code} value={locale.code}>
                  {locale.flag} {locale.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={currentCurrency} onValueChange={changeCurrency}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.filter(c => c.isActive).map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  {currency.symbol} {currency.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Markets</p>
                <p className="text-2xl font-bold">{Object.keys(regionalSettings).length}</p>
              </div>
              <BootstrapIcon name="globe" className="text-blue-600 text-2xl" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Supported Currencies</p>
                <p className="text-2xl font-bold">{currencies.filter(c => c.isActive).length}</p>
              </div>
              <BootstrapIcon name="currency-exchange" className="text-green-600 text-2xl" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Languages</p>
                <p className="text-2xl font-bold">{supportedLocales.filter(l => l.isActive).length}</p>
              </div>
              <BootstrapIcon name="translate" className="text-purple-600 text-2xl" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Compliance Score</p>
                <p className="text-2xl font-bold">98%</p>
              </div>
              <BootstrapIcon name="shield-check" className="text-orange-600 text-2xl" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="markets">Markets</TabsTrigger>
          <TabsTrigger value="localization">Localization</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Exchange Rates */}
          <Card>
            <CardHeader>
              <CardTitle>Exchange Rates</CardTitle>
              <CardDescription>
                Last updated: {exchangeRates.lastUpdated.toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(exchangeRates.rates).slice(0, 8).map(([currency, rate]) => (
                  <div key={currency} className="text-center p-3 border rounded">
                    <div className="font-bold text-lg">{currency}</div>
                    <div className="text-sm text-gray-600">{rate.toFixed(4)}</div>
                    <div className="text-xs text-green-600">+0.5%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Market Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Global Market Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(regionalSettings).map(([countryCode, settings]) => (
                  <div key={countryCode} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{settings.countryName}</h4>
                      <Badge variant="outline">{settings.currency}</Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Market Size:</span>
                        <span className="font-medium ml-1">${Math.floor(Math.random() * 500000).toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Growth:</span>
                        <span className="font-medium ml-1 text-green-600">+{Math.floor(Math.random() * 20 + 5)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Tax Rate:</span>
                        <span className="font-medium ml-1">{(settings.taxRate * 100).toFixed(1)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Payment Methods:</span>
                        <span className="font-medium ml-1">{settings.paymentMethods.length}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="markets" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Market Analysis</h3>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(regionalSettings).map(([code, settings]) => (
                  <SelectItem key={code} value={code}>
                    {settings.countryName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {marketData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Market Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Market Size:</span>
                      <span className="font-bold ml-1">${marketData.marketSize.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Competition:</span>
                      <span className="font-bold ml-1 capitalize">{marketData.competition}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Growth Rate:</span>
                      <span className="font-bold ml-1 text-green-600">+{marketData.growthRate}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Avg Order Value:</span>
                      <span className="font-bold ml-1">${marketData.averageOrderValue}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Payment Methods</h4>
                    <div className="flex flex-wrap gap-2">
                      {marketData.paymentPreferences.map((method: string, index: number) => (
                        <Badge key={index} variant="outline">{method.replace('_', ' ')}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Popular Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {marketData.popularCategories.map((category: string, index: number) => (
                        <Badge key={index} variant="secondary">{category}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Cultural Considerations</h4>
                    <ul className="text-sm space-y-1">
                      {marketData.culturalConsiderations.map((consideration: string, index: number) => (
                        <li key={index} className="flex items-center">
                          <BootstrapIcon name="check" className="text-green-600 mr-2" />
                          {consideration}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="localization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Translation Progress</CardTitle>
              <CardDescription>Localization status for supported languages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {supportedLocales.map((locale) => (
                  <div key={locale.code} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{locale.flag}</span>
                        <div>
                          <h4 className="font-medium">{locale.name}</h4>
                          <p className="text-sm text-gray-600">{locale.nativeName}</p>
                        </div>
                      </div>
                      <Badge variant={locale.isActive ? 'default' : 'secondary'}>
                        {locale.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Translation Completion</span>
                        <span className="font-medium">{locale.completion}%</span>
                      </div>
                      <Progress value={locale.completion} className="h-2" />
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-3 text-xs text-gray-600">
                      <div>
                        <span>Direction:</span>
                        <span className="font-medium ml-1 uppercase">{locale.direction}</span>
                      </div>
                      <div>
                        <span>Date Format:</span>
                        <span className="font-medium ml-1">{locale.dateFormat}</span>
                      </div>
                      <div>
                        <span>Number Format:</span>
                        <span className="font-medium ml-1">{locale.numberFormat.decimal}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>GDPR Compliance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Consent Tracking</span>
                  <Badge variant={complianceData.gdprCompliance.consentTracking ? 'default' : 'destructive'}>
                    {complianceData.gdprCompliance.consentTracking ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Right to be Forgotten</span>
                  <Badge variant={complianceData.gdprCompliance.rightToBeForgotten ? 'default' : 'destructive'}>
                    {complianceData.gdprCompliance.rightToBeForgotten ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Data Portability</span>
                  <Badge variant={complianceData.gdprCompliance.dataPortability ? 'default' : 'destructive'}>
                    {complianceData.gdprCompliance.dataPortability ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Cookie Banner</span>
                  <Badge variant={complianceData.gdprCompliance.cookieBanner ? 'default' : 'destructive'}>
                    {complianceData.gdprCompliance.cookieBanner ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tax Compliance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">VAT Registrations</span>
                  <Badge variant="outline">
                    {complianceData.taxCompliance.vatRegistrations.length} countries
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Auto Tax Calculation</span>
                  <Badge variant={complianceData.taxCompliance.automaticTaxCalculation ? 'default' : 'destructive'}>
                    {complianceData.taxCompliance.automaticTaxCalculation ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Digital Services Tax</span>
                  <Badge variant={complianceData.taxCompliance.digitalServicesTax ? 'default' : 'destructive'}>
                    {complianceData.taxCompliance.digitalServicesTax ? 'Compliant' : 'Non-compliant'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Customs Duty Calc</span>
                  <Badge variant={complianceData.taxCompliance.customsDutyCalculation ? 'default' : 'destructive'}>
                    {complianceData.taxCompliance.customsDutyCalculation ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Restricted Countries</h4>
                  {complianceData.shippingCompliance.restrictedCountries.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {complianceData.shippingCompliance.restrictedCountries.map((country, index) => (
                        <Badge key={index} variant="destructive">{country}</Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">No shipping restrictions</p>
                  )}
                </div>

                <div>
                  <h4 className="font-medium mb-3">Compliance Features</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Customs Documentation</span>
                      <Badge variant={complianceData.shippingCompliance.customsDocumentation ? 'default' : 'destructive'}>
                        {complianceData.shippingCompliance.customsDocumentation ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Commercial Invoices</span>
                      <Badge variant={complianceData.shippingCompliance.commercialInvoiceGeneration ? 'default' : 'destructive'}>
                        {complianceData.shippingCompliance.commercialInvoiceGeneration ? 'Auto-generated' : 'Manual'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dynamic Pricing Calculator</CardTitle>
              <CardDescription>Calculate prices with taxes and shipping for different markets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Base Price (USD)</label>
                    <input 
                      type="number" 
                      defaultValue="89.99"
                      className="w-full p-2 border rounded mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Target Country</label>
                    <Select defaultValue="US">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(regionalSettings).map(([code, settings]) => (
                          <SelectItem key={code} value={code}>
                            {settings.countryName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Product Category</label>
                    <Select defaultValue="clothing">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clothing">Clothing</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                        <SelectItem value="luxury">Luxury Items</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium mb-3">Price Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Base Price:</span>
                      <span>$89.99</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Converted Price ({currentCurrency}):</span>
                      <span>{currencies.find(c => c.code === currentCurrency)?.symbol}{convertPrice(89.99).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (8%):</span>
                      <span>{currencies.find(c => c.code === currentCurrency)?.symbol}{(convertPrice(89.99) * 0.08).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>{currencies.find(c => c.code === currentCurrency)?.symbol}12.50</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>Total Price:</span>
                      <span>{currencies.find(c => c.code === currentCurrency)?.symbol}{(convertPrice(89.99) * 1.08 + 12.50).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}