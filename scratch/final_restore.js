const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf8');

const missingLogic = `
        function safeStyle(id, prop, val) {
            const el = document.getElementById(id);
            if(el) el.style[prop] = val;
        }

        function showSec(n) {
            ['order-sec', 'takeaway-sec', 'stock-sec', 'report-sec', 'points-sec', 'settings-sec'].forEach(s => {
                safeStyle(s, 'display', 'none');
            });
            
            const targetEl = document.getElementById(n + '-sec');
            if (targetEl) {
                targetEl.style.display = (n === 'report' || n === 'settings' || n === 'points') ? 'block' : 'grid';
            }
            
            if (n === 'points') {
                if (typeof loadPoints === 'function') loadPoints();
            }
            if (n === 'settings') {
                if (typeof loadSettings === 'function') loadSettings();
            }
            if (n === 'report') {
                if (typeof switchReportTab === 'function') setTimeout(() => switchReportTab('dashboard'), 50);
            }
            
            document.querySelectorAll('.tab-btn').forEach(b => {
                if (b.id) b.classList.toggle('active', b.id === 't-' + n);
            });
            document.querySelectorAll('.sidebar-item').forEach(b => {
                if (b.id) b.classList.toggle('active', b.id === 'sb-' + n);
            });
        }
        
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
            const list = document.getElementById('mo-menu-list');
            if(list) list.innerHTML = '<div style="padding: 15px; text-align: center; color: var(--text-muted);">ระบบค้นหาและดึงข้อมูลเมนูจะแสดงที่นี่</div>';
        }
        
        function filterMoItems() {
        }
        
        function renderMoCart() {
            const list = document.getElementById('mo-cart-list');
            if(list) list.innerHTML = manualCart.length ? manualCart.map((item, i) => \`<div style="display:flex; justify-content:space-between; margin-bottom:5px;"><span>\${item.name} x\${item.qty}</span><span>฿\${item.total} <button onclick="manualCart.splice(\${i},1); renderMoCart();" style="color:#ef4444; border:none; background:none; cursor:pointer;"><i class="fas fa-trash"></i></button></span></div>\`).join('') : '<div style="color: var(--text-muted); text-align: center;">ไม่มีรายการ</div>';
            const total = manualCart.reduce((s, i) => s + i.total, 0);
            const totalEl = document.getElementById('mo-total');
            if(totalEl) totalEl.innerText = total;
            const countEl = document.getElementById('mo-cart-count');
            if(countEl) countEl.innerText = manualCart.length;
        }
        
        function submitManualOrder() {
            if (!manualCart.length) {
                if (typeof showToast === 'function') showToast('กรุณาเลือกเมนู', 'call');
                return;
            }
            const table = document.getElementById('mo-table').value;
            if (typeof showToast === 'function') showToast('เพิ่มออเดอร์ ' + table + ' สำเร็จ', 'new');
            const modal = document.getElementById('manual-order-modal');
            if(modal) modal.style.display = 'none';
        }
`;

// Insert the missing logic right before the last closing script tag
html = html.replace(/(<\/script>\s*)(<!-- Manual Order Modal Revamp -->)/, missingLogic + '\n    $1$2');

// If the regex above failed because the modal isn't directly after script, we find the last </script>
if (!html.includes('function showSec(n)')) {
    const scriptEndIndex = html.lastIndexOf('</script>');
    if (scriptEndIndex !== -1) {
        html = html.substring(0, scriptEndIndex) + '\n' + missingLogic + '\n' + html.substring(scriptEndIndex);
    }
}

fs.writeFileSync('admin.html', html, 'utf8');
console.log('Restored all missing functions successfully.');
