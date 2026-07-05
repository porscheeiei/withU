const fs = require('fs');
let html = fs.readFileSync('d:/withu/withU/admin.html', 'utf8');

const target = `            try {
                const phoneInput = document.getElementById('p-customer-phone');
                const customerPhone = phoneInput ? phoneInput.value.trim() : "";
                const earnedPoints = Math.floor(pTotal / 50);`;

const replacement = `            try {
                const phoneInput = document.getElementById('p-customer-phone');
                const customerPhone = phoneInput ? phoneInput.value.trim() : "";
                const earnedPoints = Math.floor(pTotal / 50);

                if (window.fullData && window.fullData.orders) {
                    const targetOrders = window.fullData.orders.filter(o => pRows.includes(o.rowNum) || (pTable && o.table === pTable));
                    if (targetOrders.length > 0) {
                        let history = []; try { history = JSON.parse(localStorage.getItem('withu_completed_orders') || '[]'); } catch(e){}
                        targetOrders.forEach(o => {
                            o.timestamp = new Date().toISOString();
                            o.paymentMethod = method === 'เงินสด' ? 'cash' : 'qr';
                            history.push(o);
                        });
                        localStorage.setItem('withu_completed_orders', JSON.stringify(history));
                        if (typeof window.renderHistory === 'function') window.renderHistory();
                    }
                }`;

html = html.replace(target, replacement);
fs.writeFileSync('d:/withu/withU/admin.html', html);
console.log("Replaced finalPay logic successfully!");
