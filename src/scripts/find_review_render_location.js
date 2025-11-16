const fs = require('fs');

const content = fs.readFileSync('/components/chat/ProductCommunityChatRoomFixed.tsx', 'utf8');
const lines = content.split('\n');

let foundReviewMapping = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.includes('filteredAndSortedReviews.map') || line.includes('filteredAndSortedReviews.length')) {
    console.log(`\n=== FOUND REVIEWS USAGE AT LINE ${i + 1} ===`);
    
    // Show context around this line
    const startContext = Math.max(0, i - 10);
    const endContext = Math.min(lines.length - 1, i + 30);
    
    for (let j = startContext; j <= endContext; j++) {
      const marker = j === i ? '>>> ' : '    ';
      console.log(`${marker}${j + 1}: ${lines[j]}`);
    }
    
    foundReviewMapping = true;
    console.log('\n=== END CONTEXT ===\n');
  }
}

if (!foundReviewMapping) {
  console.log('No review mapping found. Searching for related terms...');
  
  const searchTerms = ['review.id', 'review.title', 'review.content', 'review.userName', 'review.rating'];
  
  searchTerms.forEach(term => {
    const lineNumbers = [];
    lines.forEach((line, index) => {
      if (line.includes(term)) {
        lineNumbers.push(index + 1);
      }
    });
    
    if (lineNumbers.length > 0) {
      console.log(`Term "${term}" found on lines: ${lineNumbers.slice(0, 5).join(', ')}${lineNumbers.length > 5 ? '...' : ''}`);
    }
  });
}
