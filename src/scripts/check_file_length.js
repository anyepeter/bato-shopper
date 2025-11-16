const fs = require('fs');

try {
  const content = fs.readFileSync('/components/chat/ProductCommunityChatRoomFixed.tsx', 'utf8');
  const lines = content.split('\n');
  
  console.log(`File has ${lines.length} total lines`);
  
  // Look for return statement
  let returnLine = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].trim().startsWith('return (') || lines[i].trim().startsWith('return(')) {
      returnLine = i;
      break;
    }
  }
  
  if (returnLine !== -1) {
    console.log(`Return statement found at line ${returnLine + 1}`);
    console.log(`JSX starts at line ${returnLine + 1} and file ends at line ${lines.length}`);
  }
  
} catch (error) {
  console.error('Error reading file:', error);
}
