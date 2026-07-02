const fs = require('fs');
let html = fs.readFileSync('d:/withu/withU/admin.html', 'utf8');
html = html.replace(/orderSec\.parentNode\.insertBefore\(div, orderSec\.nextSibling\);\\n        }\\n    }/g, 'orderSec.parentNode.insertBefore(div, orderSec.nextSibling);\n        }\n    }');
fs.writeFileSync('d:/withu/withU/admin.html', html, 'utf8');
console.log('Fixed literal backslash n!');
