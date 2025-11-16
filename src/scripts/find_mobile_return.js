const fs = require('fs');

const content = fs.readFileSync('/components/chat/ProductCommunityChatRoomFixed.tsx', 'utf8');

// Find the mobile return statement
const mobileReturnMatch = content.match(/if\s*\(\s*isMobile\s*\)\s*{[\s\S]*?return[\s\S]*?}\s*}/);

if (mobileReturnMatch) {
  console.log('Found mobile return section:');
  console.log(mobileReturnMatch[0].substring(0, 2000));
  console.log('\n... (truncated for length)');
} else {
  console.log('Mobile return section not found');
  
  // Try alternative patterns
  const patterns = [
    /isMobile.*return/,
    /Mobile Layout/,
    /TabsContent.*reviews/
  ];
  
  patterns.forEach((pattern, index) => {
    const match = content.match(pattern);
    if (match) {
      console.log(`Pattern ${index + 1} found:`, match[0]);
    }
  });
}
