const fs = require('fs');

let html = fs.readFileSync('admin.html', 'utf8');

// The new safe patch logic
const safePatch = `
<!-- WITHU V2 Revamp Styles & Scripts -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<style>
    :root {
        --text-accent: #3b82f6; /* Blue accent */
    }
    .btn-black:hover { background: #3b82f6 !important; border-color: #3b82f6 !important; transition: 0.3s; }
    .tab-btn.active { border-color: #3b82f6 !important; color: #3b82f6 !important; background: rgba(59,130,246,0.1) !important; font-weight: 800; border-bottom: 3px solid #3b82f6; }
    .sidebar-item.active { border-right: 4px solid #3b82f6; background: rgba(59,130,246,0.05); color: #3b82f6; }
    .ai-card { transition: transform 0.2s; }
    .ai-card:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
    /* Enhance Modal */
    .modal-overlay { animation: fadeIn 0.2s ease-out; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>
<script id="withu-revamp-script">
    document.addEventListener('DOMContentLoaded', () => {
        // --- 1. UI/UX REVAMP (Icons) ---
        const replaceIcon = (id, iconHTML, text) => {
            const el = document.getElementById(id);
            if(el) {
                // Ensure the click handler uses toggleSidebar securely
                const onclick = el.getAttribute('onclick') || '';
                el.innerHTML = iconHTML + text;
                // Highlight color logic is handled by CSS .active
            }
        };
        replaceIcon('sb-orders', '<i class="fas fa-store" style="margin-right:12px; font-size:16px;"></i>', 'ออเดอร์หน้าร้าน');
        replaceIcon('sb-takeaway', '<i class="fas fa-motorcycle" style="margin-right:12px; font-size:16px;"></i>', 'เดลิเวอรี่');
        replaceIcon('sb-stock', '<i class="fas fa-box" style="margin-right:12px; font-size:16px;"></i>', 'คลังสินค้า');
        replaceIcon('sb-report', '<i class="fas fa-chart-bar" style="margin-right:12px; font-size:16px;"></i>', 'ผลประกอบการ');
        replaceIcon('sb-points', '<i class="fas fa-star" style="margin-right:12px; font-size:16px;"></i>', 'ระบบสมาชิก (แต้ม)');
        
        // Ensure "Store" and tabs look better
        const tOrders = document.getElementById('t-orders'); if(tOrders) tOrders.innerHTML = '<i class="fas fa-store"></i> Store';
        const tTakeaway = document.getElementById('t-takeaway'); if(tTakeaway) tTakeaway.innerHTML = '<i class="fas fa-motorcycle"></i> Delivery';
        const tStock = document.getElementById('t-stock'); if(tStock) tStock.innerHTML = '<i class="fas fa-box"></i> Stock';
        const tReport = document.getElementById('t-report'); if(tReport) tReport.innerHTML = '<i class="fas fa-chart-pie"></i> Performance';
        
        // --- 2. SETTINGS UI ---
        if (!document.getElementById('sb-settings')) {
            const footer = document.querySelector('.sidebar-footer');
            if (footer) {
                const settingsBtn = document.createElement('button');
                settingsBtn.className = 'sidebar-item';
                settingsBtn.id = 'sb-settings';
                settingsBtn.innerHTML = '<i class="fas fa-cog" style="margin-right:12px; font-size:16px;"></i>ตั้งค่าร้านค้า';
                settingsBtn.onclick = () => { window.showSec('settings'); toggleSidebar(); };
                
                const div = document.createElement('div');
                div.className = 'sidebar-divider';
                
                footer.parentNode.insertBefore(settingsBtn, footer);
                footer.parentNode.insertBefore(div, footer);
            }
        }
        
        if (!document.getElementById('settings-sec')) {
            const orderSec = document.getElementById('order-sec');
            if (orderSec) {
                const settingsHTML = \`
                    <div id="settings-sec" style="display:none; padding: 20px; animation: fadeIn 0.3s;">
                        <h2 style="font-size: 24px; font-weight: 800; margin-bottom: 20px; color: #1e293b;"><i class="fas fa-cog" style="color: #3b82f6;"></i> ตั้งค่าร้านค้า</h2>
                        
                        <div class="ai-card" style="margin-bottom: 20px; border-top: 4px solid #3b82f6;">
                            <h3 style="font-size: 16px; margin-bottom: 15px;"><i class="fas fa-store"></i> เปิด-ปิดร้าน และเวลาทำการ</h3>
                            <div style="display: grid; grid-template-columns: 1fr; gap: 15px; margin-bottom: 15px;">
                                <label style="display:flex; align-items:center; gap: 10px; font-weight: 800; font-size:18px; color:#10b981;">
                                    <input type="checkbox" id="store-open-status" onchange="toggleStoreStatus()" style="width: 24px; height: 24px;"> เปิดรับออเดอร์วันนี้
                                </label>
                            </div>
                            <hr style="border: 0; border-top: 1px solid var(--border); margin: 15px 0;">
                            <div style="margin-bottom: 15px;">
                                <label style="font-weight: 700; display: block; margin-bottom: 10px;">วันที่เปิดขายเป็นประจำ</label>
                                <div style="display: flex; flex-wrap: wrap; gap: 15px;" id="bh-days">
                                    <label style="cursor:pointer;"><input type="checkbox" value="1" checked> จันทร์</label>
                                    <label style="cursor:pointer;"><input type="checkbox" value="2" checked> อังคาร</label>
                                    <label style="cursor:pointer;"><input type="checkbox" value="3" checked> พุธ</label>
                                    <label style="cursor:pointer;"><input type="checkbox" value="4" checked> พฤหัสบดี</label>
                                    <label style="cursor:pointer;"><input type="checkbox" value="5" checked> ศุกร์</label>
                                    <label style="cursor:pointer;"><input type="checkbox" value="6" checked> เสาร์</label>
                                    <label style="cursor:pointer;"><input type="checkbox" value="0" checked> อาทิตย์</label>
                                </div>
                            </div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                                <div><label style="font-weight: 700; display: block; margin-bottom: 5px;">เวลาเปิด</label><input type="time" id="bh-start" value="09:00" style="padding:10px; border-radius:6px; border:1px solid var(--border); width:100%;"></div>
                                <div><label style="font-weight: 700; display: block; margin-bottom: 5px;">เวลาปิด</label><input type="time" id="bh-end" value="21:00" style="padding:10px; border-radius:6px; border:1px solid var(--border); width:100%;"></div>
                            </div>
                            <button class="btn-black" onclick="saveBusinessHours()" style="background: #3b82f6;"><i class="fas fa-save"></i> บันทึกเวลาทำการ</button>
                            <p style="font-size: 12px; color: #ef4444; margin-top: 10px; font-weight:700;">* หากปิดร้าน หรือนอกเวลาทำการ ลูกค้าจะไม่สามารถกดสั่งอาหารในหน้าเว็บได้</p>
                        </div>

                        <div class="ai-card" style="margin-bottom: 20px;">
                            <h3 style="font-size: 16px; margin-bottom: 15px;"><i class="fas fa-qrcode"></i> ตั้งค่า PromptPay (พร้อมเพย์) สำหรับหน้าลูกค้า</h3>
                            <input type="text" id="store-promptpay" placeholder="เบอร์โทรศัพท์ (เช่น 0931805507) หรือ เลขบัตรประชาชน" value="" style="margin-bottom: 10px; padding:12px; border-radius:6px; border:1px solid var(--border); width:100%;">
                            <button class="btn-black" onclick="savePromptPay()" style="background: #3b82f6;"><i class="fas fa-save"></i> บันทึก PromptPay</button>
                        </div>

                        <div class="ai-card">
                            <h3 style="font-size: 16px; margin-bottom: 15px;"><i class="fas fa-volume-up"></i> การแจ้งเตือนด้วยเสียง (Sound Alerts)</h3>
                            <button id="btn-sound-setting" onclick="window.toggleSound()" class="btn-outline" style="width: 100%; border-color: #3b82f6; color: #3b82f6; padding:15px; font-weight:800;"><i class="fas fa-volume-up"></i> เปิดเสียงแจ้งเตือน</button>
                        </div>
                    </div>
                \`;
                orderSec.insertAdjacentHTML('afterend', settingsHTML);
            }
        }

        // --- 3. POINTS UI ---
        const pointsSec = document.getElementById('points-sec');
        if (pointsSec) {
            pointsSec.innerHTML = \`
                <h2 style="font-size: 24px; font-weight: 800; margin-bottom: 20px; color: #1e293b;"><i class="fas fa-star" style="color: #f59e0b;"></i> ระบบสมาชิก (แต้ม)</h2>
                <div class="ai-card" style="margin-bottom: 20px; border-top: 4px solid #f59e0b;">
                    <h3 style="font-size: 16px; margin-bottom: 15px;"><i class="fas fa-user-plus"></i> เพิ่ม / แก้ไข ข้อมูลสมาชิกรายบุคคล</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
                        <div><label style="font-size:12px; font-weight:700;">เบอร์โทรศัพท์</label><input type="tel" id="pts-phone" placeholder="09XXXXXXXX" style="padding: 10px; border-radius: 6px; border: 1px solid var(--border); width:100%;"></div>
                        <div><label style="font-size:12px; font-weight:700;">ชื่อลูกค้า (เฉพาะแอดมินเห็น)</label><input type="text" id="pts-name" placeholder="ชื่อลูกค้า" style="padding: 10px; border-radius: 6px; border: 1px solid var(--border); width:100%;"></div>
                        <div><label style="font-size:12px; font-weight:700;">คะแนน</label><input type="number" id="pts-val" placeholder="จำนวนแต้ม" value="0" style="padding: 10px; border-radius: 6px; border: 1px solid var(--border); width:100%;"></div>
                    </div>
                    <button class="btn-black" onclick="savePointData()" style="margin-top: 15px; background: #3b82f6;"><i class="fas fa-save"></i> บันทึกข้อมูล</button>
                </div>
                <div class="ai-card" style="padding:0; overflow-x: auto;">
                    <table class="report-table" id="points-table" style="min-width: 600px; width:100%;">
                        <thead style="background:var(--slate);"><tr><th style="padding:15px;">เบอร์โทรศัพท์</th><th>ชื่อลูกค้า</th><th>แต้มสะสม</th><th>จัดการ</th></tr></thead>
                        <tbody id="points-list"></tbody>
                    </table>
                </div>
            \`;
        }

        // --- 4. REPORT & HISTORY UI ---
        const reportSec = document.getElementById('report-sec');
        if (reportSec) {
            reportSec.innerHTML = \`
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="font-size: 24px; font-weight: 800; color: #1e293b;"><i class="fas fa-chart-bar" style="color: #3b82f6;"></i> รายงานผลประกอบการและประวัติ</h2>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn-outline" onclick="switchReportTab('dashboard')" id="rtab-dashboard" style="border-color: #3b82f6; color: #3b82f6; background: rgba(59,130,246,0.1);"><i class="fas fa-chart-pie"></i> ภาพรวม (Dashboard)</button>
                        <button class="btn-outline" onclick="switchReportTab('history')" id="rtab-history"><i class="fas fa-history"></i> ประวัติการขายย้อนหลัง</button>
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
                        <div class="ai-card" style="border-left: 4px solid #10b981;"><p style="font-size: 13px; color: var(--text-muted); font-weight: 700;">ยอดขายรวม</p><p style="font-size: 28px; font-weight: 800; color: #10b981;">฿<span id="rep-total">0</span></p></div>
                        <div class="ai-card" style="border-left: 4px solid #3b82f6;"><p style="font-size: 13px; color: var(--text-muted); font-weight: 700;">จำนวนออเดอร์</p><p style="font-size: 28px; font-weight: 800; color: #3b82f6;" id="rep-count">0</p></div>
                        <div class="ai-card" style="border-left: 4px solid #f59e0b;"><p style="font-size: 13px; color: var(--text-muted); font-weight: 700;">เมนูขายดีที่สุด</p><p style="font-size: 20px; font-weight: 800; margin-top: 5px; color: #f59e0b;" id="rep-top-menu">-</p></div>
                    </div>
                    <div class="ai-card" style="width: 100%; overflow-x: auto;">
                        <h3 style="font-size: 14px; margin-bottom: 15px;"><i class="fas fa-chart-line"></i> กราฟยอดขายแนวโน้ม</h3>
                        <div style="min-width: 600px; height: 300px;"><canvas id="salesChart"></canvas></div>
                    </div>
                </div>
                <div id="report-history" style="display: none;">
                    <div class="ai-card" style="padding: 0; border:none;">
                        <div style="overflow-x: auto;">
                            <table class="report-table" style="min-width: 800px; width: 100%;">
                                <thead style="background:var(--slate);"><tr><th style="padding:15px;">วันที่ - เวลา</th><th>รหัสออเดอร์</th><th>โต๊ะ/ช่องทาง</th><th>ยอดรวม</th><th>การชำระเงิน</th></tr></thead>
                                <tbody id="history-list"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            \`;
        }
        
        // --- 5. MANUAL ORDER MODAL REVAMP ---
        const moModal = document.getElementById('manual-order-modal');
        if (moModal) {
            moModal.innerHTML = \`
                <div class="modal-card" style="max-width: 700px; width:95%; animation: fadeIn 0.2s;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid var(--border); padding-bottom: 15px;">
                        <h3 style="margin: 0; font-size: 20px; font-weight: 800; color: #1e293b;"><i class="fas fa-cart-plus" style="color:#3b82f6;"></i> เพิ่มออเดอร์ (Manual) ให้ลูกค้า</h3>
                        <button onclick="document.getElementById('manual-order-modal').style.display='none'" style="background: none; border: none; font-size: 28px; cursor: pointer; color: var(--text-muted);">&times;</button>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 15px; margin-bottom: 20px;">
                        <div>
                            <label style="font-weight: 700; display: block; margin-bottom: 5px; font-size: 14px;">เลือกระบุโต๊ะ / ช่องทาง</label>
                            <select id="mo-table" style="padding: 12px; border-radius: 8px; border: 1px solid var(--border); width: 100%; font-size: 14px; background:#fff;">
                                <option value="Takeaway">Takeaway (กลับบ้าน)</option>
                                <option value="T-1">โต๊ะ T-1</option>
                                <option value="T-2">โต๊ะ T-2</option>
                                <option value="T-3">โต๊ะ T-3</option>
                                <option value="T-4">โต๊ะ T-4</option>
                                <option value="T-5">โต๊ะ T-5</option>
                            </select>
                        </div>
                        <div>
                            <label style="font-weight: 700; display: block; margin-bottom: 5px; font-size: 14px;">พิมพ์ค้นหาเมนู</label>
                            <div style="position:relative;">
                                <i class="fas fa-search" style="position:absolute; left:12px; top:15px; color:var(--text-muted);"></i>
                                <input type="text" id="mo-search" placeholder="พิมพ์ชื่อเมนู..." oninput="window.filterMoItems()" style="padding: 12px 12px 12px 35px; border-radius: 8px; border: 1px solid var(--border); width: 100%; font-size: 14px;">
                            </div>
                        </div>
                    </div>

                    <div style="max-height: 250px; overflow-y: auto; border: 1px solid var(--border); border-radius: 8px; margin-bottom: 20px; background:var(--bg);" id="mo-menu-list">
                        <!-- Menu items injected here -->
                    </div>

                    <div style="background: var(--slate); padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #3b82f6;">
                        <h4 style="margin: 0 0 10px 0; font-size: 14px; font-weight: 800;">รายการที่เลือกไว้ (<span id="mo-cart-count" style="color:#3b82f6;">0</span> รายการ)</h4>
                        <div id="mo-cart-list" style="max-height: 150px; overflow-y: auto; margin-bottom: 10px; font-size: 13px;">
                            <div style="color: var(--text-muted); text-align: center; padding:10px;">ยังไม่มีการเลือกเมนู</div>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 20px; color: #10b981; border-top:1px dashed var(--border); padding-top:10px;">
                            <span>ยอดรวมทั้งหมด:</span>
                            <span>฿<span id="mo-total">0</span></span>
                        </div>
                    </div>

                    <button class="btn-black" onclick="window.submitManualOrder()" style="width: 100%; background: #3b82f6; height: 50px; font-size: 18px; box-shadow: 0 4px 10px rgba(59,130,246,0.3);"><i class="fas fa-check-circle"></i> ยืนยันการรับออเดอร์</button>
                </div>
            \`;
        }

        // Initialization
        setTimeout(() => {
            if(typeof window.loadSettings === 'function') window.loadSettings();
            if(typeof window.loadBusinessHours === 'function') window.loadBusinessHours();
        }, 500);
    });

    // --- OVERRIDES & LOGIC INJECTIONS ---

    // Safe showSec override
    const origShowSec = typeof window.showSec === 'function' ? window.showSec : function(n) {};
    window.showSec = function(n) {
        // Fast transition
        ['order-sec', 'takeaway-sec', 'stock-sec', 'report-sec', 'points-sec', 'settings-sec'].forEach(s => {
            const el = document.getElementById(s);
            if (el) el.style.display = 'none';
        });
        
        const targetEl = document.getElementById(n + '-sec');
        if (targetEl) {
            targetEl.style.display = (n === 'report' || n === 'settings' || n === 'points') ? 'block' : 'grid';
            // Animation for smoothness
            targetEl.style.animation = 'fadeIn 0.3s ease-out';
        }
        
        if (n === 'points') { if(typeof window.loadPoints === 'function') window.loadPoints(); }
        if (n === 'report') { if(typeof window.switchReportTab === 'function') setTimeout(()=>window.switchReportTab('dashboard'), 50); }
        
        document.querySelectorAll('.tab-btn').forEach(b => {
            if (b.id) b.classList.toggle('active', b.id === 't-' + n);
        });
        document.querySelectorAll('.sidebar-item').forEach(b => {
            if (b.id) b.classList.toggle('active', b.id === 'sb-' + n);
        });
    };

    // Auto-Sync Data (Real-time listener)
    window.addEventListener('storage', (e) => {
        if (e.key === 'withu_orders' || e.key === 'withu_points' || e.key === 'withu_points_db') {
            const ordersEl = document.getElementById('order-sec');
            if (ordersEl && ordersEl.style.display !== 'none' && typeof window.loadOrders === 'function') window.loadOrders();
            
            const takeawayEl = document.getElementById('takeaway-sec');
            if (takeawayEl && takeawayEl.style.display !== 'none' && typeof window.loadTakeaway === 'function') window.loadTakeaway();
            
            const pointsEl = document.getElementById('points-sec');
            if (pointsEl && pointsEl.style.display !== 'none' && typeof window.loadPoints === 'function') window.loadPoints();
            
            // Visual Sync Indicator
            const syncStatus = document.getElementById('sync-status');
            if(syncStatus) {
                syncStatus.style.display = 'inline';
                setTimeout(()=>syncStatus.style.display = 'none', 1000);
            }
        }
    });

    // Settings Logic
    window.loadSettings = function() {
        const status = localStorage.getItem('withu_store_open') !== 'false';
        const cb = document.getElementById('store-open-status');
        if (cb) cb.checked = status;
        
        const pp = localStorage.getItem('withu_promptpay') || '';
        const ppInp = document.getElementById('store-promptpay');
        if (ppInp) ppInp.value = pp;
        
        window.updateSoundBtnUI();
    }
    window.toggleStoreStatus = function() {
        const isOpen = document.getElementById('store-open-status').checked;
        localStorage.setItem('withu_store_open', isOpen);
        if (typeof window.showToast === 'function') window.showToast(isOpen ? 'เปิดร้านแล้ว (ออเดอร์จะเข้าได้)' : 'ปิดร้านแล้ว (ลูกค้าสั่งไม่ได้)', 'new');
    }
    window.savePromptPay = function() {
        const pp = document.getElementById('store-promptpay').value.trim();
        localStorage.setItem('withu_promptpay', pp);
        if (typeof window.showToast === 'function') window.showToast('บันทึก PromptPay แล้ว', 'new');
    }
    window.loadBusinessHours = function() {
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
        } catch (e) {}
    }
    window.saveBusinessHours = function() {
        const days = Array.from(document.querySelectorAll('#bh-days input:checked')).map(cb => parseInt(cb.value));
        const start = document.getElementById('bh-start').value;
        const end = document.getElementById('bh-end').value;
        localStorage.setItem('withu_business_hours', JSON.stringify({ days, start, end }));
        if (typeof window.showToast === 'function') window.showToast('บันทึกเวลาทำการแล้ว', 'new');
    }

    // Sound Toggle Logic Move
    const origToggleSound = typeof window.toggleSound === 'function' ? window.toggleSound : function(){};
    window.toggleSound = function() {
        origToggleSound();
        window.updateSoundBtnUI();
    }
    window.updateSoundBtnUI = function() {
        const isSoundOn = typeof isSoundEnabled !== 'undefined' ? isSoundEnabled : true;
        const btn = document.getElementById('btn-sound-setting');
        if (btn) {
            if (isSoundOn) {
                btn.innerHTML = '<i class="fas fa-volume-up"></i> ปิดเสียงแจ้งเตือน (กำลังเปิดอยู่)';
                btn.style.color = '#ef4444'; btn.style.borderColor = '#ef4444';
            } else {
                btn.innerHTML = '<i class="fas fa-volume-mute"></i> เปิดเสียงแจ้งเตือน (กำลังปิดอยู่)';
                btn.style.color = '#3b82f6'; btn.style.borderColor = '#3b82f6';
            }
        }
        const topBtn = document.getElementById('btn-sound');
        if (topBtn) {
            topBtn.innerHTML = isSoundOn ? '<i class="fas fa-volume-up"></i> SOUND ON' : '<i class="fas fa-volume-mute"></i> SOUND OFF';
        }
    }

    // Points Logic
    window.loadPoints = function() {
        let rawData = localStorage.getItem('withu_points_db') || '{}';
        let db = {};
        try { db = JSON.parse(rawData); } catch(e) {}
        
        const list = document.getElementById('points-list');
        if(!list) return;
        list.innerHTML = '';
        for (let [phone, data] of Object.entries(db)) {
            // Upgrade old db structure if any
            if (typeof data === 'number') { data = { points: data, name: '' }; db[phone] = data; }
            list.innerHTML += \`
                <tr style="border-bottom:1px solid var(--border);">
                    <td style="font-weight: 800; padding:15px;">\${phone}</td>
                    <td>\${data.name || '<span style="color:var(--text-muted);">-</span>'}</td>
                    <td style="color: #3b82f6; font-weight: 800; font-size:18px;">\${data.points}</td>
                    <td><button class="btn-outline" onclick="window.editPointData('\${phone}', '\${data.name || ''}', \${data.points})" style="padding: 8px 12px; border-color: #f59e0b; color: #f59e0b;"><i class="fas fa-edit"></i> แก้ไข</button></td>
                </tr>
            \`;
        }
        localStorage.setItem('withu_points_db', JSON.stringify(db));
    }
    window.editPointData = function(phone, name, points) {
        const el1 = document.getElementById('pts-phone'); if(el1) el1.value = phone;
        const el2 = document.getElementById('pts-name'); if(el2) el2.value = name || '';
        const el3 = document.getElementById('pts-val'); if(el3) el3.value = points;
    }
    window.savePointData = function() {
        const phoneEl = document.getElementById('pts-phone');
        const phone = phoneEl ? phoneEl.value.trim() : '';
        const nameEl = document.getElementById('pts-name');
        const name = nameEl ? nameEl.value.trim() : '';
        const ptsEl = document.getElementById('pts-val');
        const points = ptsEl ? parseInt(ptsEl.value) || 0 : 0;
        
        if (!phone) { if(typeof window.showToast === 'function') window.showToast('กรุณาระบุเบอร์โทรศัพท์', 'call'); return; }
        
        let db = {};
        try { db = JSON.parse(localStorage.getItem('withu_points_db') || '{}'); } catch(e){}
        db[phone] = { points, name };
        localStorage.setItem('withu_points_db', JSON.stringify(db));
        
        if(phoneEl) phoneEl.value = '';
        if(nameEl) nameEl.value = '';
        if(ptsEl) ptsEl.value = '0';
        
        window.loadPoints();
        if(typeof window.showToast === 'function') window.showToast('บันทึกข้อมูลสมาชิกแล้ว', 'new');
    }

    // Report Logic
    let salesChartInstance = null;
    window.switchReportTab = function(tab) {
        const dEl = document.getElementById('report-dashboard');
        const hEl = document.getElementById('report-history');
        if (dEl) { dEl.style.display = tab === 'dashboard' ? 'block' : 'none'; dEl.style.animation = 'fadeIn 0.3s'; }
        if (hEl) { hEl.style.display = tab === 'history' ? 'block' : 'none'; hEl.style.animation = 'fadeIn 0.3s'; }
        
        const dbBtn = document.getElementById('rtab-dashboard');
        const hBtn = document.getElementById('rtab-history');
        if (dbBtn) dbBtn.style.cssText = tab === 'dashboard' ? 'border-color: #3b82f6; color: #3b82f6; background: rgba(59,130,246,0.1);' : 'border-color: var(--border); color: var(--text-main); background: transparent;';
        if (hBtn) hBtn.style.cssText = tab === 'history' ? 'border-color: #3b82f6; color: #3b82f6; background: rgba(59,130,246,0.1);' : 'border-color: var(--border); color: var(--text-main); background: transparent;';
        
        if (tab === 'dashboard') { window.renderReport('1d'); } else { window.renderHistory(); }
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
            if (o.cart) { o.cart.forEach(item => { itemCounts[item.name] = (itemCounts[item.name] || 0) + (item.qty || 1); }); }
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
            salesChartInstance = new window.Chart(ctx, {
                type: 'line',
                data: {
                    labels: chartLabels.length ? chartLabels : ['-'],
                    datasets: [{
                        label: 'ยอดขาย (บาท)',
                        data: chartData.length ? chartData : [0],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59,130,246,0.2)',
                        borderWidth: 2, fill: true, tension: 0.4
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
        if(orders.length === 0) { list.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px;">ไม่มีข้อมูลประวัติการขาย</td></tr>'; return; }
        orders.forEach((o, i) => {
            const date = new Date(o.timestamp).toLocaleString('th-TH');
            list.innerHTML += \`
                <tr style="border-bottom:1px solid var(--border);">
                    <td style="font-size: 12px; color: var(--text-muted); padding:15px;">\${date}</td>
                    <td style="font-weight: 800; color:#1e293b;">#\${o.id || o.orderNo || (1000+i)}</td>
                    <td><span style="background:var(--slate); padding:5px 10px; border-radius:4px; font-size:12px; font-weight:700;">\${o.table || 'Takeaway'}</span></td>
                    <td style="color: #10b981; font-weight: 800;">฿\${(o.total || o.finalTotal || 0).toLocaleString()}</td>
                    <td>\${o.paymentMethod === 'qr' ? '<span style="color:#3b82f6; font-weight:700;"><i class="fas fa-qrcode"></i> PROMPTPAY</span>' : '<span style="color:#f59e0b; font-weight:700;"><i class="fas fa-money-bill"></i> CASH</span>'}</td>
                </tr>
            \`;
        });
    };

    // Manual Order Logic
    window.manualCart = [];
    window.openManualOrderModal = function(targetTable = null) {
        window.manualCart = [];
        const modal = document.getElementById('manual-order-modal');
        if (modal) {
            modal.style.display = 'flex';
            const sel = document.getElementById('mo-table');
            if (targetTable && sel) {
                let found = false;
                for(let i=0; i<sel.options.length; i++) { if(sel.options[i].value === targetTable) { found = true; sel.selectedIndex = i; break; } }
                if(!found) { const opt = document.createElement('option'); opt.value = targetTable; opt.text = targetTable; sel.add(opt); sel.value = targetTable; }
            } else if (sel) { sel.value = 'Takeaway'; }
            window.renderMoMenu();
            window.renderMoCart();
        }
    };
    window.renderMoMenu = function() {
        const list = document.getElementById('mo-menu-list');
        if(!list) return;
        // Mockup of getting menus, ideally we should read window.CATEGORIES or similar if exists
        let itemsHtml = '';
        if (typeof window.MENU !== 'undefined') {
            Object.values(window.MENU).forEach(cat => {
                cat.forEach(item => {
                    itemsHtml += \`<div style="display:flex; justify-content:space-between; align-items:center; padding:10px; border-bottom:1px solid var(--border);">
                        <div><span style="font-weight:700;">\${item.name}</span><br><span style="color:#10b981; font-size:12px;">฿\${item.price}</span></div>
                        <button onclick="window.addManualItem('\${item.name}', \${item.price})" class="btn-outline" style="padding:5px 15px; border-color:#3b82f6; color:#3b82f6;"><i class="fas fa-plus"></i></button>
                    </div>\`;
                });
            });
        }
        if(!itemsHtml) itemsHtml = '<div style="padding: 15px; text-align: center; color: var(--text-muted);">ไม่พบข้อมูลเมนูในระบบ</div>';
        list.innerHTML = itemsHtml;
    };
    window.addManualItem = function(name, price) {
        const exist = window.manualCart.find(i => i.name === name);
        if(exist) { exist.qty++; exist.total = exist.qty * price; }
        else { window.manualCart.push({ name, price, qty: 1, total: price }); }
        window.renderMoCart();
    };
    window.filterMoItems = function() {
        const search = document.getElementById('mo-search').value.toLowerCase();
        const list = document.getElementById('mo-menu-list');
        if(!list) return;
        const items = list.querySelectorAll('div > div > span:first-child');
        items.forEach(span => {
            const row = span.parentNode.parentNode;
            if(span.innerText.toLowerCase().includes(search)) row.style.display = 'flex';
            else row.style.display = 'none';
        });
    };
    window.renderMoCart = function() {
        const list = document.getElementById('mo-cart-list');
        if(list) list.innerHTML = window.manualCart.length ? window.manualCart.map((item, i) => \`<div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px dashed var(--border);"><span><span style="background:#3b82f6; color:#fff; padding:2px 6px; border-radius:4px; font-size:10px; margin-right:5px;">\${item.qty}x</span> <span style="font-weight:700;">\${item.name}</span></span><span style="font-weight:800;">฿\${item.total} <button onclick="window.manualCart.splice(\${i},1); window.renderMoCart();" style="color:#ef4444; border:none; background:none; cursor:pointer; margin-left:10px;"><i class="fas fa-trash"></i></button></span></div>\`).join('') : '<div style="color: var(--text-muted); text-align: center; padding:10px;">ยังไม่มีการเลือกเมนู</div>';
        const total = window.manualCart.reduce((s, i) => s + i.total, 0);
        const totalEl = document.getElementById('mo-total'); if(totalEl) totalEl.innerText = total;
        const countEl = document.getElementById('mo-cart-count'); if(countEl) countEl.innerText = window.manualCart.length;
    };
    window.submitManualOrder = function() {
        if (!window.manualCart.length) {
            if (typeof window.showToast === 'function') window.showToast('กรุณาเลือกเมนู', 'call');
            return;
        }
        const tableEl = document.getElementById('mo-table');
        const table = tableEl ? tableEl.value : 'Takeaway';
        
        // Push to localstorage
        let active = JSON.parse(localStorage.getItem('withu_orders') || '[]');
        const newOrder = {
            id: Date.now().toString().slice(-6),
            table: table,
            cart: window.manualCart.map(c => ({ name: c.name, price: c.price, qty: c.qty, total: c.total })),
            total: window.manualCart.reduce((s, i) => s + i.total, 0),
            timestamp: new Date().toISOString(),
            status: 'pending',
            paymentMethod: 'cash'
        };
        active.unshift(newOrder);
        localStorage.setItem('withu_orders', JSON.stringify(active));
        
        if (typeof window.showToast === 'function') window.showToast('เพิ่มออเดอร์ ' + table + ' สำเร็จ', 'new');
        const modal = document.getElementById('manual-order-modal');
        if(modal) modal.style.display = 'none';
        
        if (typeof window.loadOrders === 'function') window.loadOrders();
        if (typeof window.loadTakeaway === 'function') window.loadTakeaway();
    };

</script>
`;

if (!html.includes('id="withu-revamp-script"')) {
    // Inject right before </body> to ensure it executes after DOM is ready
    html = html.replace('</body>', safePatch + '\n</body>');
    fs.writeFileSync('admin.html', html, 'utf8');
    console.log('Successfully applied all patches via append!');
} else {
    console.log('Patch already applied!');
}
