const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf8');

// Fix: use escaped double quotes for onclick in JS string concatenation
html = html.replace(
    `onclick="switchReportTab(&quot;dashboard&quot;)"`,
    `onclick=\\"switchReportTab('dashboard')\\"`
);
html = html.replace(
    `onclick="switchReportTab(&quot;history&quot;)"`,
    `onclick=\\"switchReportTab('history')\\"`
);

fs.writeFileSync('admin.html', html, 'utf8');
console.log('Fixed onclick quotes with escaped double quotes.');
