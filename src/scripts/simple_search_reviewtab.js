const fs = require('fs');

try {
  const content = fs.readFileSync('/components/chat/ProductCommunityChatRoomFixed.tsx', 'utf8');
  const lines = content.split('\n');
  
  console.log('Searching for lines containing "reviewTabInputRef":');
  
  lines.forEach((line, index) => {
    if (line.includes('reviewTabInputRef')) {
      console.log(`\nLine ${index + 1}: ${line}`);
    }
  });
  
  console.log('\n\nSearching for lines containing "Input" and "reviewTab":');
  
  lines.forEach((line, index) => {
    if (line.includes('Input') && line.includes('reviewTab')) {
      console.log(`\nLine ${index + 1}:`);
      console.log(line);
      
      // Show context around this line
      console.log('\nContext:');
      for (let i = Math.max(0, index - 3); i < Math.min(lines.length, index + 4); i++) {
        const marker = i === index ? '>>> ' : '    ';
        console.log(`${marker}${i + 1}: ${lines[i]}`);
      }
    }
  });
  
} catch (error) {
  console.error('Error reading file:', error);
}
