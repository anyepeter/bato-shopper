const fs = require('fs');

try {
  let content = fs.readFileSync('/components/chat/ProductCommunityChatRoomFixed.tsx', 'utf8');
  
  console.log('🔧 Attempting to fix the reviews input...');
  
  // Look for the pattern where Input is used with reviewTabMessage in reviews context
  // This pattern is likely in the reviews TabsContent section
  
  // Pattern 1: Look for Input with reviewTabMessage
  const inputWithReviewTabMessagePattern = /<Input\s+[^>]*reviewTabMessage[^>]*>/;
  const match = content.match(inputWithReviewTabMessagePattern);
  
  if (match) {
    console.log('✅ Found Input component with reviewTabMessage:', match[0]);
    
    // Replace the entire Input component block with EnhancedReviewInput
    const replacementPattern = `<EnhancedReviewInput
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
    
    // Find the broader pattern that includes the input and surrounding elements
    const broadPattern = /(<div className="flex items-center gap-2[^>]*>[\s\S]*?<Input[\s\S]*?reviewTabMessage[\s\S]*?<\/Button>\s*<\/div>)/;
    const broadMatch = content.match(broadPattern);
    
    if (broadMatch) {
      console.log('🎯 Found broader pattern to replace...');
      
      const replacement = `<div className="px-4 pb-3">
                      ${replacementPattern}
                    </div>`;
      
      content = content.replace(broadMatch[0], replacement);
      
      // Write the fixed content back
      fs.writeFileSync('/components/chat/ProductCommunityChatRoomFixed.tsx', content);
      console.log('✅ Successfully replaced Input with EnhancedReviewInput!');
      
    } else {
      console.log('⚠️  Could not find broader pattern, trying direct replacement...');
      
      // Try a more targeted replacement
      content = content.replace(inputWithReviewTabMessagePattern, replacementPattern);
      fs.writeFileSync('/components/chat/ProductCommunityChatRoomFixed.tsx', content);
      console.log('✅ Applied direct replacement of Input component!');
    }
    
  } else {
    console.log('❌ Could not find Input component with reviewTabMessage');
    
    // Alternative search patterns
    console.log('🔍 Searching for alternative patterns...');
    
    const shareThoughtsPattern = content.includes('Share your thoughts');
    const reviewTabInputRefPattern = content.includes('reviewTabInputRef');
    
    console.log(`- "Share your thoughts" found: ${shareThoughtsPattern}`);
    console.log(`- reviewTabInputRef found: ${reviewTabInputRefPattern}`);
    
    if (shareThoughtsPattern) {
      // Try to find the Input with the specific placeholder
      const placeholderPattern = /<Input[\s\S]*?placeholder="Share your thoughts[^"]*"[\s\S]*?\/>/;
      const placeholderMatch = content.match(placeholderPattern);
      
      if (placeholderMatch) {
        console.log('✅ Found Input with "Share your thoughts" placeholder');
        console.log('Placeholder match:', placeholderMatch[0]);
        
        const enhancedInputReplacement = `<EnhancedReviewInput
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
        
        content = content.replace(placeholderMatch[0], enhancedInputReplacement);
        fs.writeFileSync('/components/chat/ProductCommunityChatRoomFixed.tsx', content);
        console.log('✅ Successfully replaced Input using placeholder pattern!');
      }
    }
  }
  
  console.log('\n🎉 Fix attempt completed!');
  console.log('The sliding rating prompt should now work when users click the input field.');
  
} catch (error) {
  console.error('❌ Error fixing reviews input:', error);
}
