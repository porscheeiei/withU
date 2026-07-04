const fs = require('fs');
let html = fs.readFileSync('d:/withu/withU/admin.html', 'utf8');

// 1. Add Toast Notification System
const toastCSS = `
<style id="toast-styles">
.toast-container { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 9999; display: flex; flex-direction: column; gap: 10px; pointer-events: none; }
.toast { background: #000; color: #fff; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 14px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 10px; animation: toastSlideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.toast.toast-success { border-left: 4px solid #10b981; }
.toast.toast-error { border-left: 4px solid #ef4444; }
.toast.toast-info { border-left: 4px solid #3b82f6; }
@keyframes toastSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes toastFadeOut { from { opacity: 1; } to { opacity: 0; } }
</style>
<div id="toast-container" class="toast-container"></div>
`;

if (!html.includes('id="toast-styles"')) {
    html = html.replace('</body>', toastCSS + '\n</body>');
}

const toastJS = `
window.showToast = function(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    
    let icon = '<i class="fas fa-check-circle" style="color:#10b981;"></i>';
    if(type === 'error') icon = '<i class="fas fa-exclamation-circle" style="color:#ef4444;"></i>';
    if(type === 'info' || type === 'call' || type === 'new') icon = '<i class="fas fa-info-circle" style="color:#3b82f6;"></i>';
    
    toast.innerHTML = icon + ' <span>' + message + '</span>';
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'toastFadeOut 0.3s forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

window.saveBusinessHours = function() {
    var data = {
        start: document.getElementById('bh-start').value,
        end: document.getElementById('bh-end').value,
        days: Array.from(document.querySelectorAll('#bh-days input[type="checkbox"]:checked')).map(cb => parseInt(cb.value))
    };
    localStorage.setItem('withu_business_hours', JSON.stringify(data));
    if (typeof showToast === 'function') showToast('บันทึกเวลาทำการเรียบร้อยแล้ว', 'success');
};

window.toggleStoreStatus = function() {
    var cb = document.getElementById('store-open-status');
    if (cb) {
        localStorage.setItem('withu_store_open', cb.checked);
        if (typeof showToast === 'function') showToast(cb.checked ? 'ร้านเปิดรับออเดอร์แล้ว' : 'ปิดรับออเดอร์ชั่วคราว', cb.checked ? 'success' : 'error');
    }
};
`;

if (!html.includes('window.showToast = function')) {
    // Append to V3 script block
    html = html.replace(/(<\/script>\s*<span style="background:rgba\(59,130,246,0\.08\))/, toastJS + '\n$1');
}

// 2. Fix points UI display (loadPoints)
const loadPointsJS = `
window.loadPoints = function() {
    var list = document.getElementById('points-list');
    if (!list) return;
    var db = {}; try { db = JSON.parse(localStorage.getItem('withu_points_db') || '{}'); } catch(e) {}
    var arr = Object.keys(db).map(k => ({ phone: k, name: db[k].name, points: db[k].points }));
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
};
`;

if (!html.includes('window.loadPoints = function')) {
    html = html.replace(/(window\.savePointData = function\(\) \{[\s\S]*?\};)/, '$1\n\n' + loadPointsJS);
}

// Ensure loadPoints is called when Points tab is opened or on init
html = html.replace(/if \(!document\.getElementById\('sb-points'\)\) \{/, 'window.loadPoints();\n    if (!document.getElementById(\'sb-points\')) {');


// 3. Fix History (saving cleared orders to localStorage)
const oldActionCall = `async function actionCall(action, params) { 
            try { 
                const payload = {action, apiKey: API_KEY, ...params};
                await fetch(API_URL, {method:'POST', mode:'no-cors', body:JSON.stringify(payload)}); 
                refresh(); 
            } catch(e) { 
                console.error(e); 
            } 
        }`;

const newActionCall = `async function actionCall(action, params) { 
            try { 
                // Fix: Save cleared orders to local history before they disappear from API
                if (action === 'clearOrder' || action === 'clearTable') {
                    if (window.fullData && window.fullData.orders) {
                        const targetOrders = window.fullData.orders.filter(o => o.id === params.id || (params.table && o.table === params.table));
                        if (targetOrders.length > 0) {
                            let history = []; try { history = JSON.parse(localStorage.getItem('withu_completed_orders') || '[]'); } catch(e){}
                            targetOrders.forEach(o => {
                                o.timestamp = new Date().toISOString();
                                history.push(o);
                            });
                            localStorage.setItem('withu_completed_orders', JSON.stringify(history));
                            
                            // Re-render history if we are currently looking at it
                            if (typeof window.renderHistory === 'function') window.renderHistory();
                        }
                    }
                    if (typeof showToast === 'function') showToast('เคลียร์ออเดอร์เรียบร้อย', 'success');
                }
                
                const payload = {action, apiKey: API_KEY, ...params};
                await fetch(API_URL, {method:'POST', mode:'no-cors', body:JSON.stringify(payload)}); 
                refresh(); 
            } catch(e) { 
                console.error(e); 
            } 
        }`;

if (html.includes('async function actionCall(action, params) { \r\n            try { \r\n                const payload = {action, apiKey: API_KEY, ...params};\r\n                await fetch(API_URL, {method:\'POST\', mode:\'no-cors\', body:JSON.stringify(payload)}); \r\n                refresh(); \r\n            } catch(e) { \r\n                console.error(e); \r\n            } \r\n        }')) {
    html = html.replace('async function actionCall(action, params) { \r\n            try { \r\n                const payload = {action, apiKey: API_KEY, ...params};\r\n                await fetch(API_URL, {method:\'POST\', mode:\'no-cors\', body:JSON.stringify(payload)}); \r\n                refresh(); \r\n            } catch(e) { \r\n                console.error(e); \r\n            } \r\n        }', newActionCall);
} else if (html.includes('async function actionCall(action, params) { \n            try { \n                const payload = {action, apiKey: API_KEY, ...params};\n                await fetch(API_URL, {method:\'POST\', mode:\'no-cors\', body:JSON.stringify(payload)}); \n                refresh(); \n            } catch(e) { \n                console.error(e); \n            } \n        }')) {
    html = html.replace('async function actionCall(action, params) { \n            try { \n                const payload = {action, apiKey: API_KEY, ...params};\n                await fetch(API_URL, {method:\'POST\', mode:\'no-cors\', body:JSON.stringify(payload)}); \n                refresh(); \n            } catch(e) { \n                console.error(e); \n            } \n        }', newActionCall);
} else {
    // Regex fallback
    html = html.replace(/async function actionCall\(action, params\) \{\s*try \{\s*const payload = \{action, apiKey: API_KEY, \.\.\.params\};\s*await fetch\(API_URL, \{method:'POST', mode:'no-cors', body:JSON\.stringify\(payload\)\}\);\s*refresh\(\);\s*\} catch\(e\) \{\s*console\.error\(e\);\s*\}\s*\}/, newActionCall);
}


fs.writeFileSync('d:/withu/withU/admin.html', html, 'utf8');
console.log('Fixed bugs successfully!');
