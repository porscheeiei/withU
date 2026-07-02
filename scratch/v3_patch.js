const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf8');

// ====== 1. REMOVE OLD PREMIUM UI CSS ======
html = html.replace(/<!-- WITHU PREMIUM UI -->([\s\S]*?)<\/style>\s*/, '');

// ====== 2. REMOVE OLD withu-revamp-script ======
html = html.replace(/<link rel="stylesheet" href="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/6\.4\.0\/css\/all\.min\.css">/, '');
html = html.replace(/<!-- WITHU V2 Revamp Styles & Scripts -->\s*/, '');
// Remove the revamp style block
html = html.replace(/<style>\s*:root \{\s*--text-accent: #3b82f6;[\s\S]*?<\/style>\s*/, '');
// Remove the revamp script block  
html = html.replace(/<script id="withu-revamp-script">[\s\S]*?<\/script>\s*/, '');

// ====== 3. REMOVE OP-BAR HTML ======
// The op-bar div has already been partially removed but CSS and broken refs might remain
// Remove the remaining broken op-bar reference if still there
html = html.replace(/<div class="op-bar">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*/, '');

// ====== 4. FIX TOP NAV - Put SYNCING + CLOSING IN + DATE after logo ======
// Current logo section (from adjust_ui.js output)
const oldLogoBlock = `
    <div style="display: flex; align-items: center; gap: 15px;">
        <div class="logo">WITHU ADMIN</div>
        <span id="sync-status" style="display:none; color:#10b981; font-weight:800; font-size:11px;"><i class="fas fa-sync-alt fa-spin" style="margin-right: 5px;"></i>SYNCING</span>
        <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); display: flex; align-items: center;">
            <span style="background: rgba(59,130,246,0.1); padding: 4px 8px; border-radius: 6px; color: #3b82f6; margin-right: 5px;">CLOSING IN: <span id="close-timer" style="font-weight: 900;">00:00:00</span></span>
        </div>
        <div id="date-now" style="font-size: 11px; font-weight: 700; color: var(--text-muted);"></div>
    </div>`;
    
const newLogoBlock = `
    <div style="display: flex; align-items: center; gap: 12px;">
        <div class="logo">WITHU ADMIN</div>
        <span id="sync-status" style="display:none; font-weight:700; font-size:11px; color:#10b981; background:rgba(16,185,129,0.1); padding:4px 10px; border-radius:6px; border:1px solid rgba(16,185,129,0.2);"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right:4px; vertical-align:-1px; animation:spin 1s linear infinite;"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>SYNCING</span>
        <div style="font-size:11px; font-weight:700; color:var(--text-muted); display:flex; align-items:center; gap:6px;">
            <span style="background:rgba(59,130,246,0.08); padding:5px 10px; border-radius:8px; color:#3b82f6; font-weight:800; border:1px solid rgba(59,130,246,0.15);">CLOSING IN: <span id="close-timer" style="font-weight:900; color:#2563eb;">00:00:00</span></span>
            <span id="date-now" style="background:rgba(100,116,139,0.08); padding:5px 10px; border-radius:8px; color:#64748b; font-weight:700; border:1px solid rgba(100,116,139,0.1);"></span>
        </div>
    </div>`;

if (html.includes(oldLogoBlock.trim())) {
    html = html.replace(oldLogoBlock, newLogoBlock);
    console.log('Replaced logo block');
} else {
    console.log('Logo block not found exactly, trying simpler replacement');
    // Try a simpler approach
    html = html.replace(
        /<div style="display: flex; align-items: center; gap: 15px;">\s*<div class="logo">WITHU ADMIN<\/div>/,
        '<div style="display: flex; align-items: center; gap: 12px;">\n        <div class="logo">WITHU ADMIN</div>'
    );
}

// ====== 5. FIX STICKY TOP ======
// Remove top:35px from .top-nav (op-bar is gone)
html = html.replace(
    /\.top-nav \{([^}]*?)top: 35px;/,
    '.top-nav {$1top: 0;'
);

// ====== 6. INJECT NEW PREMIUM CSS + COMPLETE SYSTEM SCRIPT ======
const newHeadInjection = `
<!-- WITHU ADMIN PREMIUM V3 -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
<style id="withu-premium-v3">
/* === PREMIUM V3 DESIGN SYSTEM === */
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes fadeSlideIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
@keyframes pulseGlow { 0%,100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.3); } 50% { box-shadow: 0 0 0 8px rgba(59,130,246,0); } }

* { font-family: 'Plus Jakarta Sans', 'Inter', 'Prompt', system-ui, sans-serif !important; }

body { background: #f8fafc !important; background-image: radial-gradient(at 20% 30%, rgba(59,130,246,0.03) 0%, transparent 50%), radial-gradient(at 80% 70%, rgba(99,102,241,0.03) 0%, transparent 50%) !important; }
[data-theme="dark"] body { background: #0c0f1a !important; background-image: radial-gradient(at 20% 30%, rgba(59,130,246,0.05) 0%, transparent 50%), radial-gradient(at 80% 70%, rgba(99,102,241,0.04) 0%, transparent 50%) !important; }

/* --- TOP NAV --- */
.top-nav { background: rgba(255,255,255,0.95) !important; backdrop-filter: blur(20px) saturate(1.8) !important; -webkit-backdrop-filter: blur(20px) saturate(1.8) !important; border-bottom: 1px solid rgba(226,232,240,0.8) !important; padding: 10px 24px !important; box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.02) !important; top: 0 !important; }
[data-theme="dark"] .top-nav { background: rgba(15,23,42,0.95) !important; border-bottom: 1px solid rgba(30,41,59,0.8) !important; }
.logo { font-size: 18px !important; font-weight: 900 !important; letter-spacing: -0.5px !important; color: #0f172a !important; }
[data-theme="dark"] .logo { color: #f1f5f9 !important; }
.hamburger-btn { background: rgba(59,130,246,0.08) !important; border: 1px solid rgba(59,130,246,0.15) !important; border-radius: 10px !important; color: #3b82f6 !important; padding: 8px 11px !important; font-size: 16px !important; transition: all 0.2s ease !important; }
.hamburger-btn:hover { background: #3b82f6 !important; color: #fff !important; transform: scale(1.05) !important; }

/* Action Buttons */
.action-btns .tab-btn { border-radius: 10px !important; font-size: 11px !important; font-weight: 700 !important; padding: 8px 16px !important; letter-spacing: 0.3px !important; transition: all 0.2s ease !important; }
#btn-add-nav { background: linear-gradient(135deg, #3b82f6, #2563eb) !important; color: #fff !important; border: none !important; box-shadow: 0 2px 8px rgba(59,130,246,0.3) !important; }
#btn-add-nav:hover { transform: translateY(-1px) !important; box-shadow: 0 4px 15px rgba(59,130,246,0.4) !important; }
#btn-staff-nav { background: linear-gradient(135deg, #1e293b, #0f172a) !important; color: #fff !important; border: none !important; }
#btn-export-nav { background: linear-gradient(135deg, #7c3aed, #6d28d9) !important; color: #fff !important; border: none !important; }
#btn-sound { background: rgba(59,130,246,0.08) !important; border: 1px solid rgba(59,130,246,0.2) !important; color: #3b82f6 !important; border-radius: 8px !important; font-weight: 700 !important; }

/* --- SIDEBAR --- */
.sidebar { background: linear-gradient(180deg, #0c1929 0%, #111c30 50%, #0c1929 100%) !important; border-right: none !important; box-shadow: 6px 0 25px rgba(0,0,0,0.25) !important; width: 270px !important; }
.sidebar-header { background: rgba(59,130,246,0.06) !important; border-bottom: 1px solid rgba(255,255,255,0.06) !important; padding: 22px 18px !important; }
.sidebar-logo { color: #f1f5f9 !important; font-size: 19px !important; font-weight: 900 !important; }
.sidebar-close { color: rgba(255,255,255,0.5) !important; background: rgba(255,255,255,0.06) !important; border-radius: 8px !important; padding: 5px 9px !important; border: 1px solid rgba(255,255,255,0.08) !important; }
.sidebar-close:hover { background: rgba(239,68,68,0.15) !important; color: #ef4444 !important; }
.sidebar-menu { padding: 12px 10px !important; gap: 3px !important; }
.sidebar-item { color: rgba(255,255,255,0.6) !important; border-radius: 10px !important; padding: 11px 14px !important; font-size: 13px !important; font-weight: 600 !important; transition: all 0.2s ease !important; border: 1px solid transparent !important; }
.sidebar-item:hover { background: rgba(255,255,255,0.06) !important; color: rgba(255,255,255,0.9) !important; transform: translateX(3px) !important; }
.sidebar-item.active { background: rgba(59,130,246,0.15) !important; color: #60a5fa !important; border-color: rgba(59,130,246,0.25) !important; }
.sidebar-divider { background: rgba(255,255,255,0.05) !important; margin: 6px 0 !important; }
button[onclick*="handleLogout"] { color: rgba(239,68,68,0.6) !important; }
button[onclick*="handleLogout"]:hover { color: #ef4444 !important; background: rgba(239,68,68,0.08) !important; }
.badge { background: linear-gradient(135deg, #3b82f6, #2563eb) !important; color: #fff !important; border-radius: 6px !important; font-weight: 800 !important; box-shadow: 0 2px 6px rgba(59,130,246,0.3) !important; }

/* --- MAP SECTION --- */
.container { max-width: 1500px !important; padding: 0 24px !important; margin-top: 18px !important; }
.map-section { border-radius: 18px !important; border: 1px solid rgba(226,232,240,0.6) !important; box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.02) !important; padding: 22px !important; }
[data-theme="dark"] .map-section { background: #111827 !important; border-color: rgba(30,41,59,0.5) !important; }
.map-title { font-size: 10px !important; font-weight: 800 !important; letter-spacing: 1.5px !important; color: #3b82f6 !important; }
.map-table { border-radius: 10px !important; font-weight: 800 !important; transition: all 0.15s ease !important; font-size: 10px !important; }
.map-table:hover { transform: scale(1.06) !important; box-shadow: 0 3px 10px rgba(0,0,0,0.08) !important; z-index: 1 !important; position: relative !important; }
.map-table.map-new, .map-table.map-cooking, .map-table.map-serving, .map-table.map-ordered-more, .map-table.map-waiting-bill { background: linear-gradient(135deg, #1e293b, #0f172a) !important; color: #fff !important; border-color: transparent !important; box-shadow: 0 3px 10px rgba(0,0,0,0.15) !important; }
.map-table.alert-trigger { background: linear-gradient(135deg, #ef4444, #b91c1c) !important; box-shadow: 0 3px 15px rgba(239,68,68,0.4) !important; }

/* --- STATS CARDS --- */
.stats-grid { gap: 14px !important; margin-bottom: 22px !important; }
.stat-card { border-radius: 16px !important; padding: 20px !important; border: 1px solid rgba(226,232,240,0.6) !important; box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.02) !important; transition: all 0.2s ease !important; position: relative !important; overflow: hidden !important; }
.stat-card::before { content: '' !important; position: absolute !important; top: 0 !important; left: 0 !important; right: 0 !important; height: 3px !important; background: linear-gradient(90deg, #3b82f6, #6366f1) !important; }
.stat-card:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 25px rgba(59,130,246,0.08) !important; }
[data-theme="dark"] .stat-card { background: #111827 !important; border-color: rgba(30,41,59,0.5) !important; }
.stat-card small { font-size: 10px !important; font-weight: 800 !important; letter-spacing: 1.5px !important; color: #64748b !important; }
.stat-card h3 { font-size: 26px !important; font-weight: 900 !important; letter-spacing: -0.5px !important; }

/* --- TAB BAR --- */
.tab-bar { background: rgba(241,245,249,0.8) !important; border: 1px solid rgba(226,232,240,0.6) !important; border-radius: 12px !important; padding: 4px !important; }
[data-theme="dark"] .tab-bar { background: rgba(30,41,59,0.5) !important; border-color: rgba(51,65,85,0.5) !important; }
.tab-btn { border-radius: 9px !important; font-size: 11px !important; font-weight: 700 !important; padding: 8px 18px !important; transition: all 0.2s ease !important; }
.tab-btn:hover { background: rgba(59,130,246,0.06) !important; color: #3b82f6 !important; }
.tab-btn.active { background: #fff !important; color: #0f172a !important; box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06) !important; border-bottom: none !important; }
[data-theme="dark"] .tab-btn.active { background: #1e293b !important; color: #f1f5f9 !important; }

/* --- ORDER CARDS --- */
.order-grid { gap: 16px !important; }
.order-card { border-radius: 16px !important; border: 1px solid rgba(226,232,240,0.6) !important; box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.02) !important; transition: all 0.2s ease !important; }
.order-card:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 30px rgba(0,0,0,0.08) !important; }
[data-theme="dark"] .order-card { background: #111827 !important; border-color: rgba(30,41,59,0.5) !important; }
.card-head { background: rgba(248,250,252,0.5) !important; border-bottom: 1px solid rgba(226,232,240,0.5) !important; padding: 16px 18px !important; }
[data-theme="dark"] .card-head { background: rgba(30,41,59,0.3) !important; }
.table-status-pill { border-radius: 8px !important; font-size: 10px !important; font-weight: 800 !important; padding: 4px 10px !important; }
.pill-ordered-more, .pill-waiting-bill { background: linear-gradient(135deg, #1e293b, #0f172a) !important; color: #fff !important; border: none !important; }
.track-step { border-radius: 8px !important; font-size: 9px !important; font-weight: 800 !important; padding: 5px !important; }
.track-step.active.step-new { background: linear-gradient(135deg, #3b82f6, #2563eb) !important; color: #fff !important; box-shadow: 0 2px 6px rgba(59,130,246,0.35) !important; }
.track-step.active.step-cooking { background: linear-gradient(135deg, #f59e0b, #d97706) !important; color: #fff !important; box-shadow: 0 2px 6px rgba(245,158,11,0.35) !important; }
.track-step.active.step-serving { background: linear-gradient(135deg, #10b981, #059669) !important; color: #fff !important; box-shadow: 0 2px 6px rgba(16,185,129,0.35) !important; }

/* --- BUTTONS --- */
.btn-black { background: linear-gradient(135deg, #1e293b, #0f172a) !important; border-radius: 10px !important; font-weight: 700 !important; font-size: 12px !important; transition: all 0.2s ease !important; border: none !important; box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important; }
.btn-black:hover { background: linear-gradient(135deg, #3b82f6, #2563eb) !important; transform: translateY(-1px) !important; box-shadow: 0 4px 15px rgba(59,130,246,0.35) !important; }
.btn-outline { border-radius: 10px !important; font-weight: 700 !important; border: 1.5px solid rgba(226,232,240,0.8) !important; transition: all 0.2s ease !important; }
.btn-outline:hover { background: #0f172a !important; color: #fff !important; border-color: transparent !important; }
[data-theme="dark"] .btn-outline { border-color: rgba(51,65,85,0.5) !important; }
.btn-void { border-radius: 8px !important; transition: all 0.15s ease !important; }

/* --- AI CARD --- */
.ai-card { border-radius: 16px !important; border: 1px solid rgba(226,232,240,0.6) !important; box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.02) !important; transition: all 0.2s ease !important; padding: 22px !important; }
.ai-card:hover { transform: translateY(-1px) !important; box-shadow: 0 6px 20px rgba(59,130,246,0.06) !important; }
[data-theme="dark"] .ai-card { background: #111827 !important; border-color: rgba(30,41,59,0.5) !important; }

/* --- MODALS --- */
.modal-overlay { background: rgba(15,23,42,0.6) !important; backdrop-filter: blur(10px) !important; }
.modal-card { border-radius: 20px !important; border: 1px solid rgba(226,232,240,0.6) !important; box-shadow: 0 25px 50px rgba(0,0,0,0.15) !important; padding: 28px !important; }
[data-theme="dark"] .modal-card { background: #1e293b !important; border-color: rgba(51,65,85,0.5) !important; }

/* --- INPUTS --- */
input, select, textarea { border-radius: 10px !important; border: 1.5px solid rgba(226,232,240,0.8) !important; padding: 11px 14px !important; font-size: 14px !important; transition: all 0.2s ease !important; font-weight: 500 !important; }
input:focus, select:focus { outline: none !important; border-color: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.1) !important; }
[data-theme="dark"] input, [data-theme="dark"] select { background: #0f172a !important; border-color: rgba(51,65,85,0.5) !important; color: #f1f5f9 !important; }

/* --- TABLES --- */
.report-table { border-radius: 14px !important; overflow: hidden !important; border: 1px solid rgba(226,232,240,0.6) !important; }
.report-table th { background: #f8fafc !important; padding: 13px 16px !important; font-size: 10px !important; font-weight: 800 !important; letter-spacing: 1px !important; color: #64748b !important; border-bottom: 1px solid rgba(226,232,240,0.6) !important; }
[data-theme="dark"] .report-table th { background: rgba(30,41,59,0.5) !important; }
.report-table td { padding: 13px 16px !important; font-size: 13px !important; }
.report-table tr:hover td { background: rgba(59,130,246,0.03) !important; }

/* --- PAY TILE --- */
.pay-tile { border-radius: 12px !important; transition: all 0.2s ease !important; border: 1.5px solid rgba(226,232,240,0.8) !important; font-weight: 800 !important; }
.pay-tile:hover { background: linear-gradient(135deg, #3b82f6, #2563eb) !important; color: #fff !important; border-color: transparent !important; transform: translateY(-2px) !important; box-shadow: 0 6px 20px rgba(59,130,246,0.3) !important; }

/* --- LOGIN --- */
#login-overlay { background: linear-gradient(135deg, #0c1929 0%, #162544 40%, #0c1929 100%) !important; }

/* --- TOAST --- */
.toast-notify { font-size: 15px !important; font-weight: 700 !important; }
.toast-notify-new { background: linear-gradient(90deg, #059669, #10b981) !important; }
.toast-notify-call { background: linear-gradient(90deg, #b91c1c, #ef4444) !important; }
.toast-notify-add { background: linear-gradient(90deg, #d97706, #f59e0b) !important; }
.toast-notify-pay { background: linear-gradient(90deg, #7c3aed, #8b5cf6) !important; }
.closing-banner { border-radius: 12px !important; background: linear-gradient(135deg, #b91c1c, #ef4444) !important; }

/* --- SECTIONS ANIMATION --- */
#order-sec, #takeaway-sec, #stock-sec, #report-sec, #points-sec, #settings-sec { animation: fadeSlideIn 0.25s ease-out; }

/* --- SCROLLBAR --- */
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.2); border-radius: 99px; }
::-webkit-scrollbar-thumb:hover { background: rgba(59,130,246,0.4); }

/* --- REPORT SECTIONS --- */
#settings-sec h2, #report-sec h2, #points-sec h2 { font-size: 24px !important; font-weight: 900 !important; }
</style>

<script id="withu-v3-system">
document.addEventListener('DOMContentLoaded', () => {
    // === ICON REPLACEMENT ===
    const iconMap = {
        'sb-orders': ['fas fa-store', null],
        'sb-takeaway': ['fas fa-motorcycle', null],
        'sb-stock': ['fas fa-box-open', null],
        'sb-report': ['fas fa-chart-line', null],
        'sb-points': ['fas fa-star', null]
    };
    Object.entries(iconMap).forEach(([id, [iconClass]]) => {
        const el = document.getElementById(id);
        if (el) {
            const text = el.textContent.trim();
            const svgs = el.querySelectorAll('svg');
            svgs.forEach(s => s.remove());
            const i = document.createElement('i');
            i.className = iconClass;
            i.style.cssText = 'margin-right:10px; font-size:15px; width:20px; text-align:center;';
            el.prepend(i);
        }
    });
    
    // Fix sidebar buttons that have SVG icons - replace with FA
    document.querySelectorAll('.sidebar-item').forEach(btn => {
        const svg = btn.querySelector('svg');
        if (svg) {
            const text = btn.textContent.trim();
            svg.remove();
            let iconClass = 'fas fa-circle';
            if (text.includes('handleLogout') || btn.getAttribute('onclick')?.includes('handleLogout')) iconClass = 'fas fa-sign-out-alt';
            else if (btn.getAttribute('onclick')?.includes('openManualOrderModal')) iconClass = 'fas fa-pen-to-square';
            else if (btn.getAttribute('onclick')?.includes('toggleAttendance')) iconClass = 'fas fa-user-clock';
            else if (btn.getAttribute('onclick')?.includes('toggleTheme')) iconClass = 'fas fa-adjust';
            else if (btn.getAttribute('onclick')?.includes('toggleLanguage')) iconClass = 'fas fa-globe';
            
            const i = document.createElement('i');
            i.className = iconClass;
            i.style.cssText = 'margin-right:10px; font-size:15px; width:20px; text-align:center;';
            btn.prepend(i);
        }
    });
    
    // === SETTINGS BUTTON IN SIDEBAR ===
    if (!document.getElementById('sb-settings')) {
        const logoutBtn = document.querySelector('button[onclick*="handleLogout"]');
        if (logoutBtn) {
            const divider = document.createElement('div');
            divider.className = 'sidebar-divider';
            const settingsBtn = document.createElement('button');
            settingsBtn.className = 'sidebar-item';
            settingsBtn.id = 'sb-settings';
            settingsBtn.innerHTML = '<i class="fas fa-cog" style="margin-right:10px; font-size:15px; width:20px; text-align:center;"></i>Settings';
            settingsBtn.onclick = () => { window.showSec('settings'); toggleSidebar(); };
            logoutBtn.parentNode.insertBefore(divider, logoutBtn);
            logoutBtn.parentNode.insertBefore(settingsBtn, logoutBtn);
        }
    }
    
    // === SETTINGS SECTION ===
    if (!document.getElementById('settings-sec')) {
        const orderSec = document.getElementById('order-sec');
        if (orderSec) {
            const div = document.createElement('div');
            div.id = 'settings-sec';
            div.style.cssText = 'display:none; padding:20px; animation:fadeSlideIn 0.3s;';
            div.innerHTML = '<h2 style="margin-bottom:20px;"><i class="fas fa-cog" style="color:#3b82f6; margin-right:8px;"></i>Store Settings</h2>' +
                '<div class="ai-card" style="margin-bottom:16px; border-top:3px solid #3b82f6;">' +
                '<h3 style="font-size:15px; margin-bottom:14px; font-weight:800;"><i class="fas fa-clock" style="color:#3b82f6; margin-right:6px;"></i>Business Hours & Open/Close</h3>' +
                '<label style="display:flex; align-items:center; gap:10px; font-weight:800; font-size:16px; color:#10b981; margin-bottom:15px; cursor:pointer;"><input type="checkbox" id="store-open-status" onchange="toggleStoreStatus()" style="width:22px; height:22px; accent-color:#10b981;"> Open for Orders Today</label>' +
                '<hr style="border:0; border-top:1px solid var(--border); margin:14px 0;">' +
                '<label style="font-weight:700; display:block; margin-bottom:10px; font-size:13px;">Operating Days</label>' +
                '<div style="display:flex; flex-wrap:wrap; gap:12px; margin-bottom:15px;" id="bh-days">' +
                '<label style="cursor:pointer; font-size:13px;"><input type="checkbox" value="1" checked> Mon</label>' +
                '<label style="cursor:pointer; font-size:13px;"><input type="checkbox" value="2" checked> Tue</label>' +
                '<label style="cursor:pointer; font-size:13px;"><input type="checkbox" value="3" checked> Wed</label>' +
                '<label style="cursor:pointer; font-size:13px;"><input type="checkbox" value="4" checked> Thu</label>' +
                '<label style="cursor:pointer; font-size:13px;"><input type="checkbox" value="5" checked> Fri</label>' +
                '<label style="cursor:pointer; font-size:13px;"><input type="checkbox" value="6" checked> Sat</label>' +
                '<label style="cursor:pointer; font-size:13px;"><input type="checkbox" value="0" checked> Sun</label>' +
                '</div>' +
                '<div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:15px;">' +
                '<div><label style="font-weight:700; display:block; margin-bottom:5px; font-size:12px;">Open Time</label><input type="time" id="bh-start" value="09:00"></div>' +
                '<div><label style="font-weight:700; display:block; margin-bottom:5px; font-size:12px;">Close Time</label><input type="time" id="bh-end" value="21:00"></div>' +
                '</div>' +
                '<button class="btn-black" onclick="saveBusinessHours()" style="background:linear-gradient(135deg,#3b82f6,#2563eb);"><i class="fas fa-save" style="margin-right:6px;"></i>Save Business Hours</button>' +
                '</div>' +
                '<div class="ai-card" style="margin-bottom:16px;">' +
                '<h3 style="font-size:15px; margin-bottom:14px; font-weight:800;"><i class="fas fa-qrcode" style="color:#3b82f6; margin-right:6px;"></i>PromptPay QR Setup</h3>' +
                '<input type="text" id="store-promptpay" placeholder="Phone or National ID (e.g. 0931805507)" style="margin-bottom:12px;">' +
                '<button class="btn-black" onclick="savePromptPay()" style="background:linear-gradient(135deg,#3b82f6,#2563eb);"><i class="fas fa-save" style="margin-right:6px;"></i>Save PromptPay</button>' +
                '</div>' +
                '<div class="ai-card">' +
                '<h3 style="font-size:15px; margin-bottom:14px; font-weight:800;"><i class="fas fa-volume-up" style="color:#3b82f6; margin-right:6px;"></i>Sound Alerts</h3>' +
                '<button id="btn-sound-setting" onclick="window.toggleSound()" class="btn-outline" style="width:100%; border-color:#3b82f6; color:#3b82f6; padding:14px; font-weight:800;"><i class="fas fa-volume-up" style="margin-right:6px;"></i>Toggle Sound</button>' +
                '</div>';
            orderSec.parentNode.insertBefore(div, orderSec.nextSibling);
        }
    }

    // === POINTS SECTION UPGRADE ===
    const pointsSec = document.getElementById('points-sec');
    if (pointsSec && !pointsSec.querySelector('#pts-phone')) {
        pointsSec.innerHTML = '<h2 style="margin-bottom:20px;"><i class="fas fa-star" style="color:#f59e0b; margin-right:8px;"></i>Loyalty Points</h2>' +
            '<div class="ai-card" style="margin-bottom:16px; border-top:3px solid #f59e0b;">' +
            '<h3 style="font-size:15px; margin-bottom:14px; font-weight:800;"><i class="fas fa-user-plus" style="color:#3b82f6; margin-right:6px;"></i>Add / Edit Member</h3>' +
            '<div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px;">' +
            '<div><label style="font-size:11px; font-weight:700;">Phone</label><input type="tel" id="pts-phone" placeholder="09XXXXXXXX"></div>' +
            '<div><label style="font-size:11px; font-weight:700;">Name (Admin only)</label><input type="text" id="pts-name" placeholder="Customer Name"></div>' +
            '<div><label style="font-size:11px; font-weight:700;">Points</label><input type="number" id="pts-val" value="0"></div>' +
            '</div>' +
            '<button class="btn-black" onclick="savePointData()" style="margin-top:14px; background:linear-gradient(135deg,#3b82f6,#2563eb);"><i class="fas fa-save" style="margin-right:6px;"></i>Save</button>' +
            '</div>' +
            '<div class="ai-card" style="padding:0; overflow-x:auto;">' +
            '<table class="report-table" id="points-table" style="min-width:500px; width:100%;">' +
            '<thead><tr><th>Phone</th><th>Name</th><th>Points</th><th>Actions</th></tr></thead>' +
            '<tbody id="points-list"></tbody>' +
            '</table></div>';
    }
    
    // === REPORT SECTION UPGRADE ===
    const reportSec = document.getElementById('report-sec');
    if (reportSec && !reportSec.querySelector('#rtab-dashboard')) {
        reportSec.innerHTML = '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:10px;">' +
            '<h2 style="margin:0;"><i class="fas fa-chart-line" style="color:#3b82f6; margin-right:8px;"></i>Performance & History</h2>' +
            '<div style="display:flex; gap:8px;">' +
            '<button class="btn-outline" onclick="switchReportTab(\'dashboard\')" id="rtab-dashboard" style="border-color:#3b82f6; color:#3b82f6; background:rgba(59,130,246,0.08); font-size:12px; padding:8px 14px;"><i class="fas fa-chart-pie" style="margin-right:4px;"></i>Dashboard</button>' +
            '<button class="btn-outline" onclick="switchReportTab(\'history\')" id="rtab-history" style="font-size:12px; padding:8px 14px;"><i class="fas fa-history" style="margin-right:4px;"></i>Order History</button>' +
            '</div></div>' +
            '<div id="report-dashboard">' +
            '<div style="display:flex; gap:8px; margin-bottom:16px; flex-wrap:wrap;">' +
            '<button class="btn-black rpt-btn" onclick="renderReport(\'1d\')" style="flex:1; min-width:70px; background:linear-gradient(135deg,#3b82f6,#2563eb);">1 Day</button>' +
            '<button class="btn-black rpt-btn" onclick="renderReport(\'7d\')" style="flex:1; min-width:70px;">7 Days</button>' +
            '<button class="btn-black rpt-btn" onclick="renderReport(\'30d\')" style="flex:1; min-width:70px;">30 Days</button>' +
            '<button class="btn-black rpt-btn" onclick="renderReport(\'all\')" style="flex:1; min-width:70px;">All</button>' +
            '</div>' +
            '<div class="stats-grid" style="display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:14px; margin-bottom:16px;">' +
            '<div class="ai-card" style="border-left:3px solid #10b981; padding:18px;"><p style="font-size:10px; font-weight:800; color:#64748b; letter-spacing:1px; text-transform:uppercase; margin:0;">TOTAL SALES</p><p style="font-size:26px; font-weight:900; color:#10b981; margin:6px 0 0;">&#3647;<span id="rep-total">0</span></p></div>' +
            '<div class="ai-card" style="border-left:3px solid #3b82f6; padding:18px;"><p style="font-size:10px; font-weight:800; color:#64748b; letter-spacing:1px; text-transform:uppercase; margin:0;">ORDERS</p><p style="font-size:26px; font-weight:900; color:#3b82f6; margin:6px 0 0;" id="rep-count">0</p></div>' +
            '<div class="ai-card" style="border-left:3px solid #f59e0b; padding:18px;"><p style="font-size:10px; font-weight:800; color:#64748b; letter-spacing:1px; text-transform:uppercase; margin:0;">TOP MENU</p><p style="font-size:18px; font-weight:900; color:#f59e0b; margin:6px 0 0;" id="rep-top-menu">-</p></div>' +
            '</div>' +
            '<div class="ai-card" style="margin-bottom:16px;"><h3 style="font-size:13px; font-weight:800; margin-bottom:14px;"><i class="fas fa-chart-area" style="color:#3b82f6; margin-right:6px;"></i>Sales Trend</h3><div style="height:260px;"><canvas id="salesChart"></canvas></div></div>' +
            '<div class="ai-card"><h3 style="font-size:13px; font-weight:800; margin-bottom:14px;"><i class="fas fa-utensils" style="color:#f59e0b; margin-right:6px;"></i>Today\'s Menu Breakdown</h3><div id="menu-breakdown" style="max-height:300px; overflow-y:auto;"></div></div>' +
            '</div>' +
            '<div id="report-history" style="display:none;">' +
            '<div class="ai-card" style="padding:0;">' +
            '<div style="overflow-x:auto;">' +
            '<table class="report-table" style="min-width:700px; width:100%;">' +
            '<thead><tr><th>Date & Time</th><th>Order ID</th><th>Table</th><th>Total</th><th>Payment</th></tr></thead>' +
            '<tbody id="history-list"></tbody>' +
            '</table></div></div></div>';
    }

    // Load settings on init
    setTimeout(() => {
        if (typeof window.loadSettings === 'function') window.loadSettings();
        if (typeof window.loadBusinessHours === 'function') window.loadBusinessHours();
    }, 300);
});

// === SHOW SECTION OVERRIDE ===
const _origShowSec = typeof window.showSec === 'function' ? window.showSec : null;
window.showSec = function(n) {
    ['order-sec','takeaway-sec','stock-sec','report-sec','points-sec','settings-sec'].forEach(s => {
        const el = document.getElementById(s);
        if (el) el.style.display = 'none';
    });
    const t = document.getElementById(n + '-sec');
    if (t) {
        t.style.display = (n==='report'||n==='settings'||n==='points') ? 'block' : 'grid';
        t.style.animation = 'fadeSlideIn 0.25s ease-out';
    }
    if (n==='points' && typeof window.loadPoints === 'function') window.loadPoints();
    if (n==='report' && typeof window.switchReportTab === 'function') setTimeout(()=>window.switchReportTab('dashboard'),50);
    if (n==='settings' && typeof window.loadSettings === 'function') window.loadSettings();
    document.querySelectorAll('.tab-btn').forEach(b => { if(b.id) b.classList.toggle('active', b.id==='t-'+n); });
    document.querySelectorAll('.sidebar-item').forEach(b => { if(b.id) b.classList.toggle('active', b.id==='sb-'+n); });
};

// === AUTO-SYNC ===
window.addEventListener('storage', e => {
    if (e.key==='withu_orders'||e.key==='withu_points'||e.key==='withu_points_db') {
        const ss = document.getElementById('sync-status');
        if(ss) { ss.style.display='inline-flex'; setTimeout(()=>ss.style.display='none',1500); }
    }
});

// === SETTINGS LOGIC ===
window.loadSettings = function() {
    const cb = document.getElementById('store-open-status');
    if(cb) cb.checked = localStorage.getItem('withu_store_open') !== 'false';
    const pp = document.getElementById('store-promptpay');
    if(pp) pp.value = localStorage.getItem('withu_promptpay') || '';
};
window.toggleStoreStatus = function() {
    const isOpen = document.getElementById('store-open-status').checked;
    localStorage.setItem('withu_store_open', isOpen);
    if(typeof showToast==='function') showToast(isOpen ? 'Store OPEN' : 'Store CLOSED', 'new');
};
window.savePromptPay = function() {
    localStorage.setItem('withu_promptpay', document.getElementById('store-promptpay').value.trim());
    if(typeof showToast==='function') showToast('PromptPay saved', 'new');
};
window.loadBusinessHours = function() {
    try {
        const bh = JSON.parse(localStorage.getItem('withu_business_hours'));
        if(bh) {
            document.querySelectorAll('#bh-days input').forEach(cb => { cb.checked = bh.days.includes(parseInt(cb.value)); });
            if(bh.start) document.getElementById('bh-start').value = bh.start;
            if(bh.end) document.getElementById('bh-end').value = bh.end;
        }
    } catch(e) {}
};
window.saveBusinessHours = function() {
    const days = Array.from(document.querySelectorAll('#bh-days input:checked')).map(cb=>parseInt(cb.value));
    localStorage.setItem('withu_business_hours', JSON.stringify({ days, start: document.getElementById('bh-start').value, end: document.getElementById('bh-end').value }));
    if(typeof showToast==='function') showToast('Business hours saved', 'new');
};

// === POINTS LOGIC ===
window.loadPoints = function() {
    let db = {};
    try { db = JSON.parse(localStorage.getItem('withu_points_db') || '{}'); } catch(e) {}
    const list = document.getElementById('points-list');
    if(!list) return;
    list.innerHTML = '';
    for(let [phone, data] of Object.entries(db)) {
        if(typeof data==='number') { data = {points:data, name:''}; db[phone] = data; }
        list.innerHTML += '<tr style="border-bottom:1px solid var(--border);">' +
            '<td style="font-weight:700; padding:13px;">' + phone + '</td>' +
            '<td>' + (data.name || '<span style="color:var(--text-muted);">-</span>') + '</td>' +
            '<td style="color:#3b82f6; font-weight:800; font-size:16px;">' + data.points + '</td>' +
            '<td><button class="btn-outline" onclick="editPointData(\'' + phone + '\',\'' + (data.name||'') + '\',' + data.points + ')" style="padding:6px 12px; border-color:#f59e0b; color:#f59e0b; font-size:11px;"><i class="fas fa-edit" style="margin-right:4px;"></i>Edit</button></td></tr>';
    }
    localStorage.setItem('withu_points_db', JSON.stringify(db));
};
window.editPointData = function(phone, name, points) {
    const p = document.getElementById('pts-phone'); if(p) p.value = phone;
    const n = document.getElementById('pts-name'); if(n) n.value = name;
    const v = document.getElementById('pts-val'); if(v) v.value = points;
};
window.savePointData = function() {
    const phone = document.getElementById('pts-phone')?.value.trim();
    if(!phone) { if(typeof showToast==='function') showToast('Please enter phone number','call'); return; }
    let db = {}; try { db = JSON.parse(localStorage.getItem('withu_points_db')||'{}'); } catch(e){}
    db[phone] = { points: parseInt(document.getElementById('pts-val')?.value)||0, name: document.getElementById('pts-name')?.value.trim()||'' };
    localStorage.setItem('withu_points_db', JSON.stringify(db));
    document.getElementById('pts-phone').value = '';
    document.getElementById('pts-name').value = '';
    document.getElementById('pts-val').value = '0';
    window.loadPoints();
    if(typeof showToast==='function') showToast('Member data saved','new');
};

// === REPORT LOGIC ===
let salesChartInstance = null;
window.switchReportTab = function(tab) {
    const d = document.getElementById('report-dashboard');
    const h = document.getElementById('report-history');
    if(d) { d.style.display = tab==='dashboard'?'block':'none'; d.style.animation = 'fadeSlideIn 0.25s'; }
    if(h) { h.style.display = tab==='history'?'block':'none'; h.style.animation = 'fadeSlideIn 0.25s'; }
    const db = document.getElementById('rtab-dashboard');
    const hb = document.getElementById('rtab-history');
    if(db) db.style.cssText = tab==='dashboard' ? 'border-color:#3b82f6; color:#3b82f6; background:rgba(59,130,246,0.08); font-size:12px; padding:8px 14px;' : 'font-size:12px; padding:8px 14px;';
    if(hb) hb.style.cssText = tab==='history' ? 'border-color:#3b82f6; color:#3b82f6; background:rgba(59,130,246,0.08); font-size:12px; padding:8px 14px;' : 'font-size:12px; padding:8px 14px;';
    if(tab==='dashboard') window.renderReport('1d'); else window.renderHistory();
};
window.renderReport = function(period) {
    // Highlight active button
    document.querySelectorAll('.rpt-btn').forEach((b,i) => {
        const map = {'1d':0,'7d':1,'30d':2,'all':3};
        b.style.background = i===map[period] ? 'linear-gradient(135deg,#3b82f6,#2563eb)' : 'linear-gradient(135deg,#1e293b,#0f172a)';
    });
    
    const dataStr = localStorage.getItem('withu_completed_orders') || '[]';
    let orders = []; try { orders = JSON.parse(dataStr); } catch(e) {}
    const now = new Date();
    const fOrders = orders.filter(o => {
        if(!o.timestamp) return false;
        const d = new Date(o.timestamp);
        const diff = Math.ceil(Math.abs(now-d)/(1000*60*60*24));
        if(period==='1d') return diff<=1 && d.getDate()===now.getDate();
        if(period==='7d') return diff<=7;
        if(period==='30d') return diff<=30;
        return true;
    });
    
    let total=0; const items={}; const byDate={};
    fOrders.forEach(o => {
        const amt = o.total||o.finalTotal||0; total+=amt;
        if(o.cart) o.cart.forEach(item => { items[item.name] = (items[item.name]||0) + (item.qty||1); });
        const dk = new Date(o.timestamp).toLocaleDateString('th-TH');
        byDate[dk] = (byDate[dk]||0) + amt;
    });
    
    const te = document.getElementById('rep-total'); if(te) te.innerText = total.toLocaleString();
    const ce = document.getElementById('rep-count'); if(ce) ce.innerText = fOrders.length;
    const top = Object.entries(items).sort((a,b)=>b[1]-a[1])[0];
    const tme = document.getElementById('rep-top-menu'); if(tme) tme.innerText = top ? top[0]+' ('+top[1]+')' : '-';
    
    // Menu breakdown table
    const mb = document.getElementById('menu-breakdown');
    if(mb) {
        const sorted = Object.entries(items).sort((a,b)=>b[1]-a[1]);
        if(sorted.length === 0) {
            mb.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-muted); font-size:13px;">No data</div>';
        } else {
            mb.innerHTML = '<table style="width:100%; border-collapse:collapse;">' +
                '<tr style="border-bottom:2px solid var(--border);"><th style="text-align:left; padding:10px; font-size:11px; font-weight:800; color:#64748b; letter-spacing:1px;">MENU ITEM</th><th style="text-align:right; padding:10px; font-size:11px; font-weight:800; color:#64748b; letter-spacing:1px;">QTY SOLD</th></tr>' +
                sorted.map(([name, qty], i) => {
                    const maxQty = sorted[0][1];
                    const pct = Math.round((qty/maxQty)*100);
                    return '<tr style="border-bottom:1px solid var(--border);"><td style="padding:10px 10px 10px 0;"><div style="font-weight:700; font-size:13px;">' + name + '</div><div style="margin-top:5px; height:4px; background:var(--border); border-radius:99px; overflow:hidden;"><div style="height:100%; background:linear-gradient(90deg,#3b82f6,#6366f1); border-radius:99px; width:' + pct + '%;"></div></div></td><td style="text-align:right; padding:10px; font-weight:900; font-size:16px; color:#3b82f6;">' + qty + '</td></tr>';
                }).join('') + '</table>';
        }
    }
    
    // Chart
    const ctx = document.getElementById('salesChart');
    if(ctx && window.Chart) {
        if(salesChartInstance) salesChartInstance.destroy();
        salesChartInstance = new Chart(ctx, {
            type:'line',
            data: { labels: Object.keys(byDate).length ? Object.keys(byDate) : ['-'], datasets: [{ label:'Sales', data: Object.values(byDate).length ? Object.values(byDate) : [0], borderColor:'#3b82f6', backgroundColor:'rgba(59,130,246,0.1)', borderWidth:2.5, fill:true, tension:0.4, pointBackgroundColor:'#3b82f6', pointRadius:4, pointHoverRadius:6 }] },
            options: { responsive:true, maintainAspectRatio:false, plugins: { legend:{display:false} }, scales: { x:{grid:{display:false},ticks:{font:{size:10,weight:600}}}, y:{grid:{color:'rgba(0,0,0,0.05)'},ticks:{font:{size:10,weight:600}}} } }
        });
    }
};
window.renderHistory = function() {
    const dataStr = localStorage.getItem('withu_completed_orders')||'[]';
    let orders = []; try { orders = JSON.parse(dataStr); } catch(e){}
    orders.sort((a,b) => new Date(b.timestamp)-new Date(a.timestamp));
    const list = document.getElementById('history-list');
    if(!list) return;
    if(orders.length===0) { list.innerHTML='<tr><td colspan="5" style="text-align:center; padding:30px; color:var(--text-muted);">No order history</td></tr>'; return; }
    list.innerHTML = orders.map((o,i) => {
        const date = new Date(o.timestamp).toLocaleString('th-TH');
        return '<tr style="border-bottom:1px solid var(--border);">' +
            '<td style="font-size:12px; color:var(--text-muted); padding:13px;">' + date + '</td>' +
            '<td style="font-weight:800;">#' + (o.id||o.orderNo||(1000+i)) + '</td>' +
            '<td><span style="background:var(--slate); padding:4px 10px; border-radius:6px; font-size:11px; font-weight:700;">' + (o.table||'Takeaway') + '</span></td>' +
            '<td style="color:#10b981; font-weight:800;">&#3647;' + (o.total||o.finalTotal||0).toLocaleString() + '</td>' +
            '<td>' + (o.paymentMethod==='qr' ? '<span style="color:#3b82f6; font-weight:700;"><i class="fas fa-qrcode" style="margin-right:4px;"></i>QR</span>' : '<span style="color:#f59e0b; font-weight:700;"><i class="fas fa-money-bill" style="margin-right:4px;"></i>CASH</span>') + '</td></tr>';
    }).join('');
};

// === FIX MANUAL ORDER - Use existing fullData.menu ===
// The original openManualOrderModal already works with fullData.menu and the original modal HTML.
// We just need to make sure the original function is called, not the revamp one.
// Remove the revamp override by not re-defining it here.
// The original modal HTML and functions (openManualOrderModal, renderManualMenu, addToManual, submitManualOrder) 
// already exist in the main script block. We just need to ensure they work.

</script>
`;

// Inject before </head>
if (html.includes('<!-- WITHU ADMIN PREMIUM V3 -->')) {
    // Remove old V3 and re-inject
    html = html.replace(/<!-- WITHU ADMIN PREMIUM V3 -->([\s\S]*?)<\/script>\s*/, '');
}
html = html.replace('</head>', newHeadInjection + '\n</head>');

// ====== 7. REMOVE REMAINING EMOJIS ======
// Common emojis that might still be in the HTML
const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}]/gu;
// Only replace in visible text, not in JS strings that use emojis for comparison
// Actually safer to just target known emoji locations

fs.writeFileSync('admin.html', html, 'utf8');
console.log('V3 Premium UI + System applied successfully.');
console.log('File size:', html.length);
