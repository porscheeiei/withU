const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf8');

// 1. FIX FONT CSS so FontAwesome works
// Replace `* { font-family: ... }` with `*:not(.fas):not(.far):not(.fab):not(.fa) { font-family: ... }`
html = html.replace(
    /\* \{ font-family: 'Plus Jakarta Sans', 'Inter', 'Prompt', system-ui, sans-serif !important; \}/,
    '*:not(.fas):not(.far):not(.fab):not(.fa) { font-family: \'Plus Jakarta Sans\', \'Inter\', \'Prompt\', system-ui, sans-serif !important; }'
);


// 2. REORDER TOP NAV: WITHU ADMIN -> Date -> SYNCING -> CLOSING IN
const logoSectionRegex = /<div style="display: flex; align-items: center; gap: 12px;">\s*<div class="logo">WITHU ADMIN<\/div>\s*<span id="sync-status"[\s\S]*?<\/span>\s*<div style="font-size:11px; font-weight:700; color:var\(--text-muted\); display:flex; align-items:center; gap:6px;">\s*<span style="background:rgba\(59,130,246,0.08\);[\s\S]*?<\/span><\/span>\s*<span id="date-now"[\s\S]*?<\/span>\s*<\/div>\s*<\/div>/;

const newLogoSection = `
    <div style="display: flex; align-items: center; gap: 12px;">
        <div class="logo">WITHU ADMIN</div>
        <span id="date-now" style="background:rgba(100,116,139,0.08); padding:5px 10px; border-radius:8px; color:#64748b; font-weight:700; border:1px solid rgba(100,116,139,0.1);"></span>
        <span id="sync-status" style="display:none; font-weight:700; font-size:11px; color:#10b981; background:rgba(16,185,129,0.1); padding:4px 10px; border-radius:6px; border:1px solid rgba(16,185,129,0.2);"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right:4px; vertical-align:-1px; animation:spin 1s linear infinite;"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>SYNCING</span>
        <div style="font-size:11px; font-weight:700; color:var(--text-muted); display:flex; align-items:center; gap:6px;">
            <span style="background:rgba(59,130,246,0.08); padding:5px 10px; border-radius:8px; color:#3b82f6; font-weight:800; border:1px solid rgba(59,130,246,0.15);">CLOSING IN: <span id="close-timer" style="font-weight:900; color:#2563eb;">00:00:00</span></span>
        </div>
    </div>
`;
html = html.replace(logoSectionRegex, newLogoSection.trim());


// 3. FIX REPORT LOGIC TO USE fullData.analytics IF AVAILABLE
// We modify the `window.renderReport` function inside the V3 script block.
const renderReportRegex = /window\.renderReport = function\(period\) \{([\s\S]*?)\};\s*window\.renderHistory/;

const newRenderReport = `window.renderReport = function(period) {
    var btns = document.querySelectorAll('.rpt-btn');
    var pMap = {'1d':0,'7d':1,'30d':2,'all':3};
    btns.forEach(function(b,i) {
        b.style.background = i===pMap[period] ? 'linear-gradient(135deg,#3b82f6,#2563eb)' : 'linear-gradient(135deg,#1e293b,#0f172a)';
    });
    
    var total=0, items={}, byDate={};
    var ordersCount = 0;
    var now = new Date();
    
    // Check if we are viewing 1d and have fullData from API
    if (period === '1d' && window.fullData && window.fullData.analytics && window.fullData.analytics.report && window.fullData.analytics.report.length > 0) {
        var rpt = window.fullData.analytics.report;
        total = window.fullData.analytics.revenue || 0;
        rpt.forEach(function(i) {
            items[i.name || i[0]] = (items[i.name || i[0]] || 0) + (i.qty || 1);
            if (!total && i.revenue) total += i.revenue;
        });
        ordersCount = rpt.reduce(function(s, i) { return s + (i.qty || 1); }, 0); // Estimate
        var dk = now.toLocaleDateString('th-TH');
        byDate[dk] = total;
    } else {
        // Fallback to localStorage data
        var dataStr = localStorage.getItem('withu_completed_orders') || '[]';
        var orders = []; try { orders = JSON.parse(dataStr); } catch(e) {}
        
        var fOrders = orders.filter(function(o) {
            if(!o.timestamp) return false;
            var d = new Date(o.timestamp);
            var diff = Math.ceil(Math.abs(now-d)/(1000*60*60*24));
            if(period==='1d') return diff<=1 && d.getDate()===now.getDate();
            if(period==='7d') return diff<=7;
            if(period==='30d') return diff<=30;
            return true;
        });
        
        ordersCount = fOrders.length;
        fOrders.forEach(function(o) {
            var amt = o.total||o.finalTotal||0; total+=amt;
            if(o.cart) o.cart.forEach(function(item) { items[item.name] = (items[item.name]||0) + (item.qty||1); });
            var dk = new Date(o.timestamp).toLocaleDateString('th-TH');
            byDate[dk] = (byDate[dk]||0) + amt;
        });
    }

    var te = document.getElementById('rep-total'); if(te) te.innerText = total.toLocaleString();
    var ce = document.getElementById('rep-count'); if(ce) ce.innerText = ordersCount;
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
window.renderHistory`;
html = html.replace(renderReportRegex, newRenderReport);

fs.writeFileSync('admin.html', html, 'utf8');
console.log('Admin UI logic updated successfully.');
