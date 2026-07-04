const fs = require('fs');
let html = fs.readFileSync('d:/withu/withU/admin.html', 'utf8');

const newDel = `window.deletePoint = async function(phone) {
    if(!confirm('ต้องการลบข้อมูลของเบอร์ ' + phone + ' ใช่หรือไม่?')) return;
    if(typeof showToast==='function') showToast('กำลังลบข้อมูล...', 'new');
    const delUrl = FIREBASE_POINTS_URL.replace('.json', '/' + phone + '.json');
    try {
        await fetch(delUrl, { method: 'DELETE' });
        if(typeof showToast==='function') showToast('ลบสำเร็จ', 'success');
        window.loadPoints();
    } catch(e) {
        if(typeof showToast==='function') showToast('ลบล้มเหลว', 'error');
    }
}`;

html = html.replace(/function deletePoint\(phone\) \{[\s\S]*?\n\s*\}/g, newDel);

fs.writeFileSync('d:/withu/withU/admin.html', html, 'utf8');
