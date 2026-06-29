const fs = require('fs');
const path = 'd:/withu/withU/delivery.html';
let content = fs.readFileSync(path, 'utf8');

// Keep HEAD, remove the rest of the conflict marker
content = content.replace(/<<<<<<< HEAD\r?\n([\s\S]*?)\r?\n=======\r?\n[\s\S]*?\r?\n>>>>>>>[^\n]*(\r?\n)?/g, '$1\n');

// Also remove the table-overlay completely
content = content.replace(/<div id="table-overlay">[\s\S]*?<\/div>\r?\n<\/div>/, '<!-- table-overlay removed -->');

fs.writeFileSync(path, content, 'utf8');
console.log("Successfully resolved all Git conflicts and removed table-overlay.");
