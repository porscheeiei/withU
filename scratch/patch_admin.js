const fs = require('fs');
let html = fs.readFileSync('d:/withu/withU/admin.html', 'utf8');

// 1. Dark Mode
html = html.replace(/\[data-theme="dark"\] body \{ background: [^}]+}/g, '[data-theme="dark"] body { background: #000000 !important; }');

// 2. Card depth (ai-card)
html = html.replace(/\.ai-card \{ border-radius: 16px !important; border: 1px solid rgba\(226,232,240,0\.6\) !important; box-shadow: [^}]+}/g, 
  '.ai-card { border-radius: 16px !important; border: 1px solid rgba(226,232,240,0.6) !important; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1) !important; transition: all 0.2s ease !important; padding: 22px !important; }');
html = html.replace(/\.ai-card:hover \{ transform: translateY\([^}]+}/g, 
  '.ai-card:hover { transform: translateY(-2px) !important; box-shadow: 0 15px 30px -5px rgba(59,130,246,0.15), 0 10px 15px -5px rgba(59,130,246,0.1) !important; }');

// 3. Remove PromptPay from Settings
html = html.replace(/<div class="ai-card" style="margin-bottom:16px;">[\s\S]*?<h3[^>]*>.*?PromptPay QR<\/h3>[\s\S]*?<\/div>/g, '');
html = html.replace(/var pp = document\.getElementById\('store-promptpay'\);\s*if\(pp\) pp\.value = localStorage\.getItem\('withu_promptpay'\) \|\| '';/g, '');

// 4. Clean up Top Navigation
html = html.replace(/<div class="action-btns"[^>]*>[\s\S]*?<\/div>/, `<div class="action-btns" style="display: flex; gap: 8px; align-items: center;">
            <div id="date-now" style="margin-right: 15px; font-weight: 700; color: var(--text-muted); font-size: 14px;"></div>
            <button id="btn-sound" onclick="toggleSound()" class="tab-btn" style="border: 1px solid var(--border); color: #3b82f6;"><i class="fas fa-volume-up"></i></button>
            <button class="tab-btn" onclick="openManualOrderModal(null)" id="btn-add-nav" style="background: linear-gradient(135deg, #3b82f6, #2563eb); color: #fff; border: none;">ADD ORDER</button>
        </div>`);

// Remove old date-now
html = html.replace(/<div id="date-now"><\/div>/g, '');
html = html.replace(/<span id="date-now"[^>]*><\/span>/g, '');

// 5. Replace PromptPay number globally
html = html.replace(/0931805507/g, '0616087420');

// 6. Modernize Points UI
let pointsUI = `<h2 style="margin-bottom:20px; font-weight:900; font-size:24px; letter-spacing:-0.5px;"><i class="fas fa-star" style="color:#f59e0b; margin-right:10px;"></i>Customer Points</h2>
            <div class="ai-card" style="margin-bottom:20px; border-left:4px solid #3b82f6;">
                <h3 style="font-size:16px; margin-bottom:18px; font-weight:800;"><i class="fas fa-user-plus" style="color:#3b82f6; margin-right:8px;"></i>เพิ่ม/แก้ไข สมาชิก</h3>
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:16px; margin-bottom:16px;">
                    <div>
                        <label style="font-size:12px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:6px;">เบอร์โทรศัพท์ (Phone)</label>
                        <input type="tel" id="pts-phone" placeholder="09XXXXXXXX" style="width:100%; padding:12px; border-radius:8px; border:1px solid var(--border); font-size:15px; background:var(--slate);">
                    </div>
                    <div>
                        <label style="font-size:12px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:6px;">ชื่อสมาชิก (Name)</label>
                        <input type="text" id="pts-name" placeholder="ชื่อลูกค้า" style="width:100%; padding:12px; border-radius:8px; border:1px solid var(--border); font-size:15px; background:var(--slate);">
                    </div>
                    <div>
                        <label style="font-size:12px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:6px;">คะแนนสะสม (Points)</label>
                        <input type="number" id="pts-val" value="0" style="width:100%; padding:12px; border-radius:8px; border:1px solid var(--border); font-size:15px; background:var(--slate);">
                    </div>
                </div>
                <button class="btn-black" onclick="savePointData()" style="width:auto; padding:12px 24px; background:linear-gradient(135deg, #3b82f6, #2563eb);"><i class="fas fa-save" style="margin-right:8px;"></i>บันทึกข้อมูลสมาชิก</button>
            </div>
            <div class="ai-card" style="padding:0; overflow-x:auto;">
                <table class="report-table" style="min-width:600px; width:100%; border:none;">
                    <thead style="background:var(--slate);">
                        <tr>
                            <th style="padding:15px 20px; font-size:12px;">เบอร์โทรศัพท์</th>
                            <th style="padding:15px 20px; font-size:12px;">ชื่อสมาชิก</th>
                            <th style="padding:15px 20px; font-size:12px;">คะแนนสะสม</th>
                            <th style="padding:15px 20px; font-size:12px; text-align:center;">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody id="points-list"></tbody>
                </table>
            </div>`;

html = html.replace(/<h2 style="margin-bottom:20px;"><i class="fas fa-star"[^>]*><\/i>Loyalty Points<\/h2>[\s\S]*?<\/table><\/div>/, pointsUI);
html = html.replace(/<h2 style="margin:0 0 20px 0; letter-spacing:-0\.5px;">ระบบสมาชิก \(Customer Points\)<\/h2>[\s\S]*?<\/table>\s*<\/div>/, pointsUI);

// 7. Insert Sidebar Real-Time Report
const sidebarReportHtml = `
            <div class="sidebar-divider"></div>
            <div style="padding: 10px 15px;">
                <h4 style="font-size:11px; font-weight:800; color:var(--text-muted); text-transform:uppercase; margin-bottom:10px; letter-spacing:0.5px;">Live Report</h4>
                <div style="background:var(--slate); padding:12px; border-radius:8px; border:1px solid var(--border); margin-bottom:8px;">
                    <span style="font-size:10px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:2px;">TODAY'S SALES</span>
                    <strong style="font-size:16px; color:#10b981;" id="sb-rep-total">฿0</strong>
                </div>
                <div style="background:var(--slate); padding:12px; border-radius:8px; border:1px solid var(--border); margin-bottom:8px;">
                    <span style="font-size:10px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:2px;">TOTAL ORDERS</span>
                    <strong style="font-size:16px; color:#3b82f6;" id="sb-rep-count">0</strong>
                </div>
                <div style="background:var(--slate); padding:12px; border-radius:8px; border:1px solid var(--border);">
                    <span style="font-size:10px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:2px;">AVG. SERVICE</span>
                    <strong style="font-size:14px; color:#f59e0b;" id="sb-rep-avg">0.0 MINS</strong>
                </div>
            </div>`;

// Insert it right after the Settings menu item in the sidebar
html = html.replace(/(<button class="sidebar-item" id="sb-settings"[^>]*>[\s\S]*?<\/button>)/, '$1' + sidebarReportHtml);


fs.writeFileSync('d:/withu/withU/admin.html', html, 'utf8');
console.log('Admin UI Mod Applied!');
