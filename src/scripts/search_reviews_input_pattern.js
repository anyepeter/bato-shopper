const fs = require('fs');

try {
  const content = fs.readFileSync('/components/chat/ProductCommunityChatRoomFixed.tsx', 'utf8');
  
  // Search for the specific pattern we need to replace
  const patterns = [
    /value={reviewTabMessage}/g,
    /ref={reviewTabInputRef}/g,
    /<Input[^>]*value={reviewTabMessage}[^>]*>/g,
    /<Input[^>]*ref={reviewTabInputRef}[^>]*>/g
  ];
  
  patterns.forEach((pattern, index) => {
    const matches = [...content.matchAll(pattern)];
    if (matches.length > 0) {
      console.log(`\n=== Pattern ${index + 1}: ${pattern.source} ===`);
      matches.forEach(match => {
        // Find the line number
        const beforeMatch = content.substring(0, match.index);
        const lineNumber = beforeMatch.split('\n').length;
        
        console.log(`Found at line ${lineNumber}: ${match[0]}`);
        
        // Get the full line content
        const lines = content.split('\n');
        const fullLine = lines[lineNumber - 1];
        console.log(`Full line: ${fullLine.trim()}`);
        
        // Show context
        console.log('Context:');
        for (let i = Math.max(0, lineNumber - 6); i < Math.min(lines.length, lineNumber + 5); i++) {
          const marker = i === lineNumber - 1 ? '>>> ' : '    ';
          console.log(`${marker}${i + 1}: ${lines[i]}`);
        }
      });
    }
  });
  
} catch (error) {
  console.error('Error reading file:', error);
}
