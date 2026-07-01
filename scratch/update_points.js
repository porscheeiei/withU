const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf8');

// 1. Replace the entire points-sec
const newPointsUI = `
    <div id="points-sec" style="display:none; padding:20px;">
        <h2 style="font-size: 24px; font-weight: 800; margin-bottom: 20px;"><i class="fas fa-star"></i> ระบบสมาชิก (แต้ม)</h2>
        
        <div class="ai-card" style="margin-bottom: 20px;">
            <h3 style="font-size: 16px; margin-bottom: 15px;"><i class="fas fa-user-plus"></i> เพิ่ม / แก้ไข ข้อมูลสมาชิก</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
                <input type="tel" id="pts-phone" placeholder="เบอร์โทรศัพท์ (09XXXXXXXX)" style="padding: 10px; border-radius: 6px; border: 1px solid var(--border);">
                <input type="text" id="pts-name" placeholder="ชื่อลูกค้า (ไม่บังคับ)" style="padding: 10px; border-radius: 6px; border: 1px solid var(--border);">
                <input type="number" id="pts-val" placeholder="จำนวนแต้ม" value="0" style="padding: 10px; border-radius: 6px; border: 1px solid var(--border);">
            </div>
            <button class="btn-black" onclick="savePointData()" style="margin-top: 15px; background: #3b82f6;"><i class="fas fa-save"></i> บันทึกข้อมูล</button>
        </div>

        <div style="overflow-x: auto;">
            <table class="report-table" id="points-table" style="min-width: 600px;">
                <thead>
                    <tr>
                        <th>เบอร์โทรศัพท์</th>
                        <th>ชื่อลูกค้า</th>
                        <th>แต้มสะสม</th>
                        <th>จัดการ</th>
                    </tr>
                </thead>
                <tbody id="points-list"></tbody>
            </table>
        </div>
    </div>
`;

// Assuming points-sec ends before settings-sec or report-sec
const secRegex = /<div id="points-sec"[\s\S]*?(?=<div id="settings-sec"|<div id="report-sec"|<\/body>)/;
html = html.replace(secRegex, newPointsUI + '\n    ');

// 2. Replace Javascript logic
const newPointsLogic = `
        function loadPoints() {
            const db = JSON.parse(localStorage.getItem('withu_points_db') || '{}');
            const list = document.getElementById('points-list');
            if(!list) return;
            list.innerHTML = '';
            for (let [phone, data] of Object.entries(db)) {
                // Migrate old string format to object format
                if (typeof data === 'number') {
                    data = { points: data, name: '' };
                    db[phone] = data;
                }
                
                list.innerHTML += \`
                    <tr>
                        <td style="font-weight: 700;">\${phone}</td>
                        <td>\${data.name || '-'}</td>
                        <td style="color: #3b82f6; font-weight: 800;">\${data.points}</td>
                        <td>
                            <button class="btn-outline" onclick="editPointData('\${phone}', '\${data.name}', \${data.points})" style="padding: 5px 10px; border-color: #f59e0b; color: #f59e0b;"><i class="fas fa-edit"></i> แก้ไข</button>
                        </td>
                    </tr>
                \`;
            }
            localStorage.setItem('withu_points_db', JSON.stringify(db)); // Save migrated data
        }

        function editPointData(phone, name, points) {
            document.getElementById('pts-phone').value = phone;
            document.getElementById('pts-name').value = name || '';
            document.getElementById('pts-val').value = points;
        }

        function savePointData() {
            const phone = document.getElementById('pts-phone').value.trim();
            const name = document.getElementById('pts-name').value.trim();
            const points = parseInt(document.getElementById('pts-val').value) || 0;
            
            if (!phone) {
                if(typeof showToast === 'function') showToast('กรุณาระบุเบอร์โทรศัพท์', 'call');
                return;
            }
            
            const db = JSON.parse(localStorage.getItem('withu_points_db') || '{}');
            db[phone] = { points, name };
            localStorage.setItem('withu_points_db', JSON.stringify(db));
            
            document.getElementById('pts-phone').value = '';
            document.getElementById('pts-name').value = '';
            document.getElementById('pts-val').value = '0';
            
            loadPoints();
            if(typeof showToast === 'function') showToast('บันทึกข้อมูลสมาชิกแล้ว', 'new');
        }
`;

// Replace old loadPoints
const logicRegex = /function loadPoints\(\)[\s\S]*?}(?=\s*function|\s*<\/script>)/;
if (html.match(logicRegex)) {
    html = html.replace(logicRegex, newPointsLogic);
} else {
    // Inject if not found
    html = html.replace('function showSec(n) {', newPointsLogic + '\n        function showSec(n) {');
}

fs.writeFileSync('admin.html', html, 'utf8');
console.log('Updated Points System');
