const fs = require('fs');

let html = fs.readFileSync('admin.html', 'utf8');

// Remove .op-bar
const opBarRegex = /<div class="op-bar">[\s\S]*?<\/div>\s*<\/div>/;
html = html.replace(opBarRegex, '');

// Replace logo section to include sync and close timer
const logoRegex = /<div class="logo">WITHU ADMIN<\/div>/;
const newLogoSection = `
    <div style="display: flex; align-items: center; gap: 15px;">
        <div class="logo">WITHU ADMIN</div>
        <span id="sync-status" style="display:none; color:#10b981; font-weight:800; font-size:11px;"><i class="fas fa-sync-alt fa-spin" style="margin-right: 5px;"></i>SYNCING</span>
        <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); display: flex; align-items: center;">
            <span style="background: rgba(59,130,246,0.1); padding: 4px 8px; border-radius: 6px; color: #3b82f6; margin-right: 5px;">CLOSING IN: <span id="close-timer" style="font-weight: 900;">00:00:00</span></span>
        </div>
        <div id="date-now" style="font-size: 11px; font-weight: 700; color: var(--text-muted);"></div>
    </div>
`;
html = html.replace(logoRegex, newLogoSection);

// Add sound button to action-btns
const actionBtnsRegex = /<div class="action-btns" style="display: flex; gap: 8px;">/;
const newActionBtns = `<div class="action-btns" style="display: flex; gap: 8px;">
            <button id="btn-sound" onclick="toggleSound()" class="tab-btn" style="border: 1px solid var(--border); color: #3b82f6;"><i class="fas fa-volume-up"></i></button>`;
if (!html.includes('id="btn-sound" onclick="toggleSound()" class="tab-btn"')) {
    html = html.replace(actionBtnsRegex, newActionBtns);
}

// Remove emojis
html = html.replace(/🔊 /g, '');
html = html.replace(/🔄 /g, '');
html = html.replace(/☰/g, '<i class="fas fa-bars"></i>');
html = html.replace(/🛑/g, '');
html = html.replace(/🍔/g, '');
html = html.replace(/🛵/g, '');
html = html.replace(/📦/g, '');
html = html.replace(/📊/g, '');
html = html.replace(/⭐️/g, '');
html = html.replace(/💬/g, '');

fs.writeFileSync('admin.html', html, 'utf8');
console.log('UI adjusted successfully.');
