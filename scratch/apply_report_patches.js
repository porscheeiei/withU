const fs = require('fs');

let html = fs.readFileSync('admin.html', 'utf8');

const reportInjectJS = `
<script id="withu-report-revamp">
document.addEventListener('DOMContentLoaded', () => {
    const reportSec = document.getElementById('report-sec');
    if (reportSec) {
        reportSec.innerHTML = \`
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="font-size: 24px; font-weight: 800;"><i class="fas fa-chart-bar"></i> รายงานยอดขายและประวัติ</h2>
                <div style="display: flex; gap: 10px;">
                    <button class="btn-outline" onclick="switchReportTab('dashboard')" id="rtab-dashboard" style="border-color: #3b82f6; color: #3b82f6; background: rgba(59,130,246,0.1);"><i class="fas fa-chart-pie"></i> ภาพรวม</button>
                    <button class="btn-outline" onclick="switchReportTab('history')" id="rtab-history"><i class="fas fa-history"></i> ประวัติการขาย</button>
                </div>
            </div>
            <div id="report-dashboard">
                <div style="display: flex; gap: 10px; margin-bottom: 20px; overflow-x: auto; padding-bottom: 5px;">
                    <button class="btn-black" onclick="renderReport('1d')" style="flex: 1; min-width: 80px; background: #3b82f6;">1 วัน</button>
                    <button class="btn-black" onclick="renderReport('7d')" style="flex: 1; min-width: 80px; background: var(--text-main);">7 วัน</button>
                    <button class="btn-black" onclick="renderReport('30d')" style="flex: 1; min-width: 80px; background: var(--text-main);">1 เดือน</button>
                    <button class="btn-black" onclick="renderReport('all')" style="flex: 1; min-width: 80px; background: var(--text-main);">ทั้งหมด</button>
                </div>
                <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
                    <div class="ai-card"><p style="font-size: 12px; color: var(--text-muted); font-weight: 700;">ยอดขายรวม</p><p style="font-size: 24px; font-weight: 800; color: #3b82f6;">฿<span id="rep-total">0</span></p></div>
                    <div class="ai-card"><p style="font-size: 12px; color: var(--text-muted); font-weight: 700;">จำนวนออเดอร์</p><p style="font-size: 24px; font-weight: 800;" id="rep-count">0</p></div>
                    <div class="ai-card"><p style="font-size: 12px; color: var(--text-muted); font-weight: 700;">เมนูขายดีที่สุด</p><p style="font-size: 16px; font-weight: 800; margin-top: 5px;" id="rep-top-menu">-</p></div>
                </div>
                <div class="ai-card" style="width: 100%; overflow-x: auto;">
                    <h3 style="font-size: 14px; margin-bottom: 15px;"><i class="fas fa-chart-line"></i> กราฟยอดขาย</h3>
                    <div style="min-width: 600px; height: 300px;"><canvas id="salesChart"></canvas></div>
                </div>
            </div>
            <div id="report-history" style="display: none;">
                <div class="ai-card" style="padding: 0; border:none; box-shadow:none; background:transparent;">
                    <div style="overflow-x: auto;">
                        <table class="report-table" style="min-width: 800px; width: 100%;">
                            <thead><tr><th>เวลา</th><th>รหัสออเดอร์</th><th>โต๊ะ/ช่องทาง</th><th>ยอดรวม</th><th>การชำระเงิน</th><th>จัดการ</th></tr></thead>
                            <tbody id="history-list"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        \`;
    }
    
    // Revamp Manual Order Modal
    const moModal = document.getElementById('manual-order-modal');
    if (moModal) {
        moModal.innerHTML = \`
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
        \`;
    }
});

let salesChartInstance = null;
window.switchReportTab = function(tab) {
    const dEl = document.getElementById('report-dashboard');
    const hEl = document.getElementById('report-history');
    if (dEl) dEl.style.display = tab === 'dashboard' ? 'block' : 'none';
    if (hEl) hEl.style.display = tab === 'history' ? 'block' : 'none';
    
    const dbBtn = document.getElementById('rtab-dashboard');
    const hBtn = document.getElementById('rtab-history');
    if (dbBtn) dbBtn.style.cssText = tab === 'dashboard' ? 'border-color: #3b82f6; color: #3b82f6; background: rgba(59,130,246,0.1);' : 'border-color: var(--border); color: var(--text-main); background: transparent;';
    if (hBtn) hBtn.style.cssText = tab === 'history' ? 'border-color: #3b82f6; color: #3b82f6; background: rgba(59,130,246,0.1);' : 'border-color: var(--border); color: var(--text-main); background: transparent;';
    
    if (tab === 'dashboard') {
        renderReport('1d'); 
    } else {
        renderHistory();
    }
};

window.renderReport = function(period) {
    const dEl = document.getElementById('report-dashboard');
    if(dEl) {
        const btns = dEl.querySelectorAll('.btn-black');
        const pMap = {'1d': 0, '7d': 1, '30d': 2, 'all': 3};
        btns.forEach((b, i) => {
            b.style.background = i === pMap[period] ? '#3b82f6' : 'var(--text-main)';
        });
    }

    const dataStr = localStorage.getItem('withu_completed_orders') || '[]';
    let orders = [];
    try { orders = JSON.parse(dataStr); } catch(e) {}
    
    const now = new Date();
    const fOrders = orders.filter(o => {
        if (!o.timestamp) return false;
        const oDate = new Date(o.timestamp);
        const diffTime = Math.abs(now - oDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (period === '1d') return diffDays <= 1 && oDate.getDate() === now.getDate();
        if (period === '7d') return diffDays <= 7;
        if (period === '30d') return diffDays <= 30;
        return true; 
    });
    
    let totalSales = 0;
    const itemCounts = {};
    const salesByDate = {};

    fOrders.forEach(o => {
        const amt = o.total || o.finalTotal || 0;
        totalSales += amt;
        if (o.cart) {
            o.cart.forEach(item => { itemCounts[item.name] = (itemCounts[item.name] || 0) + (item.qty || 1); });
        }
        const dateKey = new Date(o.timestamp).toLocaleDateString('th-TH');
        salesByDate[dateKey] = (salesByDate[dateKey] || 0) + amt;
    });

    const totEl = document.getElementById('rep-total'); if(totEl) totEl.innerText = totalSales.toLocaleString();
    const countEl = document.getElementById('rep-count'); if(countEl) countEl.innerText = fOrders.length;
    const topItem = Object.entries(itemCounts).sort((a, b) => b[1] - a[1])[0];
    const topEl = document.getElementById('rep-top-menu'); if(topEl) topEl.innerText = topItem ? \`\${topItem[0]} (\${topItem[1]})\` : '-';

    const chartLabels = Object.keys(salesByDate);
    const chartData = Object.values(salesByDate);

    const ctx = document.getElementById('salesChart');
    if (ctx && window.Chart) {
        if (salesChartInstance) salesChartInstance.destroy();
        salesChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartLabels.length ? chartLabels : ['-'],
                datasets: [{
                    label: 'ยอดขาย (บาท)',
                    data: chartData.length ? chartData : [0],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59,130,246,0.2)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }
};

window.renderHistory = function() {
    const dataStr = localStorage.getItem('withu_completed_orders') || '[]';
    let orders = [];
    try { orders = JSON.parse(dataStr); } catch(e) {}
    orders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    const list = document.getElementById('history-list');
    if(!list) return;
    list.innerHTML = '';
    
    if(orders.length === 0) {
        list.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:20px;">ไม่มีข้อมูลประวัติการขาย</td></tr>';
        return;
    }

    orders.forEach((o, i) => {
        const date = new Date(o.timestamp).toLocaleString('th-TH');
        list.innerHTML += \`
            <tr>
                <td style="font-size: 12px; color: var(--text-muted);">\${date}</td>
                <td style="font-weight: 700;">#\${o.id || o.orderNo || (1000+i)}</td>
                <td>\${o.table || 'Takeaway'}</td>
                <td style="color: #10b981; font-weight: 800;">฿\${(o.total || o.finalTotal || 0).toLocaleString()}</td>
                <td>\${o.paymentMethod === 'qr' ? 'PROMPTPAY' : 'CASH'}</td>
                <td><button class="btn-outline" onclick="viewHistoryDetail('\${o.id || i}')" style="padding: 5px 10px;"><i class="fas fa-eye"></i></button></td>
            </tr>
        \`;
    });
};

window.viewHistoryDetail = function(id) {
    if (typeof showToast === 'function') showToast('ฟีเจอร์ดูรายละเอียดออเดอร์ย้อนหลังกำลังมาเร็วๆ นี้', 'new');
};

let manualCart = [];
window.openManualOrderModal = function(targetTable = null) {
    manualCart = [];
    const modal = document.getElementById('manual-order-modal');
    if (modal) {
        modal.style.display = 'flex';
        const sel = document.getElementById('mo-table');
        if (targetTable && sel) {
            let found = false;
            for(let i=0; i<sel.options.length; i++) {
                if(sel.options[i].value === targetTable) { found = true; sel.selectedIndex = i; break; }
            }
            if(!found) {
                const opt = document.createElement('option');
                opt.value = targetTable; opt.text = targetTable;
                sel.add(opt); sel.value = targetTable;
            }
        } else if (sel) {
            sel.value = 'Takeaway';
        }
        renderMoMenu();
        renderMoCart();
    }
};

window.renderMoMenu = function() {
    const list = document.getElementById('mo-menu-list');
    if(list) list.innerHTML = '<div style="padding: 15px; text-align: center; color: var(--text-muted);">ระบบค้นหาและดึงข้อมูลเมนูจะแสดงที่นี่</div>';
};
window.filterMoItems = function() {};
window.renderMoCart = function() {
    const list = document.getElementById('mo-cart-list');
    if(list) list.innerHTML = manualCart.length ? manualCart.map((item, i) => \`<div style="display:flex; justify-content:space-between; margin-bottom:5px;"><span>\${item.name} x\${item.qty}</span><span>฿\${item.total} <button onclick="manualCart.splice(\${i},1); renderMoCart();" style="color:#ef4444; border:none; background:none; cursor:pointer;"><i class="fas fa-trash"></i></button></span></div>\`).join('') : '<div style="color: var(--text-muted); text-align: center;">ไม่มีรายการ</div>';
    const total = manualCart.reduce((s, i) => s + i.total, 0);
    const totalEl = document.getElementById('mo-total'); if(totalEl) totalEl.innerText = total;
    const countEl = document.getElementById('mo-cart-count'); if(countEl) countEl.innerText = manualCart.length;
};
window.submitManualOrder = function() {
    if (!manualCart.length) {
        if (typeof showToast === 'function') showToast('กรุณาเลือกเมนู', 'call');
        return;
    }
    const tableEl = document.getElementById('mo-table');
    const table = tableEl ? tableEl.value : 'Takeaway';
    if (typeof showToast === 'function') showToast('เพิ่มออเดอร์ ' + table + ' สำเร็จ', 'new');
    const modal = document.getElementById('manual-order-modal');
    if(modal) modal.style.display = 'none';
};
</script>
`;

if (!html.includes('id="withu-report-revamp"')) {
    html = html.replace('</body>', reportInjectJS + '\n</body>');
}

fs.writeFileSync('admin.html', html, 'utf8');
console.log('Applied report patches to admin.html');
