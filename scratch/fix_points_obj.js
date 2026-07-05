const fs = require('fs');
let html = fs.readFileSync('d:/withu/withU/admin.html', 'utf8');

const target = `points: data[phone].points || 0`;
const replacement = `points: (typeof data[phone].points === 'object' && data[phone].points !== null ? data[phone].points.points : data[phone].points) || 0`;

html = html.replace(target, replacement);

fs.writeFileSync('d:/withu/withU/admin.html', html, 'utf8');
console.log('Fixed object in points bug');
