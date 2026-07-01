const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Find all onclick attributes
const regex = /onclick="([^"]+)"/g;
let match;
const clicks = new Set();
while ((match = regex.exec(html)) !== null) {
    clicks.add(match[1]);
}
console.log('--- ONCLICK HANDLERS in index.html ---');
console.log(Array.from(clicks));

console.log('--- SEARCHING FOR "QR" or "pay" or "cart" ---');
const lines = html.split('\n');
lines.forEach((line, i) => {
    if (line.toLowerCase().includes('cart') || line.toLowerCase().includes('pay') || line.toLowerCase().includes('qr')) {
        console.log(`Line ${i+1}: ${line.trim()}`);
    }
});
