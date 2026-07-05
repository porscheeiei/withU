const fs = require('fs');
const lines = fs.readFileSync('d:/withu/withU/admin.html', 'utf8').split('\n');
lines.forEach((l,i)=>{
    if(l.includes('settings-sec') || (l.includes('settings') && (l.includes('id=') || l.includes('display')))) {
        console.log((i+1)+': '+l.trim().substring(0,120));
    }
});
