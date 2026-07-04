const fs = require('fs');
const lines = fs.readFileSync('d:/withu/withU/admin.html', 'utf8').split('\n');
lines.forEach((l, i) => {
    if(l.includes('points') && l.includes('function')) console.log((i+1)+': '+l);
});
