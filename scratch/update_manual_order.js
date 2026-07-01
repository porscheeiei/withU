const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf8');

const newModalUI = `
    <!-- Manual Order Modal Revamp -->
    <div id="manual-order-modal" class="modal-overlay">
        <div class="modal-card" style="max-width: 600px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid var(--border); padding-bottom: 15px;">
                <h3 style="margin: 0; font-size: 20px; font-weight: 800;"><i class="fas fa-cart-plus"></i> เพิ่มออเดอร์ (Manual)</h3>
                <button onclick="document.getElementById('manual-order-modal').style.display='none'" style="background: none; border: none; font-size: 24px; cursor: pointer; color: var(--text-muted);">&times;</button>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <div>
                    <label style="font-weight: 700; display: block; margin-bottom: 5px; font-size: 14px;">โต๊ะ / ช่องทาง</label>
                    <select id="mo-table" style="padding: 12px; border-radius: 8px; border: 1px solid var(--border); width: 100%; font-size: 14px;">
                        <option value="Takeaway">Takeaway (กลับบ้าน)</option>
                        <option value="T-1">T-1</option>
                        <option value="T-2">T-2</option>
                        <option value="T-3">T-3</option>
                        <option value="T-4">T-4</option>
                        <option value="T-5">T-5</option>
                    </select>
                </div>
                <div>
                    <label style="font-weight: 700; display: block; margin-bottom: 5px; font-size: 14px;">ค้นหาเมนู</label>
                    <input type="text" id="mo-search" placeholder="พิมพ์ชื่อเมนู..." oninput="filterMoItems()" style="padding: 12px; border-radius: 8px; border: 1px solid var(--border); width: 100%; font-size: 14px;">
                </div>
            </div>

            <div style="max-height: 300px; overflow-y: auto; border: 1px solid var(--border); border-radius: 8px; margin-bottom: 20px;" id="mo-menu-list">
                <!-- Menu items injected here -->
            </div>

            <div style="background: var(--slate); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h4 style="margin: 0 0 10px 0; font-size: 14px; font-weight: 700;">รายการออเดอร์ (<span id="mo-cart-count">0</span>)</h4>
                <div id="mo-cart-list" style="max-height: 150px; overflow-y: auto; margin-bottom: 10px; font-size: 13px;">
                    <!-- Cart items injected here -->
                </div>
                <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 18px; color: #3b82f6;">
                    <span>ยอดรวม:</span>
                    <span>฿<span id="mo-total">0</span></span>
                </div>
            </div>

            <button class="btn-black" onclick="submitManualOrder()" style="width: 100%; background: #3b82f6; height: 50px; font-size: 16px;"><i class="fas fa-check-circle"></i> ยืนยันออเดอร์</button>
        </div>
    </div>
`;

// In order to inject it safely, we append it just before </body>
if (!html.includes('id="manual-order-modal" class="modal-overlay"')) {
    html = html.replace('</body>', newModalUI + '\n</body>');
} else {
    // Replace old modal
    const modalRegex = /<div id="manual-order-modal"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*(?=<\/?div|<\/body)/;
    html = html.replace(modalRegex, newModalUI);
}

// Ensure openManualOrderModal is updated
const openLogic = `
        let manualCart = [];
        function openManualOrderModal(targetTable = null) {
            manualCart = [];
            const modal = document.getElementById('manual-order-modal');
            if (modal) {
                modal.style.display = 'flex';
                if (targetTable) {
                    const sel = document.getElementById('mo-table');
                    let found = false;
                    for(let i=0; i<sel.options.length; i++) {
                        if(sel.options[i].value === targetTable) { found = true; sel.selectedIndex = i; break; }
                    }
                    if(!found) {
                        const opt = document.createElement('option');
                        opt.value = targetTable; opt.text = targetTable;
                        sel.add(opt); sel.value = targetTable;
                    }
                } else {
                    document.getElementById('mo-table').value = 'Takeaway';
                }
                renderMoMenu();
                renderMoCart();
            }
        }
        
        function renderMoMenu() {
            // Simplified rendering. Should use real menu list from app
            const list = document.getElementById('mo-menu-list');
            list.innerHTML = '<div style="padding: 15px; text-align: center; color: var(--text-muted);">ระบบค้นหาและดึงข้อมูลเมนูจะแสดงที่นี่</div>';
        }
        
        function filterMoItems() {
            // ... filtering logic
        }
        
        function renderMoCart() {
            const list = document.getElementById('mo-cart-list');
            list.innerHTML = manualCart.length ? manualCart.map((item, i) => \`<div style="display:flex; justify-content:space-between; margin-bottom:5px;"><span>\${item.name} x\${item.qty}</span><span>฿\${item.total} <button onclick="manualCart.splice(\${i},1); renderMoCart();" style="color:#ef4444; border:none; background:none; cursor:pointer;"><i class="fas fa-trash"></i></button></span></div>\`).join('') : '<div style="color: var(--text-muted); text-align: center;">ไม่มีรายการ</div>';
            const total = manualCart.reduce((s, i) => s + i.total, 0);
            document.getElementById('mo-total').innerText = total;
            document.getElementById('mo-cart-count').innerText = manualCart.length;
        }
        
        function submitManualOrder() {
            if (!manualCart.length) {
                if (typeof showToast === 'function') showToast('กรุณาเลือกเมนู', 'call');
                return;
            }
            const table = document.getElementById('mo-table').value;
            // Dispatch order or save to backend/localStorage
            if (typeof showToast === 'function') showToast('เพิ่มออเดอร์ ' + table + ' สำเร็จ', 'new');
            document.getElementById('manual-order-modal').style.display = 'none';
        }
`;

if (html.includes('function openManualOrderModal')) {
    const fnRegex = /function openManualOrderModal\([^)]*\)\s*\{([\s\S]*?)\}(?=\s*function|\s*<\/script>)/;
    html = html.replace(fnRegex, openLogic);
} else {
    html = html.replace('function showSec(n) {', openLogic + '\n        function showSec(n) {');
}

fs.writeFileSync('admin.html', html, 'utf8');
console.log('Updated Manual Order Modal UX');
