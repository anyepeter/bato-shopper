const fs = require('fs');

try {
  let content = fs.readFileSync('/components/chat/ProductCommunityChatRoomFixed.tsx', 'utf8');
  
  // Search for Input component that uses reviewTabMessage 
  // We need to find the pattern and replace it with EnhancedReviewInput
  
  // Pattern to match the Input component with all its props
  const inputPattern = /<Input\s+([^>]*ref={reviewTabInputRef}[^>]*|[^>]*value={reviewTabMessage}[^>]*)\s*\/?>(\ s*<\/Input>)?/g;
  
  // Find all matches
  const matches = [...content.matchAll(inputPattern)];
  
  if (matches.length > 0) {
    console.log(`Found ${matches.length} Input component(s) to replace:`);
    
    matches.forEach((match, index) => {
      console.log(`\nMatch ${index + 1}: ${match[0]}`);
      
      // Find the line number for context
      const beforeMatch = content.substring(0, match.index);
      const lineNumber = beforeMatch.split('\n').length;
      console.log(`At line: ${lineNumber}`);
    });
    
    // For now, just show what we found - we'll do the replacement after confirming
    console.log('\nReady to replace with EnhancedReviewInput...');
    
  } else {
    console.log('No Input component found with reviewTabMessage or reviewTabInputRef');
    
    // Try a simpler search
    console.log('\nSearching for any line containing both "Input" and "reviewTab"...');
    const lines = content.split('\n');
    lines.forEach((line, index) => {
      if (line.includes('Input') && line.includes('reviewTab')) {
        console.log(`Line ${index + 1}: ${line.trim()}`);
      }
    });
  }
  
} catch (error) {
  console.error('Error reading file:', error);
}
