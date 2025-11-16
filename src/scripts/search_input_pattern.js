const fs = require('fs');

try {
  const content = fs.readFileSync('/components/chat/ProductCommunityChatRoomFixed.tsx', 'utf8');
  
  // Find lines containing Input and reviewTabMessage
  const lines = content.split('\n');
  const foundLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Look for Input component with reviewTabMessage 
    if (line.includes('Input') && line.includes('value') && line.includes('reviewTabMessage')) {
      foundLines.push({ lineNumber: i + 1, content: line.trim() });
      console.log(`Found Input with reviewTabMessage at line ${i + 1}:`);
      
      // Show context around this line
      for (let j = Math.max(0, i - 5); j < Math.min(lines.length, i + 10); j++) {
        const marker = j === i ? '>>> ' : '    ';
        console.log(`${marker}${j + 1}: ${lines[j]}`);
      }
      break; // Stop after finding the first one
    }
  }
  
  if (foundLines.length === 0) {
    console.log('No Input component with reviewTabMessage found');
    
    // Let's search for any Input with value=reviewTab
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes('Input') && line.includes('value={reviewTab')) {
        console.log(`Found Input with reviewTab at line ${i + 1}: ${line.trim()}`);
        break;
      }
    }
  }
  
} catch (error) {
  console.error('Error reading file:', error);
}
