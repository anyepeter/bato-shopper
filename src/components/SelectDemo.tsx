import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export const SelectDemo = () => {
  const [itemsPerPage, setItemsPerPage] = useState('12');
  const [sortBy, setSortBy] = useState('featured');
  const [category, setCategory] = useState('all');
  const [productType, setProductType] = useState('');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');

  return (
    <div 
      className="p-8 max-w-4xl mx-auto"
      style={{ 
        backgroundColor: 'var(--pure-white)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        fontFamily: 'var(--font-body)'
      }}
    >
      <h1 
        className="mb-8 text-center"
        style={{ 
          fontFamily: 'var(--font-heading)',
          color: 'var(--primary-blue)',
          fontSize: '24px',
          fontWeight: '500'
        }}
      >
        Modish Style Select Components
      </h1>

      {/* Basic Select Examples */}
      <div className="mb-8">
        <h2 
          className="mb-4"
          style={{ 
            fontFamily: 'var(--font-heading)',
            color: 'var(--primary-blue)',
            fontSize: '18px',
            fontWeight: '500'
          }}
        >
          Basic Select Examples
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Items Per Page */}
          <div>
            <label 
              className="block mb-2"
              style={{ 
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--font-size)',
                fontWeight: '500',
                color: 'var(--foreground)'
              }}
            >
              Items per page
            </label>
            <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
              <SelectTrigger 
                className="w-full"
                size="sm"
                style={{ 
                  borderRadius: 'var(--radius-md)', 
                  fontFamily: 'var(--font-body)',
                  backgroundColor: 'var(--input-background)',
                  border: '0.5px solid var(--border)'
                }}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6</SelectItem>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="24">24</SelectItem>
                <SelectItem value="48">48</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div>
            <label 
              className="block mb-2"
              style={{ 
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--font-size)',
                fontWeight: '500',
                color: 'var(--foreground)'
              }}
            >
              Sort by
            </label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger 
                style={{ 
                  borderRadius: 'var(--radius-md)', 
                  fontFamily: 'var(--font-body)',
                  backgroundColor: 'var(--input-background)',
                  border: '0.5px solid var(--border)'
                }}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div>
            <label 
              className="block mb-2"
              style={{ 
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--font-size)',
                fontWeight: '500',
                color: 'var(--foreground)'
              }}
            >
              Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger 
                style={{ 
                  borderRadius: 'var(--radius-md)', 
                  fontFamily: 'var(--font-body)',
                  backgroundColor: 'var(--input-background)',
                  border: '0.5px solid var(--border)'
                }}
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectSeparator />
                <SelectItem value="dresses">👗 Dresses</SelectItem>
                <SelectItem value="tops">👚 Tops</SelectItem>
                <SelectItem value="accessories">💎 Accessories</SelectItem>
                <SelectItem value="traditional">🎭 Traditional</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Small Size Selects */}
      <div className="mb-8">
        <h2 
          className="mb-4"
          style={{ 
            fontFamily: 'var(--font-heading)',
            color: 'var(--primary-blue)',
            fontSize: '18px',
            fontWeight: '500'
          }}
        >
          Small Size Examples
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Size Selection */}
          <div>
            <label 
              className="block mb-2"
              style={{ 
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--font-size)',
                fontWeight: '500',
                color: 'var(--foreground)'
              }}
            >
              Size
            </label>
            <Select value={size} onValueChange={setSize}>
              <SelectTrigger 
                size="sm"
                style={{ 
                  borderRadius: 'var(--radius-md)', 
                  fontFamily: 'var(--font-body)',
                  backgroundColor: 'var(--input-background)',
                  border: '0.5px solid var(--border)'
                }}
              >
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xs">XS</SelectItem>
                <SelectItem value="s">S</SelectItem>
                <SelectItem value="m">M</SelectItem>
                <SelectItem value="l">L</SelectItem>
                <SelectItem value="xl">XL</SelectItem>
                <SelectItem value="xxl">XXL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Color Selection */}
          <div>
            <label 
              className="block mb-2"
              style={{ 
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--font-size)',
                fontWeight: '500',
                color: 'var(--foreground)'
              }}
            >
              Color
            </label>
            <Select value={color} onValueChange={setColor}>
              <SelectTrigger 
                size="sm"
                style={{ 
                  borderRadius: 'var(--radius-md)', 
                  fontFamily: 'var(--font-body)',
                  backgroundColor: 'var(--input-background)',
                  border: '0.5px solid var(--border)'
                }}
              >
                <SelectValue placeholder="Select color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="red">🔴 Red</SelectItem>
                <SelectItem value="blue">🔵 Blue</SelectItem>
                <SelectItem value="green">🟢 Green</SelectItem>
                <SelectItem value="orange">🟠 Orange</SelectItem>
                <SelectItem value="black">⚫ Black</SelectItem>
                <SelectItem value="white">⚪ White</SelectItem>
                <SelectItem value="multi">🌈 Multi-color</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Grouped Select */}
      <div className="mb-8">
        <h2 
          className="mb-4"
          style={{ 
            fontFamily: 'var(--font-heading)',
            color: 'var(--primary-blue)',
            fontSize: '18px',
            fontWeight: '500'
          }}
        >
          Grouped Select Example
        </h2>
        
        <div className="max-w-md">
          <label 
            className="block mb-2"
            style={{ 
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--font-size)',
              fontWeight: '500',
              color: 'var(--foreground)'
            }}
          >
            Product Type
          </label>
          <Select value={productType} onValueChange={setProductType}>
            <SelectTrigger 
              style={{ 
                borderRadius: 'var(--radius-md)', 
                fontFamily: 'var(--font-body)',
                backgroundColor: 'var(--input-background)',
                border: '0.5px solid var(--border)'
              }}
            >
              <SelectValue placeholder="Select product type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Clothing</SelectLabel>
                <SelectItem value="dresses">Dresses</SelectItem>
                <SelectItem value="tops">Tops</SelectItem>
                <SelectItem value="bottoms">Bottoms</SelectItem>
                <SelectItem value="sets">Sets</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Accessories</SelectLabel>
                <SelectItem value="jewelry">Jewelry</SelectItem>
                <SelectItem value="bags">Bags</SelectItem>
                <SelectItem value="shoes">Shoes</SelectItem>
                <SelectItem value="scarves">Scarves</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Traditional</SelectLabel>
                <SelectItem value="ankara">Ankara Prints</SelectItem>
                <SelectItem value="kente">Kente</SelectItem>
                <SelectItem value="dashiki">Dashiki</SelectItem>
                <SelectItem value="boubou">Boubou</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Selected Values Display */}
      <div 
        className="p-4 rounded"
        style={{
          backgroundColor: 'var(--accent)',
          borderRadius: 'var(--radius-md)',
          border: '0.5px solid var(--border)'
        }}
      >
        <h3 
          className="mb-3"
          style={{ 
            fontFamily: 'var(--font-heading)',
            color: 'var(--primary-blue)',
            fontSize: '16px',
            fontWeight: '500'
          }}
        >
          Selected Values:
        </h3>
        <div 
          className="space-y-1"
          style={{ 
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--font-size)',
            color: 'var(--foreground)'
          }}
        >
          <p><strong>Items per page:</strong> {itemsPerPage}</p>
          <p><strong>Sort by:</strong> {sortBy}</p>
          <p><strong>Category:</strong> {category}</p>
          <p><strong>Size:</strong> {size || 'Not selected'}</p>
          <p><strong>Color:</strong> {color || 'Not selected'}</p>
          <p><strong>Product Type:</strong> {productType || 'Not selected'}</p>
        </div>
      </div>
    </div>
  );
};