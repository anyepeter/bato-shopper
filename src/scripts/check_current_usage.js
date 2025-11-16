const fs = require('fs');

try {
  const content = fs.readFileSync('/components/chat/ProductCommunityChatRoomFixed.tsx', 'utf8');
  
  console.log('🔍 Checking if EnhancedReviewInput is already used...');
  
  if (content.includes('<EnhancedReviewInput')) {
    console.log('✅ EnhancedReviewInput is already being used in the file!');
    
    // Find where it's used
    const lines = content.split('\n');
    lines.forEach((line, index) => {
      if (line.includes('EnhancedReviewInput')) {
        console.log(`Line ${index + 1}: ${line.trim()}`);
      }
    });
  } else {
    console.log('❌ EnhancedReviewInput is NOT being used in the file');
    
    // Check what Input components exist
    console.log('\n🔍 Looking for Input components...');
    const lines = content.split('\n');
    lines.forEach((line, index) => {
      if (line.includes('<Input') && !line.includes('//')) {
        console.log(`Line ${index + 1}: ${line.trim()}`);
        
        // Show some context
        if (line.includes('reviewTab') || lines[index-1]?.includes('reviewTab') || lines[index+1]?.includes('reviewTab')) {
          console.log('  ^ This might be the reviews tab input');
        }
      }
    });
  }
  
  // Also check for reviewTabInputRef usage
  console.log('\n🔍 Looking for reviewTabInputRef usage...');
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    if (line.includes('reviewTabInputRef') && line.includes('<')) {
      console.log(`Line ${index + 1}: ${line.trim()}`);
    }
  });
  
} catch (error) {
  console.error('Error reading file:', error);
}
