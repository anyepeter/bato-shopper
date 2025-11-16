import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Package, ShoppingBag, Ruler, DollarSign, Truck, Star, MessageCircle } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
}

interface ProductQuestionInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  featuredProducts: Product[];
  onSendProductQuestion: (productId: string, question: string, questionType: string) => void;
  className?: string;
}

const QUESTION_TEMPLATES = {
  sizing: [
    "What sizes are available for this product?",
    "How does this fit? True to size?",
    "Can you show the size chart?",
    "What size would you recommend for me?"
  ],
  materials: [
    "What material is this made from?",
    "Is this fabric stretchy?",
    "How does this feel when wearing?",
    "Is this suitable for sensitive skin?"
  ],
  pricing: [
    "What's the current price?",
    "Are there any discounts available?",
    "Is this price final or can it go lower?",
    "Do you offer payment plans?"
  ],
  shipping: [
    "How long does shipping take?",
    "What are the shipping costs?",
    "Do you ship internationally?",
    "Can I get express delivery?"
  ],
  availability: [
    "Is this still in stock?",
    "When will this be restocked?",
    "How many are left?",
    "Can I pre-order if out of stock?"
  ],
  styling: [
    "How would you style this?",
    "What occasions is this good for?",
    "What should I pair this with?",
    "Can you show different ways to wear this?"
  ]
};

const QUESTION_CATEGORIES = [
  { id: 'sizing', label: 'Sizing & Fit', icon: Ruler, color: 'bg-blue-500/20 text-blue-400' },
  { id: 'materials', label: 'Materials', icon: Package, color: 'bg-green-500/20 text-green-400' },
  { id: 'pricing', label: 'Pricing', icon: DollarSign, color: 'bg-yellow-500/20 text-yellow-400' },
  { id: 'shipping', label: 'Shipping', icon: Truck, color: 'bg-purple-500/20 text-purple-400' },
  { id: 'availability', label: 'Stock', icon: ShoppingBag, color: 'bg-red-500/20 text-red-400' },
  { id: 'styling', label: 'Styling', icon: Star, color: 'bg-pink-500/20 text-pink-400' }
];

export const ProductQuestionInterface: React.FC<ProductQuestionInterfaceProps> = ({
  isOpen,
  onClose,
  featuredProducts,
  onSendProductQuestion,
  className = ''
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [customQuestion, setCustomQuestion] = useState('');
  const [step, setStep] = useState<'product' | 'category' | 'question'>('product');

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setStep('category');
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setStep('question');
  };

  const handleQuestionSelect = (question: string) => {
    if (selectedProduct) {
      onSendProductQuestion(selectedProduct.id, question, selectedCategory);
      handleClose();
    }
  };

  const handleCustomQuestionSend = () => {
    if (selectedProduct && customQuestion.trim()) {
      onSendProductQuestion(selectedProduct.id, customQuestion, selectedCategory);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedProduct(null);
    setSelectedCategory('');
    setCustomQuestion('');
    setStep('product');
    onClose();
  };

  const handleBack = () => {
    if (step === 'question') setStep('category');
    else if (step === 'category') setStep('product');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-50 flex items-end justify-center ${className}`}
          style={{ background: 'rgba(0, 0, 0, 0.8)' }}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full max-w-md rounded-t-2xl overflow-hidden"
            style={{ 
              background: 'rgba(0, 0, 0, 0.95)',
              backdropFilter: 'blur(20px)',
              maxHeight: '80vh'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                {step !== 'product' && (
                  <motion.button
                    onClick={handleBack}
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M10 12L6 8L10 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.button>
                )}
                <h3 className="font-heading text-lg font-bold text-white">
                  {step === 'product' && 'Ask About Product'}
                  {step === 'category' && 'Question Category'}
                  {step === 'question' && 'Select Question'}
                </h3>
              </div>
              <motion.button
                onClick={handleClose}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={16} color="white" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-4 max-h-96 overflow-y-auto">
              {/* Step 1: Product Selection */}
              {step === 'product' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-3"
                >
                  <p className="text-white/80 font-body text-sm mb-4">
                    Select a featured product to ask questions about:
                  </p>
                  {featuredProducts.map((product) => (
                    <motion.button
                      key={product.id}
                      onClick={() => handleProductSelect(product)}
                      className="w-full p-3 rounded-lg border border-white/10 text-left"
                      style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                      whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                          style={{ borderRadius: '6px' }}
                        />
                        <div className="flex-1">
                          <h4 className="font-heading font-medium text-white text-sm">
                            {product.name}
                          </h4>
                          <p className="text-white/60 font-body text-xs">
                            {product.category} • {product.price}
                          </p>
                        </div>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M6 4L10 8L6 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {/* Step 2: Category Selection */}
              {step === 'category' && selectedProduct && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-3"
                >
                  {/* Selected Product Display */}
                  <div className="p-3 rounded-lg border border-white/10 mb-4"
                       style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                    <div className="flex items-center gap-3">
                      <img 
                        src={selectedProduct.image} 
                        alt={selectedProduct.name}
                        className="w-10 h-10 object-cover rounded"
                        style={{ borderRadius: '6px' }}
                      />
                      <div>
                        <h4 className="font-heading font-medium text-white text-sm">
                          {selectedProduct.name}
                        </h4>
                        <p className="text-white/60 font-body text-xs">
                          {selectedProduct.price}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-white/80 font-body text-sm mb-4">
                    What would you like to know about this product?
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {QUESTION_CATEGORIES.map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <motion.button
                          key={category.id}
                          onClick={() => handleCategorySelect(category.id)}
                          className={`p-3 rounded-lg border border-white/10 text-center ${category.color}`}
                          style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <IconComponent size={20} className="mx-auto mb-2" />
                          <span className="font-body text-xs">{category.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Question Selection */}
              {step === 'question' && selectedCategory && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-3"
                >
                  {/* Selected Product & Category Display */}
                  <div className="p-3 rounded-lg border border-white/10 mb-4"
                       style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                    <div className="flex items-center gap-3 mb-2">
                      <img 
                        src={selectedProduct?.image} 
                        alt={selectedProduct?.name}
                        className="w-8 h-8 object-cover rounded"
                        style={{ borderRadius: '4px' }}
                      />
                      <div className="flex-1">
                        <h4 className="font-heading font-medium text-white text-xs">
                          {selectedProduct?.name}
                        </h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const category = QUESTION_CATEGORIES.find(c => c.id === selectedCategory);
                        if (!category) return null;
                        const IconComponent = category.icon;
                        return (
                          <>
                            <IconComponent size={14} className="text-white/60" />
                            <span className="text-white/60 font-body text-xs">{category.label}</span>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  <p className="text-white/80 font-body text-sm mb-4">
                    Choose a question or write your own:
                  </p>

                  {/* Quick Questions */}
                  <div className="space-y-2 mb-4">
                    {QUESTION_TEMPLATES[selectedCategory as keyof typeof QUESTION_TEMPLATES]?.map((question, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleQuestionSelect(question)}
                        className="w-full p-3 rounded-lg border border-white/10 text-left"
                        style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                        whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="text-white font-body text-sm">{question}</span>
                      </motion.button>
                    ))}
                  </div>

                  {/* Custom Question Input */}
                  <div className="border-t border-white/10 pt-4">
                    <p className="text-white/80 font-body text-sm mb-3">Or ask your own question:</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customQuestion}
                        onChange={(e) => setCustomQuestion(e.target.value)}
                        placeholder="Type your question..."
                        className="flex-1 px-3 py-2 bg-white/10 text-white placeholder-white/60 border border-white/20 focus:border-[#5825efff] focus:outline-none font-body text-sm rounded-lg"
                        style={{ borderRadius: '6px' }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleCustomQuestionSend();
                          }
                        }}
                      />
                      <motion.button
                        onClick={handleCustomQuestionSend}
                        disabled={!customQuestion.trim()}
                        className="px-4 py-2 bg-[#5825efff] text-white font-body text-sm rounded-lg disabled:opacity-50"
                        style={{ borderRadius: '6px' }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <MessageCircle size={16} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};