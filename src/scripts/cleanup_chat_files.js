const fs = require('fs');

// List of extra files that should be deleted
const filesToDelete = [
  '/components/chat/ProductCommunityChatRoomFixedEnhanced.tsx',
  '/components/chat/ProductCommunityChatRoomFixedIntegrated.tsx', 
  '/components/chat/ProductCommunityChatRoomFixedWithEnhancedInput.tsx',
  '/components/chat/ProductCommunityChatRoomFixedWithRatings.tsx'
];

filesToDelete.forEach(file => {
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

console.log('\n🧹 Cleanup complete!');
