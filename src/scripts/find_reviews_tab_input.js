const fs = require('fs');

try {
  const content = fs.readFileSync('/components/chat/ProductCommunityChatRoomFixed.tsx', 'utf8');
  
  // Look for the reviews TabsContent section and input within it
  let lines = content.split('\n');
  let foundReviewsTabContent = false;
  let reviewsTabStartLine = -1;
  let reviewsTabEndLine = -1;
  
  // Find TabsContent value="reviews"
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('TabsContent') && line.includes('value="reviews"')) {
      foundReviewsTabContent = true;
      reviewsTabStartLine = i;
      console.log(`Found reviews TabsContent at line ${i + 1}: ${line.trim()}`);
      
      // Find the end of this TabsContent (look for the closing tag or next TabsContent)
      let braceCount = 0;
      let inJSX = false;
      
      for (let j = i; j < lines.length; j++) {
        const currentLine = lines[j];
        
        // Count JSX elements to find the end
        if (currentLine.includes('<TabsContent') && j !== i) {
          reviewsTabEndLine = j - 1;
          break;
        }
        if (currentLine.includes('</TabsContent>')) {
          reviewsTabEndLine = j;
          break;
        }
        
        // If we've gone too far (next major section), stop
        if (j > i + 200) {
          reviewsTabEndLine = j;
          break;
        }
      }
      
      // Show the reviews tab content
      console.log(`\nReviews Tab Content (lines ${reviewsTabStartLine + 1} to ${reviewsTabEndLine + 1}):`);
      for (let k = reviewsTabStartLine; k <= Math.min(reviewsTabEndLine, reviewsTabStartLine + 50); k++) {
        if (k < lines.length) {
          // Highlight input-related lines  
          const marker = lines[k].includes('Input') || lines[k].includes('reviewTabMessage') ? '>>> ' : '    ';
          console.log(`${marker}${k + 1}: ${lines[k]}`);
        }
      }
      
      break;
    }
  }
  
  if (!foundReviewsTabContent) {
    console.log('Could not find reviews TabsContent');
    
    // Fallback: search for any Input with reviewTabMessage
    console.log('\nFalling back to search for Input with reviewTabMessage...');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes('Input') && line.includes('reviewTabMessage')) {
        console.log(`Found at line ${i + 1}: ${line.trim()}`);
        
        // Show context
        for (let j = Math.max(0, i - 10); j < Math.min(lines.length, i + 10); j++) {
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
