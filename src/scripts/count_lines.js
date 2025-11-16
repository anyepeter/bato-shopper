const fs = require('fs');

try {
  const content = fs.readFileSync('/components/chat/ProductCommunityChatRoomFixed.tsx', 'utf8');
  const lines = content.split('\n');
  console.log(`Total lines in the file: ${lines.length}`);
  
  // Let's look for the return statement
  for (let i = lines.length - 200; i < lines.length; i++) {
    if (i >= 0 && lines[i] && lines[i].trim().startsWith('return')) {
      console.log(`Found return statement at line ${i + 1}: ${lines[i].trim()}`);
      
      // Show next 20 lines from return statement
      for (let j = i; j < Math.min(lines.length, i + 20); j++) {
        console.log(`${j + 1}: ${lines[j]}`);
      }
      break;
    }
  }
  
  // Also search for Input components in the last 500 lines
  console.log('\n\nSearching for Input components in last 500 lines...');
  for (let i = Math.max(0, lines.length - 500); i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('<Input') && line.includes('value') && line.includes('reviewTab')) {
      console.log(`Found Input with reviewTab at line ${i + 1}: ${line.trim()}`);
      break;
    }
  }
  
} catch (error) {
  console.error('Error reading file:', error);
}
