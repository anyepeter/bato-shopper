const fs = require('fs');

// List of extra files I created that should be deleted
const filesToDelete = [
  '/components/chat/ProductCommunityChatRoomFixedIntegrated.tsx',
  '/components/chat/ProductCommunityChatRoomFixedWithEnhancedInput.tsx',
  '/temp_rating_prompt_fix.tsx'
];

filesToDelete.forEach(file => {
  try {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log(`Deleted: ${file}`);
    } else {
      console.log(`File not found: ${file}`);
    }
  } catch (error) {
    console.error(`Error deleting ${file}:`, error);
  }
});

console.log('Cleanup complete!');
