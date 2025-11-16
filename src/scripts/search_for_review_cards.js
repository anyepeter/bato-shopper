const fs = require('fs');

const content = fs.readFileSync('/components/chat/ProductCommunityChatRoomFixed.tsx', 'utf8');

// Look for patterns that suggest individual review rendering
const patterns = [
  /review\.userName/g,
  /review\.title/g,
  /review\.content/g,
  /review\.rating/g,
  /review\.helpfulVotes/g,
  /review\.isVerifiedPurchase/g
];

console.log('Searching for review card rendering patterns...\n');

patterns.forEach((pattern, index) => {
  const matches = [];
  let match;
  
  while ((match = pattern.exec(content)) !== null) {
    const lineStart = content.lastIndexOf('\n', match.index);
    const lineEnd = content.indexOf('\n', match.index);
    const lineNumber = content.substring(0, match.index).split('\n').length;
    const line = content.substring(lineStart + 1, lineEnd);
    
    matches.push({
      lineNumber,
      line: line.trim()
    });
  }
  
  if (matches.length > 0) {
    console.log(`Pattern ${pattern.source}:`);
    matches.slice(0, 3).forEach(match => {
      console.log(`  Line ${match.lineNumber}: ${match.line}`);
    });
    console.log('');
  }
});

// Also search for key JSX structures
const jsxPatterns = [
  /<div.*className.*review/gi,
  /key={review/gi,
  /map.*review.*=>/gi
];

console.log('Searching for JSX patterns...\n');

jsxPatterns.forEach((pattern, index) => {
  const match = content.match(pattern);
  if (match) {
    console.log(`JSX Pattern ${index + 1} found: ${match[0]}`);
  }
});
