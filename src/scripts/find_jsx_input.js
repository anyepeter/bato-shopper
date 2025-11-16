const fs = require('fs');

try {
  const content = fs.readFileSync('/components/chat/ProductCommunityChatRoomFixed.tsx', 'utf8');
  const lines = content.split('\n');
  
  console.log('🔍 Looking for JSX return statement and Input usage...\n');
  
  let foundReturn = false;
  let foundReviewsTab = false;
  let foundInput = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Look for return statement
    if (trimmed.startsWith('return (') || trimmed.startsWith('return(')) {
      foundReturn = true;
      console.log(`📍 Found return statement at line ${i + 1}`);
    }
    
    // Look for reviews TabsContent after return
    if (foundReturn && trimmed.includes('TabsContent') && trimmed.includes('value="reviews"')) {
      foundReviewsTab = true;
      console.log(`📍 Found reviews TabsContent at line ${i + 1}`);
    }
    
    // Look for Input component in reviews section
    if (foundReviewsTab && trimmed.includes('<Input') && 
        (trimmed.includes('reviewTabMessage') || 
         trimmed.includes('reviewTabInputRef') ||
         trimmed.includes('Share your thoughts'))) {
      foundInput = true;
      console.log(`🎯 Found Input component at line ${i + 1}:`);
      console.log(`   ${trimmed}`);
      
      // Show a few surrounding lines for context
      console.log('\nContext (lines around the Input):');
      for (let j = Math.max(0, i - 3); j <= Math.min(lines.length - 1, i + 3); j++) {
        const prefix = j === i ? '>>> ' : '    ';
        console.log(`${prefix}${j + 1}: ${lines[j]}`);
      }
      break;
    }
  }
  
  if (!foundReturn) {
    console.log('❌ Could not find return statement');
  } else if (!foundReviewsTab) {
    console.log('❌ Could not find reviews TabsContent');
  } else if (!foundInput) {
    console.log('❌ Could not find Input component in reviews section');
    console.log('✅ This might mean EnhancedReviewInput is already being used!');
  }
  
} catch (error) {
  console.error('Error reading file:', error);
}
