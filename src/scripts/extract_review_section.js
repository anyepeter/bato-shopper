const fs = require('fs');

const content = fs.readFileSync('/components/chat/ProductCommunityChatRoomFixed.tsx', 'utf8');

// Find the section with review rendering by looking for common patterns
const reviewCardStart = content.indexOf('review.userName');
const reviewCardEnd = content.indexOf('handleReviewHelpful', reviewCardStart);

if (reviewCardStart !== -1 && reviewCardEnd !== -1) {
  const reviewSection = content.substring(Math.max(0, reviewCardStart - 500), Math.min(content.length, reviewCardEnd + 200));
  
  console.log('Found review rendering section:');
  console.log('====================================');
  console.log(reviewSection);
  console.log('====================================');
} else {
  console.log('Could not find review rendering section');
  console.log('reviewCardStart:', reviewCardStart);
  console.log('reviewCardEnd:', reviewCardEnd);
  
  // Try alternate search
  const altStart = content.indexOf('filteredAndSortedReviews');
  if (altStart !== -1) {
    const altSection = content.substring(altStart, altStart + 1000);
    console.log('\nFound filteredAndSortedReviews section:');
    console.log('====================================');
    console.log(altSection);
    console.log('====================================');
  }
}
