const fs = require('fs');

try {
  let content = fs.readFileSync('/components/chat/ProductCommunityChatRoomFixed.tsx', 'utf8');
  
  console.log('🔧 Starting comprehensive input fix...');
  
  // Multiple strategies to find and replace the Input component
  
  // Strategy 1: Find Input component with specific props
  const patterns = [
    // Pattern for Input with reviewTabMessage and specific styling
    {
      search: /<Input\s+ref=\{reviewTabInputRef\}[\s\S]*?className="[^"]*"[\s\S]*?\/>/,
      name: 'Input with reviewTabInputRef'
    },
    // Pattern for Input with placeholder containing "Share your thoughts"
    {
      search: /<Input[\s\S]*?placeholder="Share your thoughts[^"]*"[\s\S]*?\/>/,
      name: 'Input with Share your thoughts placeholder'
    },
    // Pattern for Input with reviewTabMessage value
    {
      search: /<Input[\s\S]*?value=\{reviewTabMessage\}[\s\S]*?\/>/,
      name: 'Input with reviewTabMessage value'
    }
  ];
  
  let foundPattern = null;
  let matchedContent = null;
  
  for (const pattern of patterns) {
    const match = content.match(pattern.search);
    if (match) {
      console.log(`✅ Found pattern: ${pattern.name}`);
      console.log(`Match: ${match[0].substring(0, 100)}...`);
      foundPattern = pattern;
      matchedContent = match[0];
      break;
    }
  }
  
  if (foundPattern && matchedContent) {
    console.log('🎯 Replacing with EnhancedReviewInput...');
    
    const replacement = `<EnhancedReviewInput
                        value={reviewTabMessage}
                        onChange={setReviewTabMessage}
                        onSend={handleSendReviewTabMessage}
                        onEmojiClick={handleEmojiButtonClick}
                        onKeyPress={handleKeyPress}
                        placeholder="Share your thoughts about this product..."
                        productName={product.name}
                        isMobile={isMobile}
                        inputRef={reviewTabInputRef}
                        hasSelectedRating={hasSelectedRating}
                        preSubmissionRating={preSubmissionRating}
                        onRatingSelect={handlePreSubmissionRatingSelect}
                        showEmojiPicker={showEmojiPicker}
                      />`;
    
    // Replace the matched input
    content = content.replace(matchedContent, replacement);
    
    // Also need to look for and replace the surrounding div structure
    // Look for the container div with flex items-center gap-2
    const containerPattern = /<div className="flex items-center gap-2[^>]*>[\s\S]*?<EnhancedReviewInput[\s\S]*?\/>\s*[\s\S]*?<\/div>/;
    const containerMatch = content.match(containerPattern);
    
    if (containerMatch) {
      console.log('🔧 Also updating container structure...');
      const newContainer = `<div className="px-4 pb-3">
                      <EnhancedReviewInput
                        value={reviewTabMessage}
                        onChange={setReviewTabMessage}
                        onSend={handleSendReviewTabMessage}
                        onEmojiClick={handleEmojiButtonClick}
                        onKeyPress={handleKeyPress}
                        placeholder="Share your thoughts about this product..."
                        productName={product.name}
                        isMobile={isMobile}
                        inputRef={reviewTabInputRef}
                        hasSelectedRating={hasSelectedRating}
                        preSubmissionRating={preSubmissionRating}
                        onRatingSelect={handlePreSubmissionRatingSelect}
                        showEmojiPicker={showEmojiPicker}
                      />
                    </div>`;
      
      content = content.replace(containerMatch[0], newContainer);
    }
    
    // Write the fixed content back
    fs.writeFileSync('/components/chat/ProductCommunityChatRoomFixed.tsx', content);
    console.log('✅ Successfully applied comprehensive fix!');
    
    // Verify the changes
    const updatedContent = fs.readFileSync('/components/chat/ProductCommunityChatRoomFixed.tsx', 'utf8');
    const hasEnhancedInput = updatedContent.includes('<EnhancedReviewInput');
    const hasOldInput = updatedContent.includes('<Input') && updatedContent.includes('reviewTabMessage');
    
    console.log(`\n📊 VERIFICATION:`);
    console.log(`✅ EnhancedReviewInput present: ${hasEnhancedInput}`);
    console.log(`❌ Old Input with reviewTabMessage: ${hasOldInput}`);
    
    if (hasEnhancedInput && !hasOldInput) {
      console.log('\n🎉 SUCCESS! The sliding rating prompt should now work perfectly!');
      console.log('When users tap the input field on mobile, they will see the rating prompt.');
    } else if (hasEnhancedInput && hasOldInput) {
      console.log('\n⚠️  PARTIAL SUCCESS: EnhancedReviewInput added but old Input still exists.');
      console.log('You may need to manually remove any remaining Input components.');
    }
    
  } else {
    console.log('❌ Could not find any Input patterns to replace');
    console.log('The file might already be using EnhancedReviewInput or have a different structure.');
    
    // Check if EnhancedReviewInput is already being used
    const hasEnhancedInput = content.includes('<EnhancedReviewInput');
    console.log(`EnhancedReviewInput already present: ${hasEnhancedInput}`);
    
    if (hasEnhancedInput) {
      console.log('✅ The file already uses EnhancedReviewInput. The functionality should work!');
    }
  }
  
} catch (error) {
  console.error('❌ Error in comprehensive fix:', error);
}
