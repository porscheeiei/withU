const fs = require('fs');
const html = fs.readFileSync('d:/withu/withU/admin.html', 'utf8');
const scriptMatches = html.match(/<script\b[^>]*>([\s\S]*?)<\/script>/gi);
const s = scriptMatches[5];
const code = s.replace(/<\/?script[^>]*>/gi, '');
const lines = code.split('\n');

// Find lines with deletePoint or await confirm near top
console.log('=== Lines with deletePoint / await confirm (first 50 lines) ===');
lines.slice(0, 50).forEach((l,i) => {
    if(l.includes('deletePoint') || l.includes('await') || l.includes('async function') || l.includes('async function')) {
        console.log((i+1)+': '+l.trim());
    }
});
