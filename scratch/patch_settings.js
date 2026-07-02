const fs = require('fs');
let html = fs.readFileSync('d:/withu/withU/admin.html', 'utf8');

// 1. Replace the old settings-sec generation with a modernized one
const oldSettingsMatch = html.match(/if \(!document\.getElementById\('settings-sec'\)\) \{[\s\S]*?orderSec\.parentNode\.insertBefore\(div, orderSec\.nextSibling\);\s*\}/);

const newSettingsJS = `if (!document.getElementById('settings-sec')) {
        var orderSec = document.getElementById('order-sec');
        if (orderSec) {
            var div = document.createElement('div');
            div.id = 'settings-sec';
            div.style.cssText = 'display:none; padding:20px;';
            div.innerHTML = '<h2 style="margin-bottom:20px; font-weight:900; font-size:24px; letter-spacing:-0.5px;"><i class="fas fa-cog" style="color:#3b82f6; margin-right:10px;"><\\/i>Store Settings<\\/h2>' +
                '<div class="ai-card" style="margin-bottom:20px; border-left:4px solid #10b981;">' +
                '<h3 style="font-size:16px; margin-bottom:18px; font-weight:800;"><i class="fas fa-clock" style="color:#10b981; margin-right:8px;"><\\/i>Business Hours & Store Status<\\/h3>' +
                
                '<label style="display:flex; align-items:center; gap:12px; font-weight:800; font-size:16px; color:#10b981; margin-bottom:20px; cursor:pointer; background:rgba(16,185,129,0.1); padding:16px; border-radius:12px; border:1px solid rgba(16,185,129,0.2);">' +
                '<input type="checkbox" id="store-open-status" onchange="toggleStoreStatus()" style="width:24px; height:24px; accent-color:#10b981; cursor:pointer;"> ร้านเปิดรับออเดอร์ตามปกติ (Open for Orders)<\\/label>' +
                
                '<div style="font-size:13px; font-weight:700; margin-bottom:12px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px;">Operating Days<\\/div>' +
                '<div id="bh-days" style="display:flex; gap:10px; margin-bottom:20px; flex-wrap:wrap;">' +
                '<label style="cursor:pointer; font-size:13px; background:var(--slate); padding:8px 16px; border-radius:8px; border:1px solid var(--border); display:flex; align-items:center; gap:6px;"><input type="checkbox" value="1" checked style="accent-color:#3b82f6;"> จ.<\\/label>' +
                '<label style="cursor:pointer; font-size:13px; background:var(--slate); padding:8px 16px; border-radius:8px; border:1px solid var(--border); display:flex; align-items:center; gap:6px;"><input type="checkbox" value="2" checked style="accent-color:#3b82f6;"> อ.<\\/label>' +
                '<label style="cursor:pointer; font-size:13px; background:var(--slate); padding:8px 16px; border-radius:8px; border:1px solid var(--border); display:flex; align-items:center; gap:6px;"><input type="checkbox" value="3" checked style="accent-color:#3b82f6;"> พ.<\\/label>' +
                '<label style="cursor:pointer; font-size:13px; background:var(--slate); padding:8px 16px; border-radius:8px; border:1px solid var(--border); display:flex; align-items:center; gap:6px;"><input type="checkbox" value="4" checked style="accent-color:#3b82f6;"> พฤ.<\\/label>' +
                '<label style="cursor:pointer; font-size:13px; background:var(--slate); padding:8px 16px; border-radius:8px; border:1px solid var(--border); display:flex; align-items:center; gap:6px;"><input type="checkbox" value="5" checked style="accent-color:#3b82f6;"> ศ.<\\/label>' +
                '<label style="cursor:pointer; font-size:13px; background:var(--slate); padding:8px 16px; border-radius:8px; border:1px solid var(--border); display:flex; align-items:center; gap:6px;"><input type="checkbox" value="6" checked style="accent-color:#3b82f6;"> ส.<\\/label>' +
                '<label style="cursor:pointer; font-size:13px; background:var(--slate); padding:8px 16px; border-radius:8px; border:1px solid var(--border); display:flex; align-items:center; gap:6px;"><input type="checkbox" value="0" checked style="accent-color:#3b82f6;"> อา.<\\/label>' +
                '<\\/div>' +
                
                '<div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:20px;">' +
                '<div><label style="font-weight:700; display:block; margin-bottom:8px; font-size:12px; color:var(--text-muted);">เวลาเปิด (Open)<\\/label><input type="time" id="bh-start" value="09:00" style="width:100%; padding:12px; border-radius:8px; border:1px solid var(--border); background:var(--slate); font-size:15px; font-weight:600;"><\\/div>' +
                '<div><label style="font-weight:700; display:block; margin-bottom:8px; font-size:12px; color:var(--text-muted);">เวลาปิด (Close)<\\/label><input type="time" id="bh-end" value="21:00" style="width:100%; padding:12px; border-radius:8px; border:1px solid var(--border); background:var(--slate); font-size:15px; font-weight:600;"><\\/div>' +
                '<\\/div>' +
                '<button class="btn-black" onclick="saveBusinessHours()" style="background:linear-gradient(135deg, #10b981, #059669); padding:14px; width:auto; min-width:200px;"><i class="fas fa-save" style="margin-right:8px;"><\\/i>บันทึกเวลาทำการ<\\/button>' +
                '<\\/div>' +
                
                '<div class="ai-card" style="border-left:4px solid #3b82f6;">' +
                '<h3 style="font-size:16px; margin-bottom:14px; font-weight:800;"><i class="fas fa-volume-up" style="color:#3b82f6; margin-right:8px;"><\\/i>Sound Alerts<\\/h3>' +
                '<button id="btn-sound-setting" onclick="window.toggleSound()" class="btn-outline" style="width:100%; border-color:#3b82f6; color:#3b82f6; padding:15px; font-weight:800; max-width:300px;"><i class="fas fa-volume-up" style="margin-right:8px;"><\\/i>เปิด/ปิด เสียงแจ้งเตือน<\\/button>' +
                '<\\/div>';
            orderSec.parentNode.insertBefore(div, orderSec.nextSibling);
        }
    }`;

if (oldSettingsMatch) {
    html = html.replace(oldSettingsMatch[0], newSettingsJS);
} else {
    console.log("Could not find old settings JS injection block!");
}

// 2. Add loadBusinessHours to window.loadSettings block
const loadSettingsMatch = html.match(/window\.loadSettings = function\(\) \{[\s\S]*?\};/);
const loadSettingsEnhancement = `window.loadSettings = function() {
    var cb = document.getElementById('store-open-status');
    if(cb) cb.checked = localStorage.getItem('withu_store_open') !== 'false';
    window.loadBusinessHours();
};

window.loadBusinessHours = function() {
    var bh = localStorage.getItem('withu_business_hours');
    if (bh) {
        try {
            var data = JSON.parse(bh);
            if (data.start) document.getElementById('bh-start').value = data.start;
            if (data.end) document.getElementById('bh-end').value = data.end;
            if (data.days && Array.isArray(data.days)) {
                var cbs = document.querySelectorAll('#bh-days input[type="checkbox"]');
                cbs.forEach(cb => { cb.checked = data.days.includes(parseInt(cb.value)); });
            }
        } catch(e) {}
    }
};`;

if (loadSettingsMatch) {
    html = html.replace(loadSettingsMatch[0], loadSettingsEnhancement);
} else {
    // If we can't find loadSettings, maybe it was modified. Let's just append it before </script>
    html = html.replace(/<\/script>\s*<span style="background:rgba\(59,130,246,0\.08\)/, loadSettingsEnhancement + '\n</script>\n<span style="background:rgba(59,130,246,0.08)');
}

fs.writeFileSync('d:/withu/withU/admin.html', html, 'utf8');
console.log('Settings UI & Logic Mod Applied!');
