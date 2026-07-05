const fs = require('fs');
let html = fs.readFileSync('d:/withu/withU/admin.html', 'utf8');

// 1. Inject sb-history into sidebar dynamically, if not exists.
const sidebarLogic = `    // === HISTORY BUTTON IN SIDEBAR ===
    if (!document.getElementById('sb-history')) {
        var reportBtn = document.getElementById('sb-report');
        if (reportBtn) {
            var historyBtn = document.createElement('button');
            historyBtn.className = 'sidebar-item';
            historyBtn.id = 'sb-history';
            historyBtn.innerHTML = '<i class="fas fa-history" style="margin-right:10px; font-size:15px; width:20px; text-align:center;"></i>ประวัติการขาย';
            historyBtn.onclick = function() { window.showSec('history'); toggleSidebar(); };
            reportBtn.parentNode.insertBefore(historyBtn, reportBtn.nextSibling);
        }
    }`;

if (!html.includes('id="sb-history"')) {
    html = html.replace(/\/\/ === SETTINGS BUTTON IN SIDEBAR ===/, sidebarLogic + '\n\n    // === SETTINGS BUTTON IN SIDEBAR ===');
}

// 2. Inject history-sec dynamically into DOM
const historySecLogic = `    // === HISTORY SECTION ===
    if (!document.getElementById('history-sec')) {
        var reportSecEl = document.getElementById('report-sec');
        if (reportSecEl) {
            var historyDiv = document.createElement('div');
            historyDiv.id = 'history-sec';
            historyDiv.style.display = 'none';
            historyDiv.innerHTML = '<h2 style="margin-bottom:28px;font-size:26px;font-weight:800;letter-spacing:-.6px;"><i class="fas fa-history" style="color:var(--primary); margin-right:10px;"></i> ประวัติการขาย (History)</h2><div id="history-list-cards"></div>';
            reportSecEl.parentNode.appendChild(historyDiv);
        }
    }`;

if (!html.includes("id='history-sec'") && !html.includes('id="history-sec"')) {
    html = html.replace(/\/\/ === SETTINGS SECTION ===/, historySecLogic + '\n\n    // === SETTINGS SECTION ===');
}

// 3. Update window.showSec to support history
const newShowSec = `// === SHOW SECTION OVERRIDE ===
window.showSec = function(n) {
    var main = document.querySelector('.app-main') || document.body;
    var secs = main.querySelectorAll('div[id$="-sec"]');
    secs.forEach(function(el) { el.style.display = 'none'; });
    
    var t = document.getElementById(n + '-sec');
    if (t) {
        t.style.display = (n==='report'||n==='settings'||n==='points'||n==='history') ? 'block' : 'grid';
        t.style.animation = 'fadeSlideIn 0.25s ease-out';
    }
    if (n==='points' && typeof window.loadPoints === 'function') window.loadPoints();
    if (n==='report' && typeof window.switchReportTab === 'function') setTimeout(function(){window.switchReportTab('dashboard');},50);
    if (n==='settings' && typeof window.loadSettings === 'function') window.loadSettings();
    if (n==='history' && typeof window.renderHistoryCards === 'function') window.renderHistoryCards();
    document.querySelectorAll('.tab-btn').forEach(function(b) { if(b.id) b.classList.toggle('active', b.id==='t-'+n); });
    document.querySelectorAll('.sidebar-item').forEach(function(b) { if(b.id) b.classList.toggle('active', b.id==='sb-'+n); });
};`;

html = html.replace(/\/\/ === SHOW SECTION OVERRIDE ===[\s\S]*?};\s*\n\/\/ === AUTO-SYNC ===/, newShowSec + '\n\n// === AUTO-SYNC ===');


// 4. Update window.renderHistory to render history into #history-list-cards and #history-list
const renderHistoryRegex = /window\.renderHistory = function\(\) \{[\s\S]*?(?=window\.renderReport = function)/;
const newRenderHistory = `window.renderHistory = function() {
    if (typeof window.renderHistoryCards === 'function') window.renderHistoryCards();
};
window.renderHistoryCards = function() {
    var orders = [];
    if (window.fullData && window.fullData.history) {
        orders = [...window.fullData.history];
    }
    
    var localOrders = [];
    try { localOrders = JSON.parse(localStorage.getItem('withu_completed_orders')||'[]'); } catch(e){}
    
    var existingIds = new Set(orders.map(o => o.id || o.orderNo));
    localOrders.forEach(o => {
        if (!existingIds.has(o.id || o.orderNo)) {
            orders.push(o);
        }
    });
    
    orders.sort(function(a,b) { return new Date(b.timestamp)-new Date(a.timestamp); });
    
    // Group by Date
    var grouped = {};
    orders.forEach(o => {
        var dateObj = new Date(o.timestamp);
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
            var pay = o.paymentMethod==='qr' ? '<span style="color:#3b82f6; font-weight:800; background:rgba(59,130,246,0.1); padding:4px 8px; border-radius:6px; font-size:11px;"><i class="fas fa-qrcode" style="margin-right:4px;"></i> QR</span>' : '<span style="color:#10b981; font-weight:800; background:rgba(16,185,129,0.1); padding:4px 8px; border-radius:6px; font-size:11px;"><i class="fas fa-money-bill" style="margin-right:4px;"></i> CASH</span>';
            var price = '฿' + (o.total||o.finalTotal||0).toLocaleString();
            
            htmlCards += '<div class="ai-card" style="padding:16px; display:flex; justify-content:space-between; align-items:center; border:1px solid var(--border); box-shadow:0 2px 10px rgba(0,0,0,0.02);">';
            htmlCards += '<div>';
            htmlCards += '<div style="font-size:12px; color:var(--text-muted); margin-bottom:6px;"><i class="fas fa-clock" style="margin-right:4px;"></i> ' + timeStr + ' &nbsp;&bull;&nbsp; <span style="font-weight:700; color:var(--text);">' + (o.table||'Takeaway') + '</span></div>';
            htmlCards += '<div style="font-weight:900; font-size:15px; color:var(--text); letter-spacing:-0.5px;">#' + (o.id||o.orderNo||(1000+i)) + '</div>';
            htmlCards += '</div>';
            
            htmlCards += '<div style="text-align:right;">';
            htmlCards += '<div style="color:var(--primary); font-weight:900; font-size:18px; margin-bottom:6px;">' + price + '</div>';
            htmlCards += '<div>' + pay + '</div>';
            htmlCards += '</div>';
            
            htmlCards += '</div>';
        });
        
        htmlCards += '</div>';
    });
    
    if(!orders.length) htmlCards = '<div style="text-align:center; padding:40px; color:var(--text-muted); background:var(--gray-light); border-radius:12px; margin-top:20px; font-weight:700;"><i class="fas fa-history" style="font-size:24px; margin-bottom:10px; display:block; opacity:0.5;"></i>No history available</div>';
    
    var listCards = document.getElementById('history-list-cards');
    if(listCards) listCards.innerHTML = htmlCards;

    // Legacy table fallback
    var list = document.getElementById('history-list');
    if(list) {
        if(!orders.length) { list.innerHTML='<tr><td colspan="5" style="text-align:center; padding:30px; color:var(--text-muted);">No history</td></tr>'; }
        else {
            list.innerHTML = orders.map(function(o,i) {
                var date = new Date(o.timestamp).toLocaleString('th-TH');
                var pay = o.paymentMethod==='qr' ? '<span style="color:#3b82f6; font-weight:700;"><i class="fas fa-qrcode" style="margin-right:4px;"></i>QR</span>' : '<span style="color:#f59e0b; font-weight:700;"><i class="fas fa-money-bill" style="margin-right:4px;"></i>CASH</span>';
                return '<tr style="border-bottom:1px solid var(--border);"><td style="font-size:12px; color:var(--text-muted); padding:13px;">' + date + '</td><td style="font-weight:800;">#' + (o.id||o.orderNo||(1000+i)) + '</td><td><span style="background:var(--slate); padding:4px 10px; border-radius:6px; font-size:11px; font-weight:700;">' + (o.table||'Takeaway') + '</span></td><td style="color:#10b981; font-weight:800;">฿' + (o.total||o.finalTotal||0).toLocaleString() + '</td><td>' + pay + '</td></tr>';
            }).join('');
        }
    }
};
`;

html = html.replace(renderHistoryRegex, newRenderHistory);

fs.writeFileSync('d:/withu/withU/admin.html', html);
console.log("History sidebar UI applied successfully!");
