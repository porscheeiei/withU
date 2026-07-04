const fs = require('fs');
let html = fs.readFileSync('d:/withu/withU/admin.html', 'utf8');

// 1. Update loadPoints to use fullData.points
const newLoadPoints = `window.loadPoints = function() {
    var list = document.getElementById('points-list');
    if (!list) return;
    
    // Read from API data (fullData.points) instead of localStorage
    var arr = [];
    if (window.fullData && window.fullData.points) {
        arr = window.fullData.points;
    }
    
    arr.sort((a,b) => b.points - a.points);
    if (!arr.length) {
        list.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:30px; color:var(--text-muted);">ไม่มีข้อมูลสมาชิก</td></tr>';
        return;
    }
    list.innerHTML = arr.map(m => 
        '<tr style="border-bottom:1px solid var(--border);">' +
        '<td style="padding:15px 20px; font-weight:700;">' + m.phone + '</td>' +
        '<td style="padding:15px 20px;">' + (m.name || '-') + '</td>' +
        '<td style="padding:15px 20px; font-weight:900; color:#f59e0b;"><i class="fas fa-star" style="margin-right:6px; font-size:12px;"></i>' + m.points + '</td>' +
        '<td style="padding:15px 20px; text-align:center;"><button onclick="window.editPointData(\\'' + m.phone + '\\', \\'' + (m.name||'') + '\\', ' + m.points + ')" style="background:var(--slate); border:1px solid var(--border); padding:6px 12px; border-radius:6px; cursor:pointer; font-weight:600; font-size:12px;"><i class="fas fa-edit"></i> แก้ไข</button></td>' +
        '</tr>'
    ).join('');
};`;

html = html.replace(/window\.loadPoints = function\(\) \{[\s\S]*?\}\s*;/g, newLoadPoints);


// 2. Update savePointData to send to API
const newSavePoints = `window.savePointData = function() {
    var phone = (document.getElementById('pts-phone') || {}).value;
    if(!phone || !phone.trim()) { if(typeof showToast==='function') showToast('Enter phone number','call'); return; }
    phone = phone.trim();
    
    var points = parseInt((document.getElementById('pts-val')||{}).value)||0;
    var name = ((document.getElementById('pts-name')||{}).value||'').trim();
    
    document.getElementById('pts-phone').value = '';
    document.getElementById('pts-name').value = '';
    document.getElementById('pts-val').value = '0';
    
    // SEND TO GOOGLE SHEETS API
    if (typeof actionCall === 'function') {
        actionCall('updatePoints', {phone: phone, name: name, points: points});
    }
    
    if(typeof showToast==='function') showToast('กำลังบันทึกคะแนนไปที่ชีต...','new');
};`;

html = html.replace(/window\.savePointData = function\(\) \{[\s\S]*?if\(typeof showToast==='function'\) showToast[^\n]*\n\};/g, newSavePoints);


// 3. Update renderHistory to use fullData.history
const newRenderHistory = `window.renderHistory = function() {
    var orders = [];
    // USE CLOUD HISTORY FROM GOOGLE SHEETS
    if (window.fullData && window.fullData.history) {
        orders = window.fullData.history;
    } else {
        // Fallback to local if no cloud history yet
        var dataStr = localStorage.getItem('withu_completed_orders')||'[]';
        try { orders = JSON.parse(dataStr); } catch(e){}
    }
    
    orders.sort(function(a,b) { return new Date(b.timestamp)-new Date(a.timestamp); });
    var list = document.getElementById('history-list');
    if(!list) return;
    if(!orders.length) { list.innerHTML='<tr><td colspan="5" style="text-align:center; padding:30px; color:var(--text-muted);">No history</td></tr>'; return; }
    list.innerHTML = orders.map(function(o,i) {
        var date = new Date(o.timestamp).toLocaleString('th-TH');
        var pay = o.paymentMethod==='qr' ? '<span style="color:#3b82f6; font-weight:700;"><i class="fas fa-qrcode" style="margin-right:4px;"></i>QR</span>' : '<span style="color:#f59e0b; font-weight:700;"><i class="fas fa-money-bill" style="margin-right:4px;"></i>CASH</span>';
        return '<tr style="border-bottom:1px solid var(--border);"><td style="font-size:12px; color:var(--text-muted); padding:13px;">' + date + '</td><td style="font-weight:800;">#' + (o.id||o.orderNo||(1000+i)) + '</td><td><span style="background:var(--slate); padding:4px 10px; border-radius:6px; font-size:11px; font-weight:700;">' + (o.table||'Takeaway') + '</span></td><td style="color:#10b981; font-weight:800;">\u0e3f' + (o.total||o.finalTotal||0).toLocaleString() + '</td><td>' + pay + '</td></tr>';
    }).join('');
};`;

html = html.replace(/window\.renderHistory = function\(\) \{[\s\S]*?\}\)\.join\(''\);\n\};/g, newRenderHistory);


// 4. Update renderReport to combine cloud history properly if needed, but the original logic already used window.fullData.analytics.report so we just need to ensure window.loadPoints is called inside refresh
const refreshAddon = `renderAIInsights(safeAnalytics, data.orders || []);
                
                if (typeof window.loadPoints === 'function') window.loadPoints();
                if (typeof window.renderHistory === 'function') window.renderHistory();`;
                
html = html.replace(/renderAIInsights\(safeAnalytics, data\.orders \|\| \[\]\);/g, refreshAddon);

// 5. In actionCall, I don't need to revert the localStorage history push I made earlier, as it acts as a good optimistic UI update.

fs.writeFileSync('d:/withu/withU/admin.html', html, 'utf8');
console.log('Updated admin.html for Cloud Sync');
