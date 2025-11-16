const fs = require('fs');

try {
  let content = fs.readFileSync('/components/chat/ProductCommunityChatRoomFixed.tsx', 'utf8');
  
  // Search for the Input component that uses reviewTabMessage
  const inputPattern = /<Input[^>]*value={reviewTabMessage}[^>]*\/?>(?:[^<]*<\/Input>)?/g;
  
  const matches = [...content.matchAll(inputPattern)];
  
  if (matches.length > 0) {
    console.log(`Found ${matches.length} Input component(s) using reviewTabMessage`);
    
    for (let match of matches) {
      console.log('Found Input component:');
      console.log(match[0]);
      console.log('\\n---\\n');
    }
  } else {
    console.log('No Input component found with value={reviewTabMessage}');
    
    // Let's search for any line that contains both 'Input' and 'reviewTabMessage'
    const lines = content.split('\\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes('Input') && line.includes('reviewTabMessage')) {
        console.log(`Line ${i + 1}: ${line.trim()}`);
        
        // Show context
        for (let j = Math.max(0, i - 5); j < Math.min(lines.length, i + 5); j++) {
          const marker = j === i ? '>>> ' : '    ';
          console.log(`${marker}${j + 1}: ${lines[j]}`);
        }
        break;
      }
    }
  }
  
} catch (error) {
  console.error('Error reading file:', error);
}
