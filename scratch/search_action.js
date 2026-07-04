const fs = require('fs');
const code = fs.readFileSync('d:/withu/withU/admin.html', 'utf8');
const lines = code.split('\n');
lines.forEach((l, i) => {
    if(l.includes('actionCall') && l.includes('onclick=')) console.log((i+1)+': '+l);
});
