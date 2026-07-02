const fs = require('fs');
const html = fs.readFileSync('d:/withu/withU/admin.html', 'utf8');
const match = html.match(/<script id="withu-v3-system">([\s\S]*?)<\/script>/);
const code = match[1];
const lines = code.split('\n');
for(let i=85; i<=100; i++) {
    console.log(i + ': ' + lines[i]);
}
