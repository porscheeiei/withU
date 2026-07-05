const fs = require('fs');
let html = fs.readFileSync('d:/withu/withU/admin.html', 'utf8');

const innerShowSecRegex = /function showSec\(n\)\s*\{\s*\['order-sec',\s*'takeaway-sec',\s*'stock-sec',\s*'report-sec',\s*'points-sec'\]\.forEach[\s\S]*?if \(n === 'report'\)\s*setTimeout\(drawChart,\s*150\);\s*\}/m;

html = html.replace(innerShowSecRegex, '// showSec removed to avoid shadowing global window.showSec');
fs.writeFileSync('d:/withu/withU/admin.html', html);
console.log('Inner showSec removed');
