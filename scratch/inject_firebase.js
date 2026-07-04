const fs = require('fs');
let html = fs.readFileSync('d:/withu/withU/admin.html', 'utf8');

const firebaseScript = `
// ==========================================
// FIREBASE POINTS SYSTEM 
// ==========================================
// ลูกค้าต้องเปลี่ยนลิงก์ตรงนี้ให้เป็นลิงก์ Firebase ของตัวเอง (อย่าลืมเติม .json ต่อท้าย)
const FIREBASE_POINTS_URL = "https://your-project-id.firebaseio.com/points.json"; 

window.loadPoints = async function() {
    var list = document.getElementById('points-list');
    if (!list) return;
    
    if (FIREBASE_POINTS_URL.includes('your-project-id')) {
        list.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:30px; color:var(--text-muted);"><b style="color:#ef4444;">⚠️ ยังไม่ได้ตั้งค่า Firebase URL</b><br>กรุณาใส่ลิงก์ Firebase ของคุณในโค้ด (บรรทัด FIREBASE_POINTS_URL)</td></tr>';
        return;
    }
    
    list.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:30px; color:var(--text-muted);">กำลังโหลดข้อมูลจาก Firebase...</td></tr>';
    
    try {
        const res = await fetch(FIREBASE_POINTS_URL);
        const data = await res.json();
        
        var arr = [];
        if (data) {
            arr = Object.keys(data).map(phone => ({
                phone: phone,
                name: data[phone].name || '-',
                points: data[phone].points || 0
            }));
        }
        
        arr.sort((a,b) => b.points - a.points);
        if (!arr.length) {
            list.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:30px; color:var(--text-muted);">ไม่มีข้อมูลสมาชิกใน Firebase</td></tr>';
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
    } catch(e) {
        console.error("Firebase Load Error:", e);
        list.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:30px; color:#ef4444;">โหลดข้อมูลล้มเหลว ตรวจสอบ URL หรือ Rule ใน Firebase</td></tr>';
    }
};

window.savePointData = async function() {
    var phone = (document.getElementById('pts-phone') || {}).value;
    if(!phone || !phone.trim()) { if(typeof showToast==='function') showToast('Enter phone number','call'); return; }
    phone = phone.trim();
    
    if (FIREBASE_POINTS_URL.includes('your-project-id')) {
        if(typeof showToast==='function') showToast('ยังไม่ได้ตั้งค่า Firebase URL', 'error');
        return;
    }
    
    var points = parseInt((document.getElementById('pts-val')||{}).value)||0;
    var name = ((document.getElementById('pts-name')||{}).value||'').trim();
    
    document.getElementById('pts-phone').value = '';
    document.getElementById('pts-name').value = '';
    document.getElementById('pts-val').value = '0';
    
    if(typeof showToast==='function') showToast('กำลังส่งข้อมูลไป Firebase...','new');
    
    // Construct individual update URL (e.g. .../points/0812345678.json)
    const updateUrl = FIREBASE_POINTS_URL.replace('.json', '/' + phone + '.json');
    
    try {
        await fetch(updateUrl, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name, points: points })
        });
        if(typeof showToast==='function') showToast('บันทึกแต้มลง Firebase สำเร็จ!','success');
        window.loadPoints(); // Reload table
    } catch(e) {
        console.error("Firebase Save Error:", e);
        if(typeof showToast==='function') showToast('บันทึกข้อมูลล้มเหลว', 'error');
    }
};
`;

html = html.replace(/window\.loadPoints = function\(\) \{[\s\S]*?\}\s*;/g, '');
html = html.replace(/window\.savePointData = function\(\) \{[\s\S]*?\n\s*\};/g, '');

html = html.replace('// === POINTS SECTION ===', firebaseScript + '\n    // === POINTS SECTION ===');

fs.writeFileSync('d:/withu/withU/admin.html', html, 'utf8');
console.log('Firebase injected!');
