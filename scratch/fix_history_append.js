const fs = require('fs');
let html = fs.readFileSync('d:/withu/withU/admin.html', 'utf8');

const regex = /const earnedPoints = Math\.floor\(pTotal \/ 50\);\s*await fetch\(API_URL, \{/;

const replacement = `const earnedPoints = Math.floor(pTotal / 50);

                if (window.fullData && window.fullData.orders) {
                    const targetOrders = window.fullData.orders.filter(o => pRows.includes(o.rowNum) || (pTable && o.table === pTable));
                    if (targetOrders.length > 0) {
                        let history = []; try { history = JSON.parse(localStorage.getItem('withu_completed_orders') || '[]'); } catch(e){}
                        targetOrders.forEach(o => {
                            o.timestamp = new Date().toISOString();
                            o.paymentMethod = method === 'เงินสด' ? 'cash' : 'qr';
                            o.finalTotal = (parseFloat(o.price) || 0) * (parseInt(o.qty) || 1);
                            history.push(o);
                        });
                        localStorage.setItem('withu_completed_orders', JSON.stringify(history));
                        if (typeof window.renderHistory === 'function') window.renderHistory();
                    }
                }

                await fetch(API_URL, {`;

html = html.replace(regex, replacement);
fs.writeFileSync('d:/withu/withU/admin.html', html);
console.log("Replaced successfully via regex!");
