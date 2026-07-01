const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf8');

const match = html.match(/<div id="manual-order-modal"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*(?=<\/?div)/);
if(match) console.log(match[0].substring(0, 1000) + '...');
else console.log('manual-order-modal not found');
