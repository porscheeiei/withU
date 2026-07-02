const fs = require('fs');

let html = fs.readFileSync('admin.html', 'utf8');

// Remove the old injected script blocks if they exist
html = html.replace(/<script id="withu-revamp-script">[\s\S]*?<\/script>/, '');
html = html.replace(/<script id="withu-report-revamp">[\s\S]*?<\/script>/, '');
html = html.replace(/<!-- WITHU V2 Revamp Styles & Scripts -->[\s\S]*?<\/style>/, '');

fs.writeFileSync('admin.html', html, 'utf8');
console.log('Cleaned old patches.');
