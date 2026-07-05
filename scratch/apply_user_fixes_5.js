const fs = require('fs');

function replaceEmojis(text) {
    // Top stat cards emojis to SVG
    text = text.replace(/{ id: 'stat-card-0', icon: '📊',/g, `{ id: 'stat-card-0', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>',`);
    text = text.replace(/{ id: 'stat-card-1', icon: '💰',/g, `{ id: 'stat-card-1', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>',`);
    text = text.replace(/{ id: 'stat-card-2', icon: '⏱️',/g, `{ id: 'stat-card-2', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',`);
    text = text.replace(/{ id: 'stat-card-3', icon: '📋',/g, `{ id: 'stat-card-3', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>',`);

    // Settings emojis
    text = text.replace(/✅/g, `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px;"><polyline points="20 6 9 17 4 12"></polyline></svg>`);
    text = text.replace(/⏸️/g, `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px;"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`);
    text = text.replace(/🔴/g, `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px;"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`);
    text = text.replace(/🌅/g, `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;color:#f59e0b;margin-right:6px;"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`);
    text = text.replace(/🌙/g, `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;color:#6366f1;margin-right:6px;"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`);
    
    // Sound settings
    text = text.replace(/<div class="prem-section-icon yellow">🔔<\/div>/g, `<div class="prem-section-icon yellow"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg></div>`);
    text = text.replace(/🔊 เปิด\/ปิด เสียงแจ้งเตือน/g, `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px;"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg> เปิด/ปิด เสียงแจ้งเตือน`);
    
    // Save settings button
    text = text.replace(/💾 บันทึกเวลาทำการ/g, `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px;"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> บันทึกเวลาทำการ`);
    text = text.replace(/💾 บันทึกสมาชิก/g, `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px;"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> บันทึกสมาชิก`);
    text = text.replace(/🔍 ค้นหาสมาชิก/g, `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> ค้นหาสมาชิก`);
    text = text.replace(/✕ ล้างข้อมูล/g, `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> ล้างข้อมูล`);
    
    return text;
}

function processAdmin() {
    let admin = fs.readFileSync('d:/withu/withU/admin.html', 'utf8');
    
    admin = replaceEmojis(admin);
    
    // showToast fix
    if (!admin.includes('window.showToast = function(')) {
        const toastFn = `
<script id="toast-injector">
window.showToast = function(msg, type) {
    var c = document.getElementById('toast-container');
    if(!c) { c = document.createElement('div'); c.id = 'toast-container'; c.className = 'toast-container'; document.body.appendChild(c); }
    var t = document.createElement('div');
    t.className = 'toast toast-' + (type || 'info');
    t.style.cssText = 'background:'+(type==='error'?'#ef4444':(type==='new'?'#3b82f6':(type==='success'?'#10b981':'#333')))+';color:#fff;padding:12px 24px;border-radius:8px;font-family:Prompt,sans-serif;font-weight:600;font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,0.15);animation:slideUpFade 0.3s ease-out; margin-bottom:10px;';
    t.innerHTML = msg;
    c.appendChild(t);
    setTimeout(function(){ t.style.opacity='0'; t.style.transition='opacity 0.3s ease'; setTimeout(function(){if(t.parentNode)t.parentNode.removeChild(t);},300); }, 3000);
};
</script>
</body>`;
        admin = admin.replace('</body>', toastFn);
    }
    
    // Fix toast strings
    admin = admin.replace(/showToast\\('Business hours saved', 'new'\\)/g, "showToast('บันทึกเวลาทำการสำเร็จ', 'success')");
    admin = admin.replace(/var msgs = { 'open': 'Store OPEN', 'advance': 'Store PAUSED', 'closed': 'Store CLOSED' };/g, "var msgs = { 'open': 'เปิดร้านรับออเดอร์แล้ว', 'advance': 'ปิดรับออเดอร์ล่วงหน้าสำเร็จ', 'closed': 'ปิดร้านประจำวันสำเร็จ' };");
    admin = admin.replace(/showToast\\(msgs\\[status\\], 'new'\\);/g, "showToast(msgs[status], 'success');");

    // Fix overlapping bug: settings-sec is not hidden by showSec.
    // Replace the exact previous window.showSec logic with one that finds all -sec elements
    const newShowSec = `// === SHOW SECTION OVERRIDE ===
window.showSec = function(n) {
    var main = document.querySelector('.app-main') || document.body;
    var secs = main.querySelectorAll('div[id$="-sec"]');
    secs.forEach(function(el) { el.style.display = 'none'; });
    
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
};`;
    
    if (admin.includes('window.showSec = function(n) {')) {
        admin = admin.replace(/\/\/ === SHOW SECTION OVERRIDE ===[\s\S]*?};\s*\/\/ === AUTO-SYNC ===/m, newShowSec + '\\n\\n// === AUTO-SYNC ===');
    }

    // Fix history local override logic
    // We want to combine local and remote history if possible, or at least prefer local if remote is empty
    admin = admin.replace(/if \\(window\\.fullData && window\\.fullData\\.history\\) \\{/g, "if (window.fullData && window.fullData.history && window.fullData.history.length > 0) {");

    // To ensure the stat cards at the top show local history if remote analytics is empty or 0:
    // Update the historyItemsCount logic in admin.html refresh()
    admin = admin.replace(
        /let historyItemsCount = rpt\\.reduce\\(function\\(acc, curr\\) \\{ return acc \\+ \\(parseInt\\(curr\\.qty\\) \\|\\| 0\\); \\}, 0\\);/g,
        `let historyItemsCount = rpt.reduce(function(acc, curr) { return acc + (parseInt(curr.qty) || 0); }, 0);
         if (historyItemsCount === 0) {
             try {
                 let lhist = JSON.parse(localStorage.getItem('withu_completed_orders') || '[]');
                 let qty = lhist.reduce(function(a, c) {
                     return a + (c.items||[]).reduce(function(a2, i) { return a2 + (parseInt(i.qty)||0); }, 0) + (parseInt(c.qty)||0);
                 }, 0);
                 historyItemsCount = qty;
                 if (rev === 0) {
                     rev = lhist.reduce(function(a, c) { return a + (parseFloat(c.total||c.finalTotal)||0); }, 0);
                 }
             } catch(e) {}
         }`
    );

    fs.writeFileSync('d:/withu/withU/admin.html', admin);
    console.log("Admin fixed!");
}

function processFrontend(file) {
    let html = fs.readFileSync(file, 'utf8');
    html = replaceEmojis(html);
    
    // Fix Store Closed overlay emojis in frontend
    html = html.replace(/if \\(icon\\) icon\\.textContent = '🌙';/g, `if (icon) icon.innerHTML = '<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#6366f1;"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';`);
    html = html.replace(/if \\(icon\\) icon\\.textContent = '⏸️';/g, `if (icon) icon.innerHTML = '<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#f59e0b;"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>';`);
    html = html.replace(/if \\(icon\\) icon\\.textContent = '🕒';/g, `if (icon) icon.innerHTML = '<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#64748b;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>';`);
    html = html.replace(/<div id="store-closed-icon" class="store-closed-icon">⏸️<\/div>/g, `<div id="store-closed-icon" class="store-closed-icon"></div>`);
    
    fs.writeFileSync(file, html);
    console.log(file + " fixed!");
}

processAdmin();
processFrontend('d:/withu/withU/index.html');
processFrontend('d:/withu/withU/delivery.html');
