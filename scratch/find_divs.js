const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf8');

// Simple div counter
let lines = html.split('\n');
let open = 0;
let close = 0;
let mismatchLines = [];

for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let opensInLine = (line.match(/<div\b[^>]*>/g) || []).length;
    let closesInLine = (line.match(/<\/div>/g) || []).length;
    
    open += opensInLine;
    close += closesInLine;
    
    if (close > open) {
        mismatchLines.push({line: i+1, text: line.trim()});
        // reset to avoid cascading
        open = close; 
    }
}

console.log('Extra closing divs found at lines:', mismatchLines);
