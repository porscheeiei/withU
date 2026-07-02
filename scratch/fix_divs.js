const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf8');

let lines = html.split('\n');
// We know from earlier that lines 671 and 672 (index 670, 671) are `</div>` that cause mismatch.
// Let's remove any `</div>` that causes `close > open`.

let open = 0;
let close = 0;

for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let opensInLine = (line.match(/<div\b[^>]*>/g) || []).length;
    let closesInLine = (line.match(/<\/div>/g) || []).length;
    
    open += opensInLine;
    close += closesInLine;
    
    if (close > open) {
        // We found an extra closing div. We will remove ONE closing div from this line.
        lines[i] = line.replace(/<\/div>/, '<!-- REMOVED EXTRA DIV -->');
        close--;
    }
}

fs.writeFileSync('admin.html', lines.join('\n'), 'utf8');
console.log('Fixed div mismatches.');
