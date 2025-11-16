const fs = require('fs');

// Delete extra chat room files
const filesToDelete = [
  '/components/chat/ProductCommunityChatRoomFixedEnhanced.tsx',
  '/components/chat/ProductCommunityChatRoomFixedIntegrated.tsx',
  '/components/chat/ProductCommunityChatRoomFixedWithEnhancedInput.tsx',
  '/components/chat/ProductCommunityChatRoomFixedWithRatings.tsx',
  '/check_current_usage.js',
  '/cleanup_and_verify.js',
  '/cleanup_all_extra_files.js',
  '/verify_enhanced_input_usage.js',
  '/cleanup_all_files.js'
];

console.log('🧹 Cleaning up files...');
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

console.log('✨ Cleanup complete!');
