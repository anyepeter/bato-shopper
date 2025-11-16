const fs = require('fs');

// Clean up extra chat room files
const filesToDelete = [
  '/components/chat/ProductCommunityChatRoomFixedEnhanced.tsx',
  '/components/chat/ProductCommunityChatRoomFixedIntegrated.tsx', 
  '/components/chat/ProductCommunityChatRoomFixedWithEnhancedInput.tsx',
  '/components/chat/ProductCommunityChatRoomFixedWithRatings.tsx'
];

console.log('🧹 Cleaning up extra files...');
filesToDelete.forEach(file => {
  try {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log(`✅ Deleted: ${file}`);
    }
  } catch (error) {
    console.error(`❌ Error deleting ${file}:`, error);
  }
});

// Clean up temporary search files
const tempFiles = [
  '/search_reviews_input.js',
  '/find_reviews_tab_input.js', 
  '/search_reviews_input_pattern.js',
  '/cleanup_chat_files.js',
  '/find_and_replace_reviews_input.js',
  '/targeted_reviews_fix.js',
  '/simple_search_reviewtab.js',
  '/replace_input_with_enhanced.js'
];

console.log('\n🧹 Cleaning up temporary files...');
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

console.log('\n✨ Cleanup complete!');
