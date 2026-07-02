const fs = require('fs');

let html = fs.readFileSync('admin.html', 'utf8');

const updatedSettingsBtnLogic = `
        if (!document.getElementById('sb-settings')) {
            const logoutBtn = document.querySelector('button[onclick*="handleLogout"]');
            if (logoutBtn) {
                const settingsBtn = document.createElement('button');
                settingsBtn.className = 'sidebar-item';
                settingsBtn.id = 'sb-settings';
                settingsBtn.innerHTML = '<i class="fas fa-cog" style="margin-right:12px; font-size:16px;"></i>ตั้งค่าร้านค้า';
                settingsBtn.onclick = () => { window.showSec('settings'); toggleSidebar(); };
                
                const div = document.createElement('div');
                div.className = 'sidebar-divider';
                
                logoutBtn.parentNode.insertBefore(settingsBtn, logoutBtn);
                logoutBtn.parentNode.insertBefore(div, logoutBtn);
            } else {
                const menu = document.querySelector('.sidebar-menu');
                if (menu) {
                    const settingsBtn = document.createElement('button');
                    settingsBtn.className = 'sidebar-item';
                    settingsBtn.id = 'sb-settings';
                    settingsBtn.innerHTML = '<i class="fas fa-cog" style="margin-right:12px; font-size:16px;"></i>ตั้งค่าร้านค้า';
                    settingsBtn.onclick = () => { window.showSec('settings'); toggleSidebar(); };
                    menu.appendChild(settingsBtn);
                }
            }
        }
`;

// We just replace the old logic inside withu-revamp-script
const searchFor = `if (!document.getElementById('sb-settings')) {
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
        }`;

if (html.includes(searchFor)) {
    html = html.replace(searchFor, updatedSettingsBtnLogic);
    fs.writeFileSync('admin.html', html, 'utf8');
    console.log('Fixed Settings button injection');
} else {
    console.log('Could not find the old settings button logic');
}
