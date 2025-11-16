const fs = require('fs');

// 🧹 DELETE ALL EXTRA PRODUCTCOMMUNITY CHAT ROOM FILES
const extraChatFiles = [
  '/components/chat/ProductCommunityChatRoomFixedEnhanced.tsx',
  '/components/chat/ProductCommunityChatRoomFixedIntegrated.tsx',
  '/components/chat/ProductCommunityChatRoomFixedWithEnhancedInput.tsx',
  '/components/chat/ProductCommunityChatRoomFixedWithRatings.tsx'
];

console.log('🧹 Deleting extra ProductCommunityChatRoom files...');
extraChatFiles.forEach(file => {
  try {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log(`✅ Deleted: ${file}`);
    } else {
      console.log(`⚠️  File not found: ${file}`);
    }
  } catch (error) {
    console.error(`❌ Error deleting ${file}:`, error);
  }
});

// 🧹 DELETE ALL TEMPORARY AND SCRIPT FILES
const tempFiles = [
  '/check_current_usage.js',
  '/cleanup_and_verify.js',
  '/cleanup_chat_files.js',
  '/cleanup_extra_files.js',
  '/cleanup_temp_files.js',
  '/count_lines.js',
  '/extract_review_section.js',
  '/find_and_replace_input.js',
  '/find_and_replace_reviews_input.js',
  '/find_mobile_return.js',
  '/find_review_render_location.js',
  '/find_reviews_input_location.js',
  '/find_reviews_tab_input.js',
  '/replace_input_with_enhanced.js',
  '/search_exact_pattern.js',
  '/search_for_cart_buttons.js',
  '/search_for_mobile_tab_content.js',
  '/search_for_review_cards.js',
  '/search_input_pattern.js',
  '/search_review_rendering.js',
  '/search_reviews_input.js',
  '/search_reviews_input_pattern.js',
  '/simple_search_reviewtab.js',
  '/targeted_reviews_fix.js',
  '/temp_check_reviews_tab.md',
  '/temp_find_mobile_reviews.js',
  '/temp_mobile_reviews_search.js',
  '/temp_search_for_reviews_input.js'
];

console.log('\n🧹 Deleting temporary and script files...');
tempFiles.forEach(file => {
  try {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log(`✅ Deleted: ${file}`);
    }
  } catch (error) {
    console.error(`❌ Error deleting ${file}:`, error);
  }
});

console.log('\n✨ Cleanup complete! Only the original ProductCommunityChatRoomFixed.tsx remains.');
