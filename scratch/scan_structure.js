const fs = require('fs');
const html = fs.readFileSync('d:/withu/withU/admin.html', 'utf8');
const lines = html.split('\n');
console.log('Total lines:', lines.length);
const keywords = ['order-sec','takeaway-sec','stock-sec','report-sec','points-sec','op-bar','top-nav','sidebar','pay-modal','manual-order-modal','att-modal','toast-styles','map-section','tab-btn','showSec'];
lines.forEach((l,i) => {
    for(const kw of keywords) {
        if(l.includes(kw) && (l.includes('id=') || l.includes('class=') || l.includes('function'))) {
            console.log((i+1)+': ['+kw+'] '+l.trim().substring(0,90));
            break;
        }
    }
});
