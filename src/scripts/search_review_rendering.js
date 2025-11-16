const fs = require('fs');

const content = fs.readFileSync('/components/chat/ProductCommunityChatRoomFixed.tsx', 'utf8');

// Find where individual reviews are rendered
const reviewRenderingPattern = /review\s*=>/g;
const matches = [];
let match;

while ((match = reviewRenderingPattern.exec(content)) !== null) {
  const lineStart = content.lastIndexOf('\n', match.index);
  const lineEnd = content.indexOf('\n', match.index);
  const lineNumber = content.substring(0, match.index).split('\n').length;
  const line = content.substring(lineStart + 1, lineEnd);
  
  console.log(`Line ${lineNumber}: ${line.trim()}`);
  matches.push({
    lineNumber,
    index: match.index,
    line: line.trim()
  });
}

// Also search for review cards or review items
const reviewCardPattern = /review\.id|review\.title|review\.content|review\.userName/g;
const cardMatches = [];

while ((match = reviewCardPattern.exec(content)) !== null) {
  const lineStart = content.lastIndexOf('\n', match.index);
  const lineEnd = content.indexOf('\n', match.index);
  const lineNumber = content.substring(0, match.index).split('\n').length;
  const line = content.substring(lineStart + 1, lineEnd);
  
  if (!cardMatches.some(m => m.lineNumber === lineNumber)) {
    cardMatches.push({
      lineNumber,
      line: line.trim()
    });
  }
}

console.log('\n=== REVIEW CARD ELEMENTS ===');
cardMatches.slice(0, 10).forEach(match => {
  console.log(`Line ${match.lineNumber}: ${match.line}`);
});

console.log('\n=== SEARCHING FOR REVIEW LISTS ===');
// Look for div elements that might contain review lists
const reviewListPattern = /filteredAndSortedReviews|reviews\.map|{reviews/g;
while ((match = reviewListPattern.exec(content)) !== null) {
  const lineStart = content.lastIndexOf('\n', match.index);
  const lineEnd = content.indexOf('\n', match.index);
  const lineNumber = content.substring(0, match.index).split('\n').length;
  const line = content.substring(lineStart + 1, lineEnd);
  
  console.log(`Line ${lineNumber}: ${line.trim()}`);
}
