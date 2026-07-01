const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf8');

const businessHoursUI = `
        <div class="ai-card" style="margin-bottom: 20px;">
            <h3 style="font-size: 16px; margin-bottom: 15px;"><i class="fas fa-clock"></i> วันและเวลาทำการ</h3>
            
            <div style="margin-bottom: 15px;">
                <label style="font-weight: 700; display: block; margin-bottom: 10px;">วันที่เปิดขาย</label>
                <div style="display: flex; flex-wrap: wrap; gap: 10px;" id="bh-days">
                    <label><input type="checkbox" value="1" checked> จ</label>
                    <label><input type="checkbox" value="2" checked> อ</label>
                    <label><input type="checkbox" value="3" checked> พ</label>
                    <label><input type="checkbox" value="4" checked> พฤ</label>
                    <label><input type="checkbox" value="5" checked> ศ</label>
                    <label><input type="checkbox" value="6" checked> ส</label>
                    <label><input type="checkbox" value="0" checked> อา</label>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div>
                    <label style="font-weight: 700; display: block; margin-bottom: 5px;">เวลาเปิด</label>
                    <input type="time" id="bh-start" value="09:00">
                </div>
                <div>
                    <label style="font-weight: 700; display: block; margin-bottom: 5px;">เวลาปิด</label>
                    <input type="time" id="bh-end" value="21:00">
                </div>
            </div>
            
            <button class="btn-black" onclick="saveBusinessHours()" style="background: #3b82f6;">บันทึกเวลาทำการ</button>
        </div>
`;

if (!html.includes('bh-days')) {
    html = html.replace('<div class="ai-card" style="margin-bottom: 20px;">\n            <h3 style="font-size: 16px; margin-bottom: 15px;"><i class="fas fa-qrcode">', businessHoursUI + '\n        <div class="ai-card" style="margin-bottom: 20px;">\n            <h3 style="font-size: 16px; margin-bottom: 15px;"><i class="fas fa-qrcode">');
}

const businessHoursLogic = `
        function saveBusinessHours() {
            const days = Array.from(document.querySelectorAll('#bh-days input:checked')).map(cb => parseInt(cb.value));
            const start = document.getElementById('bh-start').value;
            const end = document.getElementById('bh-end').value;
            
            const bh = { days, start, end };
            localStorage.setItem('withu_business_hours', JSON.stringify(bh));
            if (typeof showToast === 'function') {
                showToast('บันทึกเวลาทำการแล้ว', 'new');
            }
        }
        
        function loadBusinessHours() {
            try {
                const bhStr = localStorage.getItem('withu_business_hours');
                if (bhStr) {
                    const bh = JSON.parse(bhStr);
                    document.querySelectorAll('#bh-days input').forEach(cb => {
                        cb.checked = bh.days.includes(parseInt(cb.value));
                    });
                    if (bh.start) document.getElementById('bh-start').value = bh.start;
                    if (bh.end) document.getElementById('bh-end').value = bh.end;
                }
            } catch (e) { console.error(e); }
        }
`;

if (!html.includes('saveBusinessHours()')) {
    html = html.replace('function loadSettings() {', businessHoursLogic + '\n        function loadSettings() {\n            loadBusinessHours();');
}

fs.writeFileSync('admin.html', html, 'utf8');
console.log('Added Business Hours Settings');
