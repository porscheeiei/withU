const fs = require('fs');
const html = fs.readFileSync('admin.html', 'utf8');
const regex = /localStorage\.getItem\(['"]([^'"]+)['"]\)/g;
let match;
const keys = new Set();
while ((match = regex.exec(html)) !== null) {
    keys.add(match[1]);
}
console.log('localStorage keys accessed in admin.html:');
console.log(Array.from(keys));
