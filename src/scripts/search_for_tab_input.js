const fs = require('fs');

try {
  const content = fs.readFileSync('/components/chat/ProductCommunityChatRoomFixed.tsx', 'utf8');
  
  // Search for the pattern where reviewTabMessage is used with Input
  const lines = content.split('\n');
  
  console.log('🔍 Looking for review tab input patterns...\n');
  
  let foundPatterns = [];
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    // Look for patterns that suggest this is the input we need to replace
    if ((trimmedLine.includes('<Input') || trimmedLine.includes('Input')) && 
        (trimmedLine.includes('reviewTabMessage') || 
         trimmedLine.includes('reviewTabInputRef') ||
         trimmedLine.includes('Share your thoughts'))) {
      foundPatterns.push({
        lineNumber: index + 1,
        content: trimmedLine,
        fullLine: line
      });
    }
    
    // Also look for the container div around the input
    if (trimmedLine.includes('flex items-center gap-2') && 
        (index < lines.length - 10)) {
      // Check the next few lines for Input
      for (let i = 1; i <= 10; i++) {
        if (index + i < lines.length) {
          const nextLine = lines[index + i].trim();
          if (nextLine.includes('<Input') && nextLine.includes('reviewTabMessage')) {
            foundPatterns.push({
              lineNumber: index + 1,
              content: trimmedLine,
              fullLine: line,
              context: 'Container div for input'
            });
            break;
          }
        }
      }
    }
  });
  
  console.log('📍 Found these patterns that need attention:');
  foundPatterns.forEach(pattern => {
    console.log(`Line ${pattern.lineNumber}${pattern.context ? ' (' + pattern.context + ')' : ''}: ${pattern.content}`);
  });
  
  // Also search for the specific fragment we expect
  console.log('\n🔍 Searching for exact fragments...');
  
  const inputRefPattern = content.includes('reviewTabInputRef');
  const reviewTabMessagePattern = content.includes('reviewTabMessage');
  const shareThoughtsPattern = content.includes('Share your thoughts');
  
  console.log(`reviewTabInputRef found: ${inputRefPattern}`);
  console.log(`reviewTabMessage found: ${reviewTabMessagePattern}`);
  console.log(`"Share your thoughts" found: ${shareThoughtsPattern}`);
  
} catch (error) {
  console.error('Error reading file:', error);
}
