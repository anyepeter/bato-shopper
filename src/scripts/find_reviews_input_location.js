const fs = require('fs');

try {
  const content = fs.readFileSync('/components/chat/ProductCommunityChatRoomFixed.tsx', 'utf8');
  
  // Search for reviewTabMessage usage in JSX
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Look for any mention of reviewTabMessage in JSX context
    if (line.includes('reviewTabMessage') && (line.includes('value=') || line.includes('onChange='))) {
      console.log(`\nFound reviewTabMessage usage at line ${i + 1}:`);
      
      // Show context around this line
      for (let j = Math.max(0, i - 10); j < Math.min(lines.length, i + 10); j++) {
        const marker = j === i ? '>>> ' : '    ';
        console.log(`${marker}${j + 1}: ${lines[j]}`);
      }
      break;
    }
  }
  
  // Also search for reviews tab input sections
  console.log('\n\nSearching for reviews input sections...');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.includes('reviews') && (line.includes('input') || line.includes('Input'))) {
      console.log(`Line ${i + 1}: ${line.trim()}`);
    }
  }
  
} catch (error) {
  console.error('Error reading file:', error);
}
