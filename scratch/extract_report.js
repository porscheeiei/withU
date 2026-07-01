const fs = require('fs');
const html = fs.readFileSync('admin.html', 'utf8');

console.log('--- HTML for report-sec ---');
const secRegex = /<div id="report-sec"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/;
const match = html.match(secRegex);
if(match) console.log(match[0].substring(0, 500) + '...');
else console.log('not found');

console.log('\n--- Script for Report ---');
const scriptRegex = /function generateReport\([^)]*\)\s*\{([\s\S]*?)\}/;
const match2 = html.match(scriptRegex);
if(match2) console.log(match2[0]);
else console.log('generateReport not found');
