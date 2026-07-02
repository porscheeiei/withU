const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf8');

// Remove the entire withu-v3-system script block and replace it with a fixed version
const startMarker = '<script id="withu-v3-system">';
const endMarker = '</script>';

const startIdx = html.indexOf(startMarker);
if (startIdx === -1) {
    console.log('withu-v3-system script not found');
    process.exit(1);
}
const endIdx = html.indexOf(endMarker, startIdx + startMarker.length);
if (endIdx === -1) {
    console.log('End of script not found');
    process.exit(1);
}

const before = html.substring(0, startIdx);
const after = html.substring(endIdx + endMarker.length);

// The fixed script - using backtick template literals to avoid quote issues
const fixedScript = `<script id="withu-v3-system">
document.addEventListener('DOMContentLoaded', function() {
    // === ICON REPLACEMENT ===
    var iconMap = {
        'sb-orders': 'fas fa-store',
        'sb-takeaway': 'fas fa-motorcycle',
        'sb-stock': 'fas fa-box-open',
        'sb-report': 'fas fa-chart-line',
        'sb-points': 'fas fa-star'
    };
    Object.keys(iconMap).forEach(function(id) {
        var el = document.getElementById(id);
        if (el) {
            var svgs = el.querySelectorAll('svg');
            svgs.forEach(function(s) { s.remove(); });
            var ic = document.createElement('i');
            ic.className = iconMap[id];
            ic.style.cssText = 'margin-right:10px; font-size:15px; width:20px; text-align:center;';
            el.prepend(ic);
        }
    });
    
    // Fix other sidebar buttons with SVG icons
    document.querySelectorAll('.sidebar-item').forEach(function(btn) {
        var svg = btn.querySelector('svg');
        if (svg) {
            svg.remove();
            var iconClass = 'fas fa-circle';
            var oc = btn.getAttribute('onclick') || '';
            if (oc.indexOf('handleLogout') !== -1) iconClass = 'fas fa-sign-out-alt';
            else if (oc.indexOf('openManualOrderModal') !== -1) iconClass = 'fas fa-pen-to-square';
            else if (oc.indexOf('toggleAttendance') !== -1) iconClass = 'fas fa-user-clock';
            else if (oc.indexOf('toggleTheme') !== -1) iconClass = 'fas fa-adjust';
            else if (oc.indexOf('toggleLanguage') !== -1) iconClass = 'fas fa-globe';
            var ic = document.createElement('i');
            ic.className = iconClass;
            ic.style.cssText = 'margin-right:10px; font-size:15px; width:20px; text-align:center;';
            btn.prepend(ic);
        }
    });
    
    // === SETTINGS BUTTON IN SIDEBAR ===
    if (!document.getElementById('sb-settings')) {
        var logoutBtn = document.querySelector('button[onclick*="handleLogout"]');
        if (logoutBtn) {
            var divider = document.createElement('div');
            divider.className = 'sidebar-divider';
            var settingsBtn = document.createElement('button');
            settingsBtn.className = 'sidebar-item';
            settingsBtn.id = 'sb-settings';
            settingsBtn.innerHTML = '<i class="fas fa-cog" style="margin-right:10px; font-size:15px; width:20px; text-align:center;"><\\/i>Settings';
            settingsBtn.onclick = function() { window.showSec('settings'); toggleSidebar(); };
            logoutBtn.parentNode.insertBefore(divider, logoutBtn);
            logoutBtn.parentNode.insertBefore(settingsBtn, logoutBtn);
        }
    }
    
    // === SETTINGS SECTION ===
    if (!document.getElementById('settings-sec')) {
        var orderSec = document.getElementById('order-sec');
        if (orderSec) {
            var div = document.createElement('div');
            div.id = 'settings-sec';
            div.style.cssText = 'display:none; padding:20px;';
            div.innerHTML = '<h2 style="margin-bottom:20px;"><i class="fas fa-cog" style="color:#3b82f6; margin-right:8px;"><\\/i>Store Settings<\\/h2>' +
                '<div class="ai-card" style="margin-bottom:16px; border-top:3px solid #3b82f6;">' +
                '<h3 style="font-size:15px; margin-bottom:14px; font-weight:800;"><i class="fas fa-clock" style="color:#3b82f6; margin-right:6px;"><\\/i>Business Hours<\\/h3>' +
                '<label style="display:flex; align-items:center; gap:10px; font-weight:800; font-size:16px; color:#10b981; margin-bottom:15px; cursor:pointer;"><input type="checkbox" id="store-open-status" onchange="toggleStoreStatus()" style="width:22px; height:22px; accent-color:#10b981;"> Open for Orders Today<\\/label>' +
                '<hr style="border:0; border-top:1px solid var(--border); margin:14px 0;">' +
                '<label style="font-weight:700; display:block; margin-bottom:10px; font-size:13px;">Operating Days<\\/label>' +
                '<div style="display:flex; flex-wrap:wrap; gap:12px; margin-bottom:15px;" id="bh-days">' +
                '<label style="cursor:pointer; font-size:13px;"><input type="checkbox" value="1" checked> Mon<\\/label>' +
                '<label style="cursor:pointer; font-size:13px;"><input type="checkbox" value="2" checked> Tue<\\/label>' +
                '<label style="cursor:pointer; font-size:13px;"><input type="checkbox" value="3" checked> Wed<\\/label>' +
                '<label style="cursor:pointer; font-size:13px;"><input type="checkbox" value="4" checked> Thu<\\/label>' +
                '<label style="cursor:pointer; font-size:13px;"><input type="checkbox" value="5" checked> Fri<\\/label>' +
                '<label style="cursor:pointer; font-size:13px;"><input type="checkbox" value="6" checked> Sat<\\/label>' +
                '<label style="cursor:pointer; font-size:13px;"><input type="checkbox" value="0" checked> Sun<\\/label>' +
                '<\\/div>' +
                '<div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:15px;">' +
                '<div><label style="font-weight:700; display:block; margin-bottom:5px; font-size:12px;">Open<\\/label><input type="time" id="bh-start" value="09:00"><\\/div>' +
                '<div><label style="font-weight:700; display:block; margin-bottom:5px; font-size:12px;">Close<\\/label><input type="time" id="bh-end" value="21:00"><\\/div>' +
                '<\\/div>' +
                '<button class="btn-black" onclick="saveBusinessHours()" style="background:linear-gradient(135deg,#3b82f6,#2563eb);"><i class="fas fa-save" style="margin-right:6px;"><\\/i>Save<\\/button>' +
                '<\\/div>' +
                '<div class="ai-card" style="margin-bottom:16px;">' +
                '<h3 style="font-size:15px; margin-bottom:14px; font-weight:800;"><i class="fas fa-qrcode" style="color:#3b82f6; margin-right:6px;"><\\/i>PromptPay QR<\\/h3>' +
                '<input type="text" id="store-promptpay" placeholder="Phone or National ID" style="margin-bottom:12px;">' +
                '<button class="btn-black" onclick="savePromptPay()" style="background:linear-gradient(135deg,#3b82f6,#2563eb);"><i class="fas fa-save" style="margin-right:6px;"><\\/i>Save PromptPay<\\/button>' +
                '<\\/div>' +
                '<div class="ai-card">' +
                '<h3 style="font-size:15px; margin-bottom:14px; font-weight:800;"><i class="fas fa-volume-up" style="color:#3b82f6; margin-right:6px;"><\\/i>Sound Alerts<\\/h3>' +
                '<button id="btn-sound-setting" onclick="window.toggleSound()" class="btn-outline" style="width:100%; border-color:#3b82f6; color:#3b82f6; padding:14px; font-weight:800;"><i class="fas fa-volume-up" style="margin-right:6px;"><\\/i>Toggle Sound<\\/button>' +
                '<\\/div>';
            orderSec.parentNode.insertBefore(div, orderSec.nextSibling);
        }
    }

    // === POINTS SECTION ===
    var pointsSec = document.getElementById('points-sec');
    if (pointsSec && !pointsSec.querySelector('#pts-phone')) {
        pointsSec.innerHTML = '<h2 style="margin-bottom:20px;"><i class="fas fa-star" style="color:#f59e0b; margin-right:8px;"><\\/i>Loyalty Points<\\/h2>' +
            '<div class="ai-card" style="margin-bottom:16px; border-top:3px solid #f59e0b;">' +
            '<h3 style="font-size:15px; margin-bottom:14px; font-weight:800;"><i class="fas fa-user-plus" style="color:#3b82f6; margin-right:6px;"><\\/i>Add / Edit Member<\\/h3>' +
            '<div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px;">' +
            '<div><label style="font-size:11px; font-weight:700;">Phone<\\/label><input type="tel" id="pts-phone" placeholder="09XXXXXXXX"><\\/div>' +
            '<div><label style="font-size:11px; font-weight:700;">Name<\\/label><input type="text" id="pts-name" placeholder="Customer Name"><\\/div>' +
            '<div><label style="font-size:11px; font-weight:700;">Points<\\/label><input type="number" id="pts-val" value="0"><\\/div>' +
            '<\\/div>' +
            '<button class="btn-black" onclick="savePointData()" style="margin-top:14px; background:linear-gradient(135deg,#3b82f6,#2563eb);"><i class="fas fa-save" style="margin-right:6px;"><\\/i>Save<\\/button>' +
            '<\\/div>' +
            '<div class="ai-card" style="padding:0; overflow-x:auto;">' +
            '<table class="report-table" style="min-width:500px; width:100%;"><thead><tr><th>Phone<\\/th><th>Name<\\/th><th>Points<\\/th><th>Actions<\\/th><\\/tr><\\/thead><tbody id="points-list"><\\/tbody><\\/table><\\/div>';
    }
    
    // === REPORT SECTION ===
    var reportSec = document.getElementById('report-sec');
    if (reportSec && !reportSec.querySelector('#rtab-dashboard')) {
        reportSec.innerHTML = '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:10px;">' +
            '<h2 style="margin:0;"><i class="fas fa-chart-line" style="color:#3b82f6; margin-right:8px;"><\\/i>Performance<\\/h2>' +
            '<div style="display:flex; gap:8px;">' +
            '<button class="btn-outline" onclick="switchReportTab(\\x27dashboard\\x27)" id="rtab-dashboard" style="border-color:#3b82f6; color:#3b82f6; background:rgba(59,130,246,0.08); font-size:12px; padding:8px 14px;"><i class="fas fa-chart-pie" style="margin-right:4px;"><\\/i>Dashboard<\\/button>' +
            '<button class="btn-outline" onclick="switchReportTab(\\x27history\\x27)" id="rtab-history" style="font-size:12px; padding:8px 14px;"><i class="fas fa-history" style="margin-right:4px;"><\\/i>History<\\/button>' +
            '<\\/div><\\/div>' +
            '<div id="report-dashboard">' +
            '<div style="display:flex; gap:8px; margin-bottom:16px; flex-wrap:wrap;">' +
            '<button class="btn-black rpt-btn" onclick="renderReport(\\x271d\\x27)" style="flex:1; min-width:70px; background:linear-gradient(135deg,#3b82f6,#2563eb);">1 Day<\\/button>' +
            '<button class="btn-black rpt-btn" onclick="renderReport(\\x277d\\x27)" style="flex:1; min-width:70px;">7 Days<\\/button>' +
            '<button class="btn-black rpt-btn" onclick="renderReport(\\x2730d\\x27)" style="flex:1; min-width:70px;">30 Days<\\/button>' +
            '<button class="btn-black rpt-btn" onclick="renderReport(\\x27all\\x27)" style="flex:1; min-width:70px;">All<\\/button>' +
            '<\\/div>' +
            '<div class="stats-grid" style="display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:14px; margin-bottom:16px;">' +
            '<div class="ai-card" style="border-left:3px solid #10b981; padding:18px;"><p style="font-size:10px; font-weight:800; color:#64748b; letter-spacing:1px; text-transform:uppercase; margin:0;">TOTAL SALES<\\/p><p style="font-size:26px; font-weight:900; color:#10b981; margin:6px 0 0;">\\u0e3f<span id="rep-total">0<\\/span><\\/p><\\/div>' +
            '<div class="ai-card" style="border-left:3px solid #3b82f6; padding:18px;"><p style="font-size:10px; font-weight:800; color:#64748b; letter-spacing:1px; text-transform:uppercase; margin:0;">ORDERS<\\/p><p style="font-size:26px; font-weight:900; color:#3b82f6; margin:6px 0 0;" id="rep-count">0<\\/p><\\/div>' +
            '<div class="ai-card" style="border-left:3px solid #f59e0b; padding:18px;"><p style="font-size:10px; font-weight:800; color:#64748b; letter-spacing:1px; text-transform:uppercase; margin:0;">TOP MENU<\\/p><p style="font-size:18px; font-weight:900; color:#f59e0b; margin:6px 0 0;" id="rep-top-menu">-<\\/p><\\/div>' +
            '<\\/div>' +
            '<div class="ai-card" style="margin-bottom:16px;"><h3 style="font-size:13px; font-weight:800; margin-bottom:14px;"><i class="fas fa-chart-area" style="color:#3b82f6; margin-right:6px;"><\\/i>Sales Trend<\\/h3><div style="height:260px;"><canvas id="salesChart"><\\/canvas><\\/div><\\/div>' +
            '<div class="ai-card"><h3 style="font-size:13px; font-weight:800; margin-bottom:14px;"><i class="fas fa-utensils" style="color:#f59e0b; margin-right:6px;"><\\/i>Menu Breakdown (Today)<\\/h3><div id="menu-breakdown" style="max-height:300px; overflow-y:auto;"><\\/div><\\/div>' +
            '<\\/div>' +
            '<div id="report-history" style="display:none;">' +
            '<div class="ai-card" style="padding:0;"><div style="overflow-x:auto;"><table class="report-table" style="min-width:700px; width:100%;"><thead><tr><th>Date<\\/th><th>Order<\\/th><th>Table<\\/th><th>Total<\\/th><th>Payment<\\/th><\\/tr><\\/thead><tbody id="history-list"><\\/tbody><\\/table><\\/div><\\/div><\\/div>';
    }

    setTimeout(function() {
        if (typeof window.loadSettings === 'function') window.loadSettings();
        if (typeof window.loadBusinessHours === 'function') window.loadBusinessHours();
    }, 300);
});

// === SHOW SECTION OVERRIDE ===
var _origShowSec = typeof window.showSec === 'function' ? window.showSec : null;
window.showSec = function(n) {
    ['order-sec','takeaway-sec','stock-sec','report-sec','points-sec','settings-sec'].forEach(function(s) {
        var el = document.getElementById(s);
        if (el) el.style.display = 'none';
    });
    var t = document.getElementById(n + '-sec');
    if (t) {
        t.style.display = (n==='report'||n==='settings'||n==='points') ? 'block' : 'grid';
        t.style.animation = 'fadeSlideIn 0.25s ease-out';
    }
    if (n==='points' && typeof window.loadPoints === 'function') window.loadPoints();
    if (n==='report' && typeof window.switchReportTab === 'function') setTimeout(function(){window.switchReportTab('dashboard');},50);
    if (n==='settings' && typeof window.loadSettings === 'function') window.loadSettings();
    document.querySelectorAll('.tab-btn').forEach(function(b) { if(b.id) b.classList.toggle('active', b.id==='t-'+n); });
    document.querySelectorAll('.sidebar-item').forEach(function(b) { if(b.id) b.classList.toggle('active', b.id==='sb-'+n); });
};

// === AUTO-SYNC ===
window.addEventListener('storage', function(e) {
    if (e.key==='withu_orders'||e.key==='withu_points'||e.key==='withu_points_db') {
        var ss = document.getElementById('sync-status');
        if(ss) { ss.style.display='inline-flex'; setTimeout(function(){ss.style.display='none';},1500); }
    }
});

// === SETTINGS LOGIC ===
window.loadSettings = function() {
    var cb = document.getElementById('store-open-status');
    if(cb) cb.checked = localStorage.getItem('withu_store_open') !== 'false';
    var pp = document.getElementById('store-promptpay');
    if(pp) pp.value = localStorage.getItem('withu_promptpay') || '';
};
window.toggleStoreStatus = function() {
    var isOpen = document.getElementById('store-open-status').checked;
    localStorage.setItem('withu_store_open', isOpen);
    if(typeof showToast==='function') showToast(isOpen ? 'Store OPEN' : 'Store CLOSED', 'new');
};
window.savePromptPay = function() {
    localStorage.setItem('withu_promptpay', document.getElementById('store-promptpay').value.trim());
    if(typeof showToast==='function') showToast('PromptPay saved', 'new');
};
window.loadBusinessHours = function() {
    try {
        var bh = JSON.parse(localStorage.getItem('withu_business_hours'));
        if(bh) {
            document.querySelectorAll('#bh-days input').forEach(function(cb) { cb.checked = bh.days.indexOf(parseInt(cb.value)) !== -1; });
            if(bh.start) document.getElementById('bh-start').value = bh.start;
            if(bh.end) document.getElementById('bh-end').value = bh.end;
        }
    } catch(e) {}
};
window.saveBusinessHours = function() {
    var days = Array.from(document.querySelectorAll('#bh-days input:checked')).map(function(cb){return parseInt(cb.value);});
    localStorage.setItem('withu_business_hours', JSON.stringify({ days: days, start: document.getElementById('bh-start').value, end: document.getElementById('bh-end').value }));
    if(typeof showToast==='function') showToast('Business hours saved', 'new');
};

// === POINTS LOGIC ===
window.loadPoints = function() {
    var db = {};
    try { db = JSON.parse(localStorage.getItem('withu_points_db') || '{}'); } catch(e) {}
    var list = document.getElementById('points-list');
    if(!list) return;
    list.innerHTML = '';
    Object.keys(db).forEach(function(phone) {
        var data = db[phone];
        if(typeof data==='number') { data = {points:data, name:''}; db[phone] = data; }
        var tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid var(--border)';
        tr.innerHTML = '<td style="font-weight:700; padding:13px;">' + phone + '</td>' +
            '<td>' + (data.name || '<span style="color:var(--text-muted);">-</span>') + '</td>' +
            '<td style="color:#3b82f6; font-weight:800; font-size:16px;">' + data.points + '</td>' +
            '<td><button class="btn-outline" style="padding:6px 12px; border-color:#f59e0b; color:#f59e0b; font-size:11px;"><i class="fas fa-edit" style="margin-right:4px;"></i>Edit</button></td>';
        tr.querySelector('button').onclick = function() { editPointData(phone, data.name||'', data.points); };
        list.appendChild(tr);
    });
    localStorage.setItem('withu_points_db', JSON.stringify(db));
};
window.editPointData = function(phone, name, points) {
    var p = document.getElementById('pts-phone'); if(p) p.value = phone;
    var n = document.getElementById('pts-name'); if(n) n.value = name;
    var v = document.getElementById('pts-val'); if(v) v.value = points;
};
window.savePointData = function() {
    var phone = (document.getElementById('pts-phone') || {}).value;
    if(!phone || !phone.trim()) { if(typeof showToast==='function') showToast('Enter phone number','call'); return; }
    phone = phone.trim();
    var db = {}; try { db = JSON.parse(localStorage.getItem('withu_points_db')||'{}'); } catch(e){}
    db[phone] = { points: parseInt((document.getElementById('pts-val')||{}).value)||0, name: ((document.getElementById('pts-name')||{}).value||'').trim() };
    localStorage.setItem('withu_points_db', JSON.stringify(db));
    document.getElementById('pts-phone').value = '';
    document.getElementById('pts-name').value = '';
    document.getElementById('pts-val').value = '0';
    window.loadPoints();
    if(typeof showToast==='function') showToast('Member saved','new');
};

// === REPORT LOGIC ===
var salesChartInstance = null;
window.switchReportTab = function(tab) {
    var d = document.getElementById('report-dashboard');
    var h = document.getElementById('report-history');
    if(d) { d.style.display = tab==='dashboard'?'block':'none'; }
    if(h) { h.style.display = tab==='history'?'block':'none'; }
    var db = document.getElementById('rtab-dashboard');
    var hb = document.getElementById('rtab-history');
    if(db) db.style.cssText = tab==='dashboard' ? 'border-color:#3b82f6; color:#3b82f6; background:rgba(59,130,246,0.08); font-size:12px; padding:8px 14px;' : 'font-size:12px; padding:8px 14px;';
    if(hb) hb.style.cssText = tab==='history' ? 'border-color:#3b82f6; color:#3b82f6; background:rgba(59,130,246,0.08); font-size:12px; padding:8px 14px;' : 'font-size:12px; padding:8px 14px;';
    if(tab==='dashboard') window.renderReport('1d'); else window.renderHistory();
};
window.renderReport = function(period) {
    var btns = document.querySelectorAll('.rpt-btn');
    var pMap = {'1d':0,'7d':1,'30d':2,'all':3};
    btns.forEach(function(b,i) {
        b.style.background = i===pMap[period] ? 'linear-gradient(135deg,#3b82f6,#2563eb)' : 'linear-gradient(135deg,#1e293b,#0f172a)';
    });
    var dataStr = localStorage.getItem('withu_completed_orders') || '[]';
    var orders = []; try { orders = JSON.parse(dataStr); } catch(e) {}
    var now = new Date();
    var fOrders = orders.filter(function(o) {
        if(!o.timestamp) return false;
        var d = new Date(o.timestamp);
        var diff = Math.ceil(Math.abs(now-d)/(1000*60*60*24));
        if(period==='1d') return diff<=1 && d.getDate()===now.getDate();
        if(period==='7d') return diff<=7;
        if(period==='30d') return diff<=30;
        return true;
    });
    var total=0, items={}, byDate={};
    fOrders.forEach(function(o) {
        var amt = o.total||o.finalTotal||0; total+=amt;
        if(o.cart) o.cart.forEach(function(item) { items[item.name] = (items[item.name]||0) + (item.qty||1); });
        var dk = new Date(o.timestamp).toLocaleDateString('th-TH');
        byDate[dk] = (byDate[dk]||0) + amt;
    });
    var te = document.getElementById('rep-total'); if(te) te.innerText = total.toLocaleString();
    var ce = document.getElementById('rep-count'); if(ce) ce.innerText = fOrders.length;
    var topArr = Object.entries(items).sort(function(a,b){return b[1]-a[1];});
    var tme = document.getElementById('rep-top-menu'); if(tme) tme.innerText = topArr.length ? topArr[0][0]+' ('+topArr[0][1]+')' : '-';
    
    // Menu breakdown
    var mb = document.getElementById('menu-breakdown');
    if(mb) {
        if(topArr.length === 0) {
            mb.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-muted);">No data</div>';
        } else {
            var maxQ = topArr[0][1];
            var rows = topArr.map(function(entry) {
                var pct = Math.round((entry[1]/maxQ)*100);
                return '<tr style="border-bottom:1px solid var(--border);"><td style="padding:10px;"><div style="font-weight:700; font-size:13px;">' + entry[0] + '</div><div style="margin-top:5px; height:4px; background:var(--border); border-radius:99px; overflow:hidden;"><div style="height:100%; background:linear-gradient(90deg,#3b82f6,#6366f1); border-radius:99px; width:' + pct + '%;"></div></div></td><td style="text-align:right; padding:10px; font-weight:900; font-size:16px; color:#3b82f6;">' + entry[1] + '</td></tr>';
            }).join('');
            mb.innerHTML = '<table style="width:100%; border-collapse:collapse;"><tr style="border-bottom:2px solid var(--border);"><th style="text-align:left; padding:10px; font-size:11px; font-weight:800; color:#64748b; letter-spacing:1px;">MENU ITEM</th><th style="text-align:right; padding:10px; font-size:11px; font-weight:800; color:#64748b; letter-spacing:1px;">QTY</th></tr>' + rows + '</table>';
        }
    }
    
    // Chart
    var ctx = document.getElementById('salesChart');
    if(ctx && window.Chart) {
        if(salesChartInstance) salesChartInstance.destroy();
        var labels = Object.keys(byDate); if(!labels.length) labels = ['-'];
        var vals = Object.values(byDate); if(!vals.length) vals = [0];
        salesChartInstance = new Chart(ctx, {
            type:'line',
            data: { labels: labels, datasets: [{ label:'Sales', data: vals, borderColor:'#3b82f6', backgroundColor:'rgba(59,130,246,0.1)', borderWidth:2.5, fill:true, tension:0.4, pointBackgroundColor:'#3b82f6', pointRadius:4 }] },
            options: { responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}}, scales:{x:{grid:{display:false}},y:{grid:{color:'rgba(0,0,0,0.05)'}}} }
        });
    }
};
window.renderHistory = function() {
    var dataStr = localStorage.getItem('withu_completed_orders')||'[]';
    var orders = []; try { orders = JSON.parse(dataStr); } catch(e){}
    orders.sort(function(a,b) { return new Date(b.timestamp)-new Date(a.timestamp); });
    var list = document.getElementById('history-list');
    if(!list) return;
    if(!orders.length) { list.innerHTML='<tr><td colspan="5" style="text-align:center; padding:30px; color:var(--text-muted);">No history</td></tr>'; return; }
    list.innerHTML = orders.map(function(o,i) {
        var date = new Date(o.timestamp).toLocaleString('th-TH');
        var pay = o.paymentMethod==='qr' ? '<span style="color:#3b82f6; font-weight:700;"><i class="fas fa-qrcode" style="margin-right:4px;"></i>QR</span>' : '<span style="color:#f59e0b; font-weight:700;"><i class="fas fa-money-bill" style="margin-right:4px;"></i>CASH</span>';
        return '<tr style="border-bottom:1px solid var(--border);"><td style="font-size:12px; color:var(--text-muted); padding:13px;">' + date + '</td><td style="font-weight:800;">#' + (o.id||o.orderNo||(1000+i)) + '</td><td><span style="background:var(--slate); padding:4px 10px; border-radius:6px; font-size:11px; font-weight:700;">' + (o.table||'Takeaway') + '</span></td><td style="color:#10b981; font-weight:800;">\\u0e3f' + (o.total||o.finalTotal||0).toLocaleString() + '</td><td>' + pay + '</td></tr>';
    }).join('');
};
</script>`;

html = before + fixedScript + after;
fs.writeFileSync('admin.html', html, 'utf8');
console.log('V3 system script replaced with fixed version.');
