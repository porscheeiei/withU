const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf8');

// 1. Add Settings to Sidebar (Before the logout button/footer)
const settingsSidebarItem = `
            <button class="sidebar-item" onclick="showSec('settings'); toggleSidebar();" id="sb-settings"><i class="fas fa-cog"></i>ตั้งค่าร้านค้า</button>
            <div class="sidebar-divider"></div>
`;
if (!html.includes('sb-settings')) {
    html = html.replace('<div class="sidebar-footer">', settingsSidebarItem + '    <div class="sidebar-footer">');
}

// 2. Add settings-sec HTML
const settingsSecHtml = `
    <div id="settings-sec" style="display:none; padding: 20px;">
        <h2 style="font-size: 24px; font-weight: 800; margin-bottom: 20px;"><i class="fas fa-cog"></i> ตั้งค่าร้านค้า</h2>
        
        <div class="ai-card" style="margin-bottom: 20px;">
            <h3 style="font-size: 16px; margin-bottom: 15px;"><i class="fas fa-store"></i> เปิด-ปิดร้าน</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <label style="display:flex; align-items:center; gap: 10px; font-weight: 700;">
                    <input type="checkbox" id="store-open-status" onchange="toggleStoreStatus()" style="width: auto;"> เปิดรับออเดอร์วันนี้
                </label>
            </div>
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
`;
if (!html.includes('id="settings-sec"')) {
    html = html.replace('<div id="report-sec" style="display:none; padding:20px;">', settingsSecHtml + '\n    <div id="report-sec" style="display:none; padding:20px;">');
}

// 3. Update showSec
html = html.replace("['order-sec', 'takeaway-sec', 'stock-sec', 'report-sec', 'points-sec']", "['order-sec', 'takeaway-sec', 'stock-sec', 'report-sec', 'points-sec', 'settings-sec']");

fs.writeFileSync('admin.html', html, 'utf8');
console.log('Added Settings Section UI');
