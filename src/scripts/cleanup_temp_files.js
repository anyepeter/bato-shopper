const fs = require('fs');

const tempFiles = [
  '/temp_mobile_reviews_search.js',
  '/search_review_rendering.js',
  '/temp_find_mobile_reviews.js',
  '/search_for_mobile_tab_content.js',
  '/find_mobile_return.js',
  '/find_review_render_location.js',
  '/search_for_review_cards.js',
  '/extract_review_section.js',
  '/components/chat/ProductCommunityChatRoomFixedWithRatings.tsx'
];

tempFiles.forEach(file => {
  try {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log(`Deleted: ${file}`);
    }
  } catch (error) {
    console.log(`Could not delete ${file}: ${error.message}`);
  }
});

console.log('Cleanup complete.');
