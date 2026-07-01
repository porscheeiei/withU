const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf8');

// Logic for Settings
const settingsLogic = `
        // --- Settings Logic ---
        function loadSettings() {
            const status = localStorage.getItem('withu_store_open') !== 'false'; // default true
            const statusCheckbox = document.getElementById('store-open-status');
            if (statusCheckbox) statusCheckbox.checked = status;
            
            const pp = localStorage.getItem('withu_promptpay') || '';
            const ppInput = document.getElementById('store-promptpay');
            if (ppInput) ppInput.value = pp;
            
            updateSoundBtnUI();
        }

        function toggleStoreStatus() {
            const isOpen = document.getElementById('store-open-status').checked;
            localStorage.setItem('withu_store_open', isOpen);
            if (typeof showToast === 'function') {
                showToast(isOpen ? 'เปิดร้านแล้ว' : 'ปิดร้านแล้ว', 'new');
            }
        }

        function savePromptPay() {
            const pp = document.getElementById('store-promptpay').value;
            localStorage.setItem('withu_promptpay', pp);
            if (typeof showToast === 'function') {
                showToast('บันทึก PromptPay แล้ว', 'new');
            }
        }

        function updateSoundBtnUI() {
            const btn = document.getElementById('btn-sound-setting');
            if (btn) {
                if (isSoundEnabled) {
                    btn.innerHTML = '<i class="fas fa-volume-up"></i> ปิดเสียงแจ้งเตือน';
                    btn.style.color = '#ef4444';
                    btn.style.borderColor = '#ef4444';
                } else {
                    btn.innerHTML = '<i class="fas fa-volume-mute"></i> เปิดเสียงแจ้งเตือน';
                    btn.style.color = '#3b82f6';
                    btn.style.borderColor = '#3b82f6';
                }
            }
            // Also update top floating button if exists
            const topBtn = document.getElementById('btn-sound');
            if (topBtn) {
                topBtn.innerHTML = isSoundEnabled ? '<i class="fas fa-volume-up"></i> SOUND ON' : '<i class="fas fa-volume-mute"></i> SOUND OFF';
            }
        }
`;

if (!html.includes('function loadSettings()')) {
    html = html.replace('function toggleSound() {', settingsLogic + '\n        function toggleSound() {');
    // Also inject updateSoundBtnUI inside toggleSound
    if (html.includes('document.getElementById(\'btn-sound\').innerText')) {
        html = html.replace(/document\.getElementById\('btn-sound'\)\.innerText[^;]+;/g, 'updateSoundBtnUI();');
    }
    
    // Call loadSettings on init
    html = html.replace('loadPoints();', 'loadPoints(); loadSettings();');
}

fs.writeFileSync('admin.html', html, 'utf8');
console.log('Added Settings Logic');
