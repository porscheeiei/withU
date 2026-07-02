const fs = require('fs');

function applySafePatches() {
    let html = fs.readFileSync('admin.html', 'utf8');

    // 1. Add FontAwesome and CSS overrides to head
    const styleOverrides = `
    <!-- WITHU V2 Revamp Styles & Scripts -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --text-accent: #3b82f6; /* Blue accent */
        }
        .btn-black:hover { background: #3b82f6 !important; border-color: #3b82f6 !important; }
        .tab-btn.active { border-color: #3b82f6 !important; color: #3b82f6 !important; background: rgba(59,130,246,0.1) !important; }
    </style>
    `;
    if (!html.includes('<!-- WITHU V2 Revamp Styles')) {
        html = html.replace('</head>', styleOverrides + '\n</head>');
    }

    // 2. Inject JS at the end of the body
    const injectedJS = `
    <script id="withu-revamp-script">
        // OVERRIDE: Icons in sidebar
        document.addEventListener('DOMContentLoaded', () => {
            const replaceIcon = (id, iconHTML, text) => {
                const el = document.getElementById(id);
                if(el) el.innerHTML = iconHTML + text;
            };
            replaceIcon('sb-orders', '<i class="fas fa-store" style="margin-right:8px;"></i>', 'ออเดอร์หน้าร้าน');
            replaceIcon('sb-takeaway', '<i class="fas fa-motorcycle" style="margin-right:8px;"></i>', 'เดลิเวอรี่');
            replaceIcon('sb-stock', '<i class="fas fa-box" style="margin-right:8px;"></i>', 'คลังสินค้า');
            replaceIcon('sb-report', '<i class="fas fa-chart-bar" style="margin-right:8px;"></i>', 'ผลประกอบการ');
            replaceIcon('sb-points', '<i class="fas fa-star" style="margin-right:8px;"></i>', 'ระบบสมาชิก (แต้ม)');
            
            // Add settings menu item if not exists
            if (!document.getElementById('sb-settings')) {
                const footer = document.querySelector('.sidebar-footer');
                if (footer) {
                    const settingsBtn = document.createElement('button');
                    settingsBtn.className = 'sidebar-item';
                    settingsBtn.id = 'sb-settings';
                    settingsBtn.innerHTML = '<i class="fas fa-cog" style="margin-right:8px;"></i>ตั้งค่าร้านค้า';
                    settingsBtn.onclick = () => { showSec('settings'); toggleSidebar(); };
                    
                    const div = document.createElement('div');
                    div.className = 'sidebar-divider';
                    
                    footer.parentNode.insertBefore(settingsBtn, footer);
                    footer.parentNode.insertBefore(div, footer);
                }
            }
            
            // Create Settings Section
            if (!document.getElementById('settings-sec')) {
                const orderSec = document.getElementById('order-sec');
                if (orderSec) {
                    const settingsHTML = \`
                        <div id="settings-sec" style="display:none; padding: 20px;">
                            <h2 style="font-size: 24px; font-weight: 800; margin-bottom: 20px;"><i class="fas fa-cog"></i> ตั้งค่าร้านค้า</h2>
                            
                            <div class="ai-card" style="margin-bottom: 20px;">
                                <h3 style="font-size: 16px; margin-bottom: 15px;"><i class="fas fa-store"></i> เปิด-ปิดร้าน และเวลาทำการ</h3>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                                    <label style="display:flex; align-items:center; gap: 10px; font-weight: 700;">
                                        <input type="checkbox" id="store-open-status" onchange="toggleStoreStatus()" style="width: auto;"> เปิดรับออเดอร์วันนี้
                                    </label>
                                </div>
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
                                    <div><label style="font-weight: 700; display: block; margin-bottom: 5px;">เวลาเปิด</label><input type="time" id="bh-start" value="09:00"></div>
                                    <div><label style="font-weight: 700; display: block; margin-bottom: 5px;">เวลาปิด</label><input type="time" id="bh-end" value="21:00"></div>
                                </div>
                                <button class="btn-black" onclick="saveBusinessHours()" style="background: #3b82f6;">บันทึกเวลาทำการ</button>
                                <p style="font-size: 12px; color: var(--text-muted); margin-top: 10px;">* หากปิดร้าน ลูกค้าจะไม่สามารถกดสั่งอาหารในหน้าเว็บได้</p>
                            </div>

                            <div class="ai-card" style="margin-bottom: 20px;">
                                <h3 style="font-size: 16px; margin-bottom: 15px;"><i class="fas fa-qrcode"></i> ตั้งค่า PromptPay (พร้อมเพย์)</h3>
                                <input type="text" id="store-promptpay" placeholder="เบอร์โทรศัพท์ หรือ เลขบัตรประชาชน" value="" style="margin-bottom: 10px;">
                                <button class="btn-black" onclick="savePromptPay()" style="background: #3b82f6;">บันทึก PromptPay</button>
                            </div>

                            <div class="ai-card">
                                <h3 style="font-size: 16px; margin-bottom: 15px;"><i class="fas fa-volume-up"></i> การแจ้งเตือนด้วยเสียง</h3>
                                <button id="btn-sound-setting" onclick="toggleSound()" class="btn-outline" style="width: 100%; border-color: #3b82f6; color: #3b82f6;"><i class="fas fa-volume-up"></i> เปิดเสียงแจ้งเตือน</button>
                            </div>
                        </div>
                    \`;
                    orderSec.insertAdjacentHTML('afterend', settingsHTML);
                }
            }

            // Replace Points UI
            const pointsSec = document.getElementById('points-sec');
            if (pointsSec) {
                pointsSec.innerHTML = \`
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
                            <thead><tr><th>เบอร์โทรศัพท์</th><th>ชื่อลูกค้า</th><th>แต้มสะสม</th><th>จัดการ</th></tr></thead>
                            <tbody id="points-list"></tbody>
                        </table>
                    </div>
                \`;
            }

            // Init values
            setTimeout(() => {
                loadSettings();
                loadBusinessHours();
            }, 500);
        });

        // OVERRIDE: showSec
        const origShowSec = typeof showSec === 'function' ? showSec : function(n) {};
        window.showSec = function(n) {
            ['order-sec', 'takeaway-sec', 'stock-sec', 'report-sec', 'points-sec', 'settings-sec'].forEach(s => {
                const el = document.getElementById(s);
                if (el) el.style.display = 'none';
            });
            
            const targetEl = document.getElementById(n + '-sec');
            if (targetEl) {
                targetEl.style.display = (n === 'report' || n === 'settings' || n === 'points') ? 'block' : 'grid';
            }
            
            if (n === 'points') loadPoints();
            
            document.querySelectorAll('.tab-btn').forEach(b => {
                if (b.id) b.classList.toggle('active', b.id === 't-' + n);
            });
            document.querySelectorAll('.sidebar-item').forEach(b => {
                if (b.id) b.classList.toggle('active', b.id === 'sb-' + n);
            });
        };

        // Storage Listener for auto sync
        window.addEventListener('storage', (e) => {
            if (e.key === 'withu_orders' || e.key === 'withu_points' || e.key === 'withu_points_db') {
                const ordersEl = document.getElementById('order-sec');
                if (ordersEl && ordersEl.style.display !== 'none' && typeof loadOrders === 'function') loadOrders();
                
                const pointsEl = document.getElementById('points-sec');
                if (pointsEl && pointsEl.style.display !== 'none') loadPoints();
                
                const syncStatus = document.getElementById('sync-status');
                if(syncStatus) {
                    syncStatus.style.display = 'inline';
                    setTimeout(()=>syncStatus.style.display = 'none', 1000);
                }
            }
        });

        // Settings Logic
        function loadSettings() {
            const status = localStorage.getItem('withu_store_open') !== 'false';
            const cb = document.getElementById('store-open-status');
            if (cb) cb.checked = status;
            
            const pp = localStorage.getItem('withu_promptpay') || '';
            const ppInp = document.getElementById('store-promptpay');
            if (ppInp) ppInp.value = pp;
            
            updateSoundBtnUI();
        }
        function toggleStoreStatus() {
            const isOpen = document.getElementById('store-open-status').checked;
            localStorage.setItem('withu_store_open', isOpen);
            if (typeof showToast === 'function') showToast(isOpen ? 'เปิดร้านแล้ว' : 'ปิดร้านแล้ว', 'new');
        }
        function savePromptPay() {
            const pp = document.getElementById('store-promptpay').value;
            localStorage.setItem('withu_promptpay', pp);
            if (typeof showToast === 'function') showToast('บันทึก PromptPay แล้ว', 'new');
            // Overwrite finalPay QR image generation function logic dynamically if needed, 
            // but we can just override it here:
            window.finalPay = function(method) {
                if(method === 'qr') {
                    const img = document.getElementById('p-qr-img'); 
                    if(img) {
                        const amt = document.getElementById('p-total').innerText.replace(/,/g, '');
                        img.src = \`https://promptpay.io/\${pp || '0931805507'}/\${amt}.png\`; 
                    }
                    const qrArea = document.getElementById('p-qr-area');
                    if(qrArea) qrArea.style.display = 'block'; 
                } else {
                    const qrArea = document.getElementById('p-qr-area');
                    if(qrArea) qrArea.style.display = 'none'; 
                }
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
            } catch (e) {}
        }
        function saveBusinessHours() {
            const days = Array.from(document.querySelectorAll('#bh-days input:checked')).map(cb => parseInt(cb.value));
            const start = document.getElementById('bh-start').value;
            const end = document.getElementById('bh-end').value;
            localStorage.setItem('withu_business_hours', JSON.stringify({ days, start, end }));
            if (typeof showToast === 'function') showToast('บันทึกเวลาทำการแล้ว', 'new');
        }
        const origToggleSound = typeof toggleSound === 'function' ? toggleSound : function(){};
        window.toggleSound = function() {
            origToggleSound();
            updateSoundBtnUI();
        }
        function updateSoundBtnUI() {
            const btn = document.getElementById('btn-sound-setting');
            if (btn) {
                if (isSoundEnabled) {
                    btn.innerHTML = '<i class="fas fa-volume-up"></i> ปิดเสียงแจ้งเตือน';
                    btn.style.color = '#ef4444'; btn.style.borderColor = '#ef4444';
                } else {
                    btn.innerHTML = '<i class="fas fa-volume-mute"></i> เปิดเสียงแจ้งเตือน';
                    btn.style.color = '#3b82f6'; btn.style.borderColor = '#3b82f6';
                }
            }
            const topBtn = document.getElementById('btn-sound');
            if (topBtn) {
                topBtn.innerHTML = isSoundEnabled ? '<i class="fas fa-volume-up"></i> SOUND ON' : '<i class="fas fa-volume-mute"></i> SOUND OFF';
            }
        }

        // OVERRIDE: loadPoints
        window.loadPoints = function() {
            // First check if old format safeStorageGet exists
            let rawData = localStorage.getItem('withu_points_db') || '{}';
            let db = {};
            try { db = JSON.parse(rawData); } catch(e) {}
            
            const list = document.getElementById('points-list');
            if(!list) return;
            list.innerHTML = '';
            for (let [phone, data] of Object.entries(db)) {
                if (typeof data === 'number') { data = { points: data, name: '' }; db[phone] = data; }
                list.innerHTML += \`
                    <tr>
                        <td style="font-weight: 700;">\${phone}</td>
                        <td>\${data.name || '-'}</td>
                        <td style="color: #3b82f6; font-weight: 800;">\${data.points}</td>
                        <td><button class="btn-outline" onclick="editPointData('\${phone}', '\${data.name || ''}', \${data.points})" style="padding: 5px 10px; border-color: #f59e0b; color: #f59e0b;"><i class="fas fa-edit"></i> แก้ไข</button></td>
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
            
            if (!phone) { if(typeof showToast === 'function') showToast('กรุณาระบุเบอร์โทรศัพท์', 'call'); return; }
            
            let db = {};
            try { db = JSON.parse(localStorage.getItem('withu_points_db') || '{}'); } catch(e){}
            db[phone] = { points, name };
            localStorage.setItem('withu_points_db', JSON.stringify(db));
            
            if(phoneEl) phoneEl.value = '';
            if(nameEl) nameEl.value = '';
            if(ptsEl) ptsEl.value = '0';
            
            loadPoints();
            if(typeof showToast === 'function') showToast('บันทึกข้อมูลสมาชิกแล้ว', 'new');
        }

    </script>
    `;

    if (!html.includes('id="withu-revamp-script"')) {
        html = html.replace('</body>', injectedJS + '\n</body>');
    }

    fs.writeFileSync('admin.html', html, 'utf8');
}

applySafePatches();
console.log('Applied safe patches to admin.html');
