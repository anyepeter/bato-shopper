const fs = require('fs');

try {
  const content = fs.readFileSync('/components/chat/ProductCommunityChatRoomFixed.tsx', 'utf8');
  const lines = content.split('\n');
  
  console.log('🔍 Searching for Input component usage in reviews context...\n');
  
  let foundInputs = [];
  let inReviewsTabContent = false;
  let tabContentLevel = 0;
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    // Track when we're inside a TabsContent with value="reviews"
    if (trimmedLine.includes('<TabsContent') && trimmedLine.includes('value="reviews"')) {
      inReviewsTabContent = true;
      tabContentLevel = 1;
      console.log(`Found Reviews TabsContent at line ${index + 1}: ${trimmedLine}`);
    }
    
    // Track nested components
    if (inReviewsTabContent) {
      if (trimmedLine.includes('<') && !trimmedLine.includes('</')) {
        tabContentLevel++;
      }
      if (trimmedLine.includes('</TabsContent>')) {
        tabContentLevel--;
        if (tabContentLevel <= 0) {
          inReviewsTabContent = false;
        }
      }
    }
    
    // Look for Input components while in reviews context
    if (inReviewsTabContent && trimmedLine.includes('<Input')) {
      foundInputs.push({
        lineNumber: index + 1,
        content: trimmedLine,
        fullLine: line
      });
      console.log(`❌ Found Input in reviews context at line ${index + 1}: ${trimmedLine}`);
    }
    
    // Also check for EnhancedReviewInput usage
    if (inReviewsTabContent && trimmedLine.includes('<EnhancedReviewInput')) {
      console.log(`✅ Found EnhancedReviewInput at line ${index + 1}: ${trimmedLine}`);
    }
    
    // Check for reviewTabMessage usage (should be in the input context)
    if (trimmedLine.includes('reviewTabMessage') && (trimmedLine.includes('Input') || trimmedLine.includes('value='))) {
      console.log(`📍 Found reviewTabMessage usage at line ${index + 1}: ${trimmedLine}`);
    }
  });
  
  console.log(`\n📊 SUMMARY:`);
  console.log(`Found ${foundInputs.length} Input components in reviews context`);
  
  if (foundInputs.length > 0) {
    console.log('\n🎯 NEED TO REPLACE THESE INPUTS WITH EnhancedReviewInput:');
    foundInputs.forEach(input => {
      console.log(`Line ${input.lineNumber}: ${input.content}`);
    });
  } else {
    console.log('✅ No Input components found in reviews context - might already be using EnhancedReviewInput');
  }
  
} catch (error) {
  console.error('Error reading file:', error);
}
