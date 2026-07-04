const fs = require('fs');
let html = fs.readFileSync('d:/withu/withU/admin.html', 'utf8');

// Update loadPoints to use 'points-list-body'
html = html.replace("var list = document.getElementById('points-list');", "var list = document.getElementById('points-list-body') || document.getElementById('points-list');");

// Update savePointData to use new inputs
const newSave = `window.savePointData = async function() {
    var pInput = document.getElementById('pts-phone') || document.getElementById('point-phone-input');
    var phone = (pInput || {}).value;
    if(!phone || !phone.trim()) { if(typeof showToast==='function') showToast('กรุณากรอกเบอร์โทร','error'); return; }
    phone = phone.trim();
    
    if (FIREBASE_POINTS_URL.includes('your-project-id')) {
        if(typeof showToast==='function') showToast('ยังไม่ได้ตั้งค่า Firebase URL', 'error');
        return;
    }
    
    var vInput = document.getElementById('pts-val') || document.getElementById('point-val-input');
    var points = parseInt((vInput || {}).value)||0;
    
    var nInput = document.getElementById('pts-name');
    var name = nInput ? nInput.value.trim() : '-';
    
    if(pInput) pInput.value = '';
    if(nInput) nInput.value = '';
    if(vInput) vInput.value = '';
    
    if(typeof showToast==='function') showToast('กำลังส่งข้อมูลไป Firebase...','new');
    
    const updateUrl = FIREBASE_POINTS_URL.replace('.json', '/' + phone + '.json');
    
    try {
        await fetch(updateUrl, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name, points: points })
        });
        if(typeof showToast==='function') showToast('บันทึกแต้มลง Firebase สำเร็จ!','success');
        window.loadPoints(); 
    } catch(e) {
        console.error("Firebase Save Error:", e);
        if(typeof showToast==='function') showToast('บันทึกข้อมูลล้มเหลว', 'error');
    }
};`;

html = html.replace(/window\.savePointData = async function\(\) \{[\s\S]*?\}\s*;/g, newSave + '\n;');
html = html.replace('onclick="savePoint()"', 'onclick="window.savePointData()"');

fs.writeFileSync('d:/withu/withU/admin.html', html, 'utf8');
console.log('Fixed IDs for points system');
