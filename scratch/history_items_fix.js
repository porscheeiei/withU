const fs = require('fs');
let html = fs.readFileSync('d:/withu/withU/admin.html', 'utf8');

const regex = /window\.renderHistoryCards = function\(\) \{[\s\S]*?\/\/ Legacy table fallback/m;

const replacement = `window.renderHistoryCards = function() {
    var orders = [];
    if (window.fullData && window.fullData.history) {
        orders = [...window.fullData.history];
    }
    
    var localOrders = [];
    try { localOrders = JSON.parse(localStorage.getItem('withu_completed_orders')||'[]'); } catch(e){}
    
    var existingIds = new Set();
    orders.forEach(o => { if(o.id) existingIds.add(o.id); if(o.orderNo) existingIds.add(o.orderNo); });
    
    // Group local orders that are individual items into bills based on timestamp + table
    var localBills = {};
    localOrders.forEach(o => {
        if (o.id || o.orderNo) {
            if (!existingIds.has(o.id) && !existingIds.has(o.orderNo)) {
                orders.push(o);
                existingIds.add(o.id || o.orderNo);
            }
        } else {
            // Group by timestamp (minute precision) and table
            var tStr = o.timestamp ? o.timestamp.substring(0, 16) : 'unknown'; // Group to the minute
            var key = tStr + '_' + (o.table || 'Takeaway');
            if (!localBills[key]) {
                localBills[key] = {
                    timestamp: o.timestamp,
                    table: o.table,
                    paymentMethod: o.paymentMethod,
                    cart: [],
                    finalTotal: 0
                };
            }
            localBills[key].cart.push(o);
            localBills[key].finalTotal += (o.finalTotal || o.total || ((parseFloat(o.price)||0) * (parseInt(o.qty)||1)));
        }
    });
    
    Object.values(localBills).forEach(bill => orders.push(bill));
    
    orders.sort(function(a,b) { return new Date(b.timestamp)-new Date(a.timestamp); });
    
    // Group by Date
    var grouped = {};
    orders.forEach(o => {
        var dateObj = new Date(o.timestamp);
        if (isNaN(dateObj.getTime())) dateObj = new Date();
        var dateStr = dateObj.toLocaleDateString('th-TH', {day: '2-digit', month: 'short', year: 'numeric'});
        if(!grouped[dateStr]) grouped[dateStr] = [];
        grouped[dateStr].push(o);
    });
    
    var htmlCards = '';
    Object.keys(grouped).forEach(dateStr => {
        htmlCards += '<div style="background:var(--gray-light); padding:10px 16px; margin-top:20px; border-radius:10px; font-weight:800; color:var(--primary); font-size:14px; border-left:4px solid var(--primary);"><i class="fas fa-calendar-day" style="margin-right:8px;"></i>' + dateStr + '</div>';
        htmlCards += '<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap:12px; margin-top:12px;">';
        
        grouped[dateStr].forEach((o, i) => {
            var timeStr = new Date(o.timestamp).toLocaleTimeString('th-TH', {hour: '2-digit', minute: '2-digit'});
            if(timeStr === 'Invalid Date') timeStr = '-';
            var pay = o.paymentMethod==='qr' ? '<span style="color:#3b82f6; font-weight:800; background:rgba(59,130,246,0.1); padding:4px 8px; border-radius:6px; font-size:11px;"><i class="fas fa-qrcode" style="margin-right:4px;"></i> QR</span>' : '<span style="color:#10b981; font-weight:800; background:rgba(16,185,129,0.1); padding:4px 8px; border-radius:6px; font-size:11px;"><i class="fas fa-money-bill" style="margin-right:4px;"></i> CASH</span>';
            var price = '฿' + (o.total||o.finalTotal||0).toLocaleString();
            
            // Build items list
            var itemsHtml = '';
            if (o.cart && Array.isArray(o.cart)) {
                itemsHtml = o.cart.map(item => \`<div style="font-size:13px; color:var(--text); margin-bottom:2px;">&bull; \${item.name} <span style="color:var(--text-muted); font-size:11px; margin-left:4px;">x\${item.qty||1}</span></div>\`).join('');
            } else if (o.items && Array.isArray(o.items)) {
                itemsHtml = o.items.map(item => \`<div style="font-size:13px; color:var(--text); margin-bottom:2px;">&bull; \${item.name||item} <span style="color:var(--text-muted); font-size:11px; margin-left:4px;">x\${item.qty||1}</span></div>\`).join('');
            } else if (o.items && typeof o.items === 'string') {
                itemsHtml = \`<div style="font-size:13px; color:var(--text); white-space:pre-wrap;">\${o.items}</div>\`;
            } else if (o.name) {
                itemsHtml = \`<div style="font-size:13px; color:var(--text); margin-bottom:2px;">&bull; \${o.name} <span style="color:var(--text-muted); font-size:11px; margin-left:4px;">x\${o.qty||1}</span></div>\`;
            }
            
            if (itemsHtml) {
                itemsHtml = \`<div style="margin-top:10px; padding-top:10px; border-top:1px dashed var(--border);">\${itemsHtml}</div>\`;
            }
            
            htmlCards += '<div class="ai-card" style="padding:16px; display:flex; flex-direction:column; border:1px solid var(--border); box-shadow:0 2px 10px rgba(0,0,0,0.02);">';
            
            htmlCards += '<div style="display:flex; justify-content:space-between; align-items:flex-start; width:100%;">';
            htmlCards += '<div>';
            htmlCards += '<div style="font-size:12px; color:var(--text-muted); margin-bottom:6px;"><i class="fas fa-clock" style="margin-right:4px;"></i> ' + timeStr + ' &nbsp;&bull;&nbsp; <span style="font-weight:700; color:var(--text);">' + (o.table||'Takeaway') + '</span></div>';
            htmlCards += '<div style="font-weight:900; font-size:15px; color:var(--text); letter-spacing:-0.5px;">#' + (o.id||o.orderNo||(1000+i)) + '</div>';
            htmlCards += '</div>';
            
            htmlCards += '<div style="text-align:right;">';
            htmlCards += '<div style="color:var(--primary); font-weight:900; font-size:18px; margin-bottom:6px;">' + price + '</div>';
            htmlCards += '<div>' + pay + '</div>';
            htmlCards += '</div>';
            htmlCards += '</div>';
            
            htmlCards += itemsHtml; // Append items list here
            
            htmlCards += '</div>';
        });
        
        htmlCards += '</div>';
    });
    
    if(!orders.length) htmlCards = '<div style="text-align:center; padding:40px; color:var(--text-muted); background:var(--gray-light); border-radius:12px; margin-top:20px; font-weight:700;"><i class="fas fa-history" style="font-size:24px; margin-bottom:10px; display:block; opacity:0.5;"></i>ไม่มีประวัติการขาย</div>';
    
    var listCards = document.getElementById('history-list-cards');
    if(listCards) listCards.innerHTML = htmlCards;

    // Legacy table fallback`;

html = html.replace(regex, replacement);
fs.writeFileSync('d:/withu/withU/admin.html', html);
console.log("Fixed history items logic successfully!");
