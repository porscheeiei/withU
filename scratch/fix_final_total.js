const fs = require('fs');
let html = fs.readFileSync('d:/withu/withU/admin.html', 'utf8');

const target = `                        targetOrders.forEach(o => {
                            o.timestamp = new Date().toISOString();
                            o.paymentMethod = method === 'เงินสด' ? 'cash' : 'qr';
                            history.push(o);
                        });`;

const replacement = `                        targetOrders.forEach(o => {
                            o.timestamp = new Date().toISOString();
                            o.paymentMethod = method === 'เงินสด' ? 'cash' : 'qr';
                            o.finalTotal = (parseFloat(o.price) || 0) * (parseInt(o.qty) || 1);
                            history.push(o);
                        });`;

html = html.replace(target, replacement);
fs.writeFileSync('d:/withu/withU/admin.html', html);
console.log("Added finalTotal calculation to finalPay!");
