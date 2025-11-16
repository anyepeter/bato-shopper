const fs = require('fs');

console.log('🔧 Starting direct input replacement...');

try {
  let content = fs.readFileSync('/components/chat/ProductCommunityChatRoomFixed.tsx', 'utf8');
  
  // First check if the file already uses EnhancedReviewInput correctly
  const hasEnhancedReviewInput = content.includes('<EnhancedReviewInput');
  const hasInputWithReviewTabMessage = content.includes('<Input') && content.includes('reviewTabMessage');
  
  console.log(`EnhancedReviewInput found: ${hasEnhancedReviewInput}`);
  console.log(`Input with reviewTabMessage found: ${hasInputWithReviewTabMessage}`);
  
  if (hasInputWithReviewTabMessage && !hasEnhancedReviewInput) {
    console.log('🎯 Need to replace Input with EnhancedReviewInput');
    
    // Look for the specific pattern and replace it
    // This is a more aggressive replacement that should work
    const inputPattern = /<Input[\s\S]*?ref=\{reviewTabInputRef\}[\s\S]*?\/>/;
    const match = content.match(inputPattern);
    
    if (match) {
      console.log('✅ Found Input with reviewTabInputRef, replacing...');
      
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
      
      content = content.replace(match[0], replacement);
      
      fs.writeFileSync('/components/chat/ProductCommunityChatRoomFixed.tsx', content);
      console.log('✅ Successfully replaced Input with EnhancedReviewInput!');
      
    } else {
      console.log('⚠️  Could not find Input with reviewTabInputRef pattern');
      
      // Try alternative patterns
      const shareThoughtsPattern = /<Input[\s\S]*?placeholder="Share your thoughts[\s\S]*?"[\s\S]*?\/>/;
      const shareMatch = content.match(shareThoughtsPattern);
      
      if (shareMatch) {
        console.log('✅ Found Input with "Share your thoughts" placeholder, replacing...');
        
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
        
        content = content.replace(shareMatch[0], replacement);
        fs.writeFileSync('/components/chat/ProductCommunityChatRoomFixed.tsx', content);
        console.log('✅ Successfully replaced Input using placeholder pattern!');
      }
    }
    
  } else if (hasEnhancedReviewInput) {
    console.log('✅ File already uses EnhancedReviewInput. The feature should work!');
  } else {
    console.log('⚠️  No obvious Input patterns found to replace');
  }
  
  // Final verification
  const updatedContent = fs.readFileSync('/components/chat/ProductCommunityChatRoomFixed.tsx', 'utf8');
  const finalHasEnhanced = updatedContent.includes('<EnhancedReviewInput');
  const finalHasInput = updatedContent.includes('<Input') && updatedContent.includes('reviewTabMessage');
  
  console.log('\\n📊 FINAL STATUS:');
  console.log(`✅ EnhancedReviewInput present: ${finalHasEnhanced}`);
  console.log(`❌ Input with reviewTabMessage still present: ${finalHasInput}`);
  
  if (finalHasEnhanced && !finalHasInput) {
    console.log('\\n🎉 SUCCESS! The sliding rating prompt should now work!');
    console.log('When users tap the input field, they will see the rating prompt slide up.');
  }
  
} catch (error) {
  console.error('❌ Error in direct replacement:', error);
}
