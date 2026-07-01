const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf8');

// Revert main text color to original, keep accent blue
html = html.replace('--text-main: #1e3a8a; /* Blue accent */', '--text-main: #000000;');
html = html.replace('.btn-black { background: var(--text-main);', '.btn-black { background: #000000;');
html = html.replace('.btn-black:hover { background: var(--text-accent);', '.btn-black:hover { background: #3b82f6;'); // Blue hover

// Make chart blue
html = html.replace(/borderColor:\s*['"]#000['"]/g, 'borderColor: "#3b82f6"');
html = html.replace(/backgroundColor:\s*['"]rgba\(0,0,0,0.1\)['"]/g, 'backgroundColor: "rgba(59,130,246,0.2)"');

fs.writeFileSync('admin.html', html, 'utf8');
console.log('Adjusted blue theme');
