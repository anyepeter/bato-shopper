const fs = require('fs');

try {
  const content = fs.readFileSync('/components/chat/ProductCommunityChatRoomFixed.tsx', 'utf8');
  
  // Search for Input components with 'value={reviewTabMessage}'
  const pattern = /value={reviewTabMessage}/g;
  let match;
  const lines = content.split('\n');
  
  while ((match = pattern.exec(content)) !== null) {
    // Find which line this match is on
    const position = match.index;
    let lineNumber = 0;
    let currentPosition = 0;
    
    for (let i = 0; i < lines.length; i++) {
      if (currentPosition + lines[i].length >= position) {
        lineNumber = i + 1;
        break;
      }
      currentPosition += lines[i].length + 1; // +1 for newline
    }
    
    console.log(`Found 'value={reviewTabMessage}' at line ${lineNumber}`);
    
    // Show context around this line
    for (let j = Math.max(0, lineNumber - 10); j < Math.min(lines.length, lineNumber + 10); j++) {
      const marker = j === lineNumber - 1 ? '>>> ' : '    ';
      console.log(`${marker}${j + 1}: ${lines[j]}`);
    }
  }
  
} catch (error) {
  console.error('Error reading file:', error);
}
