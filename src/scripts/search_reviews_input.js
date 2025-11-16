const fs = require('fs');

try {
  const content = fs.readFileSync('/components/chat/ProductCommunityChatRoomFixed.tsx', 'utf8');
  
  // Split into lines for easier navigation
  const lines = content.split('\n');
  
  // Search for Input components in reviews tab context
  let foundMatches = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();
    
    // Look for Input component usage with reviewTabMessage
    if (line.includes('<Input') && (
        line.includes('reviewTabMessage') || 
        line.includes('value={reviewTabMessage}') ||
        (line.includes('ref={reviewTabInputRef}'))
    )) {
      foundMatches.push({
        lineNumber: i + 1,
        content: line.trim(),
        context: {
          before: lines.slice(Math.max(0, i - 5), i).map((l, idx) => `${Math.max(0, i - 5) + idx + 1}: ${l}`),
          after: lines.slice(i + 1, Math.min(lines.length, i + 6)).map((l, idx) => `${i + idx + 2}: ${l}`)
        }
      });
    }
  }
  
  if (foundMatches.length > 0) {
    console.log(`Found ${foundMatches.length} Input component(s) with reviewTabMessage:`);
    foundMatches.forEach((match, index) => {
      console.log(`\n=== Match ${index + 1} ===`);
      console.log(`Line ${match.lineNumber}: ${match.content}`);
      console.log('\nContext (5 lines before):');
      match.context.before.forEach(line => console.log(`  ${line}`));
      console.log(`>>> ${match.lineNumber}: ${match.content}`);
      console.log('Context (5 lines after):');
      match.context.after.forEach(line => console.log(`  ${line}`));
    });
  } else {
    console.log('No Input component found with reviewTabMessage');
    
    // Let's search for any references to reviewTabMessage in render/JSX context
    console.log('\nSearching for any reviewTabMessage usage in JSX...');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes('reviewTabMessage') && (line.includes('<') || line.includes('value='))) {
        console.log(`Line ${i + 1}: ${line.trim()}`);
        
        // Show a bit of context
        for (let j = Math.max(0, i - 3); j < Math.min(lines.length, i + 4); j++) {
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
