const fs = require('fs');
const code = fs.readFileSync('d:/withu/withU/admin.html', 'utf8');
const start = code.indexOf('function renderOrders(orders)');
const end = code.indexOf('function generateOrderHtml');
console.log(code.substring(start, end));
