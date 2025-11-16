// Search script to find ADD TO CART buttons in LiveStreamGrid
// This will help us locate the specific code section
const fs = require('fs');

try {
  const content = fs.readFileSync('/components/streaming/LiveStreamGrid.tsx', 'utf8');
  
  // Look for ADD TO CART related code
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    if (line.toLowerCase().includes('add to cart') || 
        line.toLowerCase().includes('addtocart') ||
        line.includes('🛒') ||
        line.includes('cart-plus')) {
      console.log(`Line ${index + 1}: ${line.trim()}`);
    }
  });
  
  // Look for motion.button or button elements
  let inProductMap = false;
  lines.forEach((line, index) => {
    if (line.includes('currentStream.products.map')) {
      inProductMap = true;
    }
    
    if (inProductMap && (line.includes('motion.button') || line.includes('<button'))) {
      console.log(`Product button at line ${index + 1}: ${line.trim()}`);
    }
    
    if (inProductMap && line.includes('})')) {
      inProductMap = false;
    }
  });
  
} catch (error) {
  console.error('Error reading file:', error.message);
}
