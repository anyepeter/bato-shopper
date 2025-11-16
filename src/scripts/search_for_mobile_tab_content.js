const fs = require('fs');

try {
  const content = fs.readFileSync('/components/chat/ProductCommunityChatRoomFixed.tsx', 'utf8');
  const lines = content.split('\n');
  
  let foundMobileSection = false;
  let inReviewsTabContent = false;
  let bracketCount = 0;
  let startLine = -1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Look for mobile section
    if (line.includes('if (isMobile)') || (line.includes('isMobile') && line.includes('return'))) {
      console.log(`Found mobile section at line ${i + 1}: ${line.trim()}`);
      foundMobileSection = true;
    }
    
    // Look for TabsContent with reviews value
    if (foundMobileSection && line.includes('TabsContent') && line.includes('reviews')) {
      console.log(`Found reviews TabsContent at line ${i + 1}: ${line.trim()}`);
      inReviewsTabContent = true;
      startLine = i;
      bracketCount = 0;
    }
    
    // If we're in the reviews tab content, track brackets and show content
    if (inReviewsTabContent) {
      // Count opening and closing brackets to find the end of TabsContent
      const openBrackets = (line.match(/{/g) || []).length;
      const closeBrackets = (line.match(/}/g) || []).length;
      bracketCount += openBrackets - closeBrackets;
      
      console.log(`Line ${i + 1} (bracket depth: ${bracketCount}): ${line.trim()}`);
      
      // If we've closed all brackets and hit TabsContent closing, we're done
      if (bracketCount <= 0 && i > startLine && line.includes('TabsContent>')) {
        console.log(`Reviews TabsContent ends at line ${i + 1}`);
        break;
      }
      
      // Safety break after showing reasonable amount
      if (i - startLine > 50) {
        console.log('... truncated for length ...');
        break;
      }
    }
  }

} catch (error) {
  console.error('Error:', error.message);
}
