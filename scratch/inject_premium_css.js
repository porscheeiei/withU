const fs = require('fs');
let html = fs.readFileSync('d:/withu/withU/admin.html', 'utf8');

const premiumCSS = `
/* ====================================================
   WITHU ADMIN — PREMIUM UI OVERHAUL v3.0
   CSS-only override. No logic touched.
==================================================== */

/* ---------- 1. Design Tokens ---------- */
:root {
    --primary: #6366f1;
    --primary-dark: #4f46e5;
    --primary-glow: rgba(99,102,241,0.25);
    --success: #10b981;
    --danger: #ef4444;
    --warning: #f59e0b;
    --bg: #f3f4f8;
    --surface: #ffffff;
    --surface2: #f9fafb;
    --text-main: #111827;
    --text-muted: #6b7280;
    --border: #e5e7eb;
    --slate: #f3f4f6;
    --radius: 16px;
    --shadow: 0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04);
    --shadow-md: 0 4px 20px rgba(0,0,0,0.10);
    --shadow-lg: 0 8px 40px rgba(0,0,0,0.14);
    --sidebar-w: 270px;
    --nav-h: 62px;
    --transition: 0.22s cubic-bezier(0.4,0,0.2,1);
}
[data-theme="dark"] {
    --bg: #0d0f14;
    --surface: #161a24;
    --surface2: #1e2330;
    --text-main: #f1f5f9;
    --text-muted: #64748b;
    --border: #2a2f3e;
    --slate: #1e2330;
    --shadow: 0 2px 8px rgba(0,0,0,0.4);
    --shadow-md: 0 4px 24px rgba(0,0,0,0.5);
}

/* ---------- 2. Base ---------- */
body {
    background: var(--bg) !important;
    font-family: 'Inter','Prompt',sans-serif !important;
}

/* ---------- 3. Topbar (op-bar) ---------- */
.op-bar {
    background: linear-gradient(90deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%) !important;
    padding: 10px 24px !important;
    font-size: 10px !important;
    letter-spacing: 1.5px !important;
    border-bottom: 1px solid rgba(255,255,255,0.05) !important;
}

/* ---------- 4. Navbar (top-nav) ---------- */
.top-nav {
    background: var(--surface) !important;
    border-bottom: 1px solid var(--border) !important;
    padding: 0 24px !important;
    height: var(--nav-h) !important;
    display: flex !important;
    align-items: center !important;
    box-shadow: 0 1px 0 var(--border), 0 2px 16px rgba(0,0,0,0.04) !important;
    position: sticky !important; top: 0 !important; z-index: 1000 !important;
}

.logo {
    font-weight: 900 !important;
    font-size: 15px !important;
    letter-spacing: 1.5px !important;
    background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    background-clip: text !important;
}

.hamburger-btn {
    width: 38px !important; height: 38px !important;
    border-radius: 10px !important;
    border: 1px solid var(--border) !important;
    background: var(--surface) !important;
    color: var(--text-main) !important;
    display: flex !important; align-items: center !important; justify-content: center !important;
    cursor: pointer !important; transition: var(--transition) !important;
    margin-right: 14px !important;
}
.hamburger-btn:hover { background: var(--slate) !important; }

/* ---------- 5. SIDEBAR ---------- */
.sidebar {
    width: var(--sidebar-w) !important;
    background: linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 40%, #16213e 100%) !important;
    padding: 0 !important;
    box-shadow: 4px 0 32px rgba(0,0,0,0.35) !important;
    border-right: 1px solid rgba(255,255,255,0.06) !important;
}
.sidebar-header {
    padding: 24px 20px 20px !important;
    border-bottom: 1px solid rgba(255,255,255,0.07) !important;
    display: flex !important; align-items: center !important; justify-content: space-between !important;
}
.sidebar-logo {
    font-size: 14px !important; font-weight: 900 !important;
    letter-spacing: 3px !important; text-transform: uppercase !important;
    background: linear-gradient(135deg,#a5b4fc,#818cf8) !important;
    -webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important;
    background-clip: text !important;
}
.sidebar-close {
    width: 30px !important; height: 30px !important;
    border-radius: 8px !important;
    background: rgba(255,255,255,0.06) !important;
    color: #94a3b8 !important;
    border: none !important; cursor: pointer !important;
    display: flex !important; align-items: center !important; justify-content: center !important;
    transition: var(--transition) !important;
}
.sidebar-close:hover { background: rgba(255,255,255,0.12) !important; color: #fff !important; }

.sidebar-menu {
    padding: 16px 12px !important;
    display: flex !important; flex-direction: column !important; gap: 2px !important;
}
.sidebar-item {
    display: flex !important; align-items: center !important;
    padding: 12px 14px !important;
    border-radius: 12px !important;
    font-size: 13px !important; font-weight: 600 !important;
    color: #94a3b8 !important;
    background: transparent !important;
    border: none !important; cursor: pointer !important;
    text-align: left !important; width: 100% !important;
    transition: var(--transition) !important;
    letter-spacing: 0.1px !important;
    position: relative !important; overflow: hidden !important;
}
.sidebar-item::before {
    content: '' !important;
    position: absolute !important; left: 0 !important; top: 0 !important;
    height: 100% !important; width: 0 !important;
    background: linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.08)) !important;
    transition: width 0.22s ease !important;
    border-radius: 12px !important;
}
.sidebar-item:hover { color: #e2e8f0 !important; }
.sidebar-item:hover::before { width: 100% !important; }
.sidebar-item:hover svg { stroke: #a5b4fc !important; }

.sidebar-item.active, .sidebar-item[style*="color: rgb(239"] {
    background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.12)) !important;
    color: #a5b4fc !important;
    border: 1px solid rgba(99,102,241,0.2) !important;
}

.sidebar-divider {
    height: 1px !important;
    background: rgba(255,255,255,0.06) !important;
    margin: 8px 4px !important;
    border: none !important;
}
.sidebar-overlay { background: rgba(0,0,0,0.6) !important; backdrop-filter: blur(4px) !important; }

/* ---------- 6. Container + Map ---------- */
.container { padding: 24px !important; max-width: 1500px !important; }

.map-section {
    background: var(--surface) !important;
    border: 1px solid var(--border) !important;
    border-radius: var(--radius) !important;
    padding: 20px 24px !important;
    box-shadow: var(--shadow) !important;
    margin-bottom: 20px !important;
}
.map-title {
    font-size: 10px !important; font-weight: 800 !important;
    letter-spacing: 2px !important; text-transform: uppercase !important;
    color: var(--text-muted) !important; margin-bottom: 16px !important;
}
.map-table {
    border-radius: 10px !important;
    font-size: 11px !important; font-weight: 800 !important;
    border: 1.5px solid var(--border) !important;
    background: var(--surface) !important;
    transition: all 0.18s ease !important;
    cursor: pointer !important;
    padding: 10px 4px !important;
}
.map-table:hover { transform: translateY(-2px) !important; box-shadow: var(--shadow-md) !important; }
.map-table.map-new,
.map-table.map-cooking,
.map-table.map-serving,
.map-table.map-ordered-more,
.map-table.map-waiting-bill {
    background: linear-gradient(135deg, #1a1a2e, #16213e) !important;
    color: #e2e8f0 !important; border-color: #4f46e5 !important;
    box-shadow: 0 0 12px rgba(99,102,241,0.3) !important;
}
.map-table.alert-trigger {
    background: linear-gradient(135deg,#ef4444,#dc2626) !important;
    border-color: #ef4444 !important;
    box-shadow: 0 0 16px rgba(239,68,68,0.5) !important;
}

/* ---------- 7. Stat Cards ---------- */
.stats-grid { gap: 16px !important; margin-bottom: 20px !important; }
.stat-card {
    background: var(--surface) !important;
    border: 1px solid var(--border) !important;
    border-radius: var(--radius) !important;
    padding: 22px 24px !important;
    box-shadow: var(--shadow) !important;
    position: relative !important; overflow: hidden !important;
    transition: var(--transition) !important;
}
.stat-card::after {
    content: '' !important; position: absolute !important;
    top: 0 !important; right: 0 !important;
    width: 60px !important; height: 60px !important;
    background: linear-gradient(135deg, var(--primary), var(--primary-dark)) !important;
    opacity: 0.07 !important; border-radius: 0 var(--radius) 0 60px !important;
}
.stat-card:hover { transform: translateY(-3px) !important; box-shadow: var(--shadow-md) !important; }
.stat-card small {
    font-size: 10px !important; font-weight: 700 !important;
    letter-spacing: 1.5px !important; text-transform: uppercase !important;
    color: var(--text-muted) !important;
}
.stat-card h3 {
    font-size: 28px !important; font-weight: 900 !important;
    margin: 6px 0 0 !important; letter-spacing: -1px !important;
    background: linear-gradient(135deg, var(--text-main), var(--text-muted)) !important;
    -webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important;
    background-clip: text !important;
}

/* ---------- 8. Tab Bar ---------- */
.tab-bar {
    display: flex !important; gap: 4px !important;
    background: var(--surface) !important;
    border: 1px solid var(--border) !important;
    border-radius: 14px !important;
    padding: 5px !important;
    width: fit-content !important;
    box-shadow: var(--shadow) !important;
    margin-bottom: 20px !important;
}
.tab-btn {
    padding: 9px 20px !important;
    border-radius: 10px !important;
    font-size: 12px !important; font-weight: 700 !important;
    color: var(--text-muted) !important;
    background: transparent !important;
    border: none !important; cursor: pointer !important;
    transition: var(--transition) !important;
    text-transform: uppercase !important; letter-spacing: 0.5px !important;
    white-space: nowrap !important;
}
.tab-btn:hover { color: var(--text-main) !important; background: var(--slate) !important; }
.tab-btn.active {
    background: linear-gradient(135deg,#6366f1,#8b5cf6) !important;
    color: #fff !important;
    box-shadow: 0 4px 14px rgba(99,102,241,0.35) !important;
}

/* ---------- 9. Order Cards ---------- */
.order-grid { gap: 18px !important; }
.order-card {
    border-radius: var(--radius) !important;
    border: 1px solid var(--border) !important;
    box-shadow: var(--shadow) !important;
    transition: var(--transition) !important;
    overflow: hidden !important;
}
.order-card:hover { transform: translateY(-3px) !important; box-shadow: var(--shadow-md) !important; }
.order-card.sla-trigger {
    border: 2px solid #ef4444 !important;
    box-shadow: 0 0 0 4px rgba(239,68,68,0.08) !important;
}
.card-head {
    padding: 16px 18px !important;
    border-bottom: 1px solid var(--border) !important;
    background: var(--surface) !important;
}
.card-body { padding: 16px 18px !important; }

.table-status-pill {
    padding: 5px 14px !important; border-radius: 50px !important;
    font-size: 10px !important; font-weight: 800 !important;
    letter-spacing: 0.8px !important; text-transform: uppercase !important;
    border: none !important;
    background: var(--slate) !important; color: var(--text-muted) !important;
}
.pill-ordered-more, .pill-waiting-bill {
    background: linear-gradient(135deg,#1a1a2e,#2d2b7c) !important;
    color: #a5b4fc !important;
}

.track-bar { gap: 4px !important; margin-top: 14px !important; }
.track-step {
    border-radius: 30px !important; font-size: 10px !important;
    font-weight: 700 !important; background: var(--slate) !important;
    color: var(--text-muted) !important; padding: 5px 8px !important;
    letter-spacing: 0.3px !important;
    transition: var(--transition) !important;
}
.track-step.active.step-new { background: linear-gradient(135deg,#6366f1,#8b5cf6) !important; color: #fff !important; }
.track-step.active.step-cooking { background: linear-gradient(135deg,#f59e0b,#d97706) !important; color: #fff !important; }
.track-step.active.step-serving { background: linear-gradient(135deg,#10b981,#059669) !important; color: #fff !important; }

/* ---------- 10. Buttons ---------- */
.btn-black {
    background: linear-gradient(135deg,#1a1a2e,#16213e) !important;
    color: #e2e8f0 !important;
    border: 1px solid #2d3748 !important;
    border-radius: 12px !important;
    padding: 13px 22px !important;
    font-weight: 700 !important; font-size: 13px !important;
    letter-spacing: 0.3px !important;
    cursor: pointer !important;
    transition: var(--transition) !important;
    display: inline-flex !important; align-items: center !important; justify-content: center !important; gap: 6px !important;
}
.btn-black:hover {
    background: linear-gradient(135deg,#6366f1,#8b5cf6) !important;
    border-color: #6366f1 !important;
    transform: translateY(-1px) !important;
    box-shadow: 0 6px 20px rgba(99,102,241,0.35) !important;
    color: #fff !important;
}
.btn-black:active { transform: scale(0.97) !important; }

.btn-outline {
    border: 1.5px solid var(--border) !important;
    border-radius: 10px !important;
    padding: 10px 18px !important;
    font-weight: 700 !important; font-size: 12px !important;
    letter-spacing: 0.3px !important;
    background: var(--surface) !important;
    color: var(--text-main) !important;
    cursor: pointer !important;
    transition: var(--transition) !important;
    display: inline-flex !important; align-items: center !important; gap: 5px !important;
}
.btn-outline:hover {
    background: var(--text-main) !important;
    color: var(--surface) !important;
    border-color: var(--text-main) !important;
    transform: translateY(-1px) !important;
}

.btn-void {
    border-radius: 8px !important;
    padding: 7px 12px !important;
    font-size: 11px !important; font-weight: 700 !important;
    transition: var(--transition) !important;
}
.btn-void:hover { transform: scale(1.05) !important; }

/* ADD ORDER button in nav */
#btn-add-nav {
    background: linear-gradient(135deg,#6366f1,#8b5cf6) !important;
    color: #fff !important; border: none !important;
    border-radius: 10px !important;
    padding: 9px 18px !important;
    font-size: 12px !important; font-weight: 700 !important;
    letter-spacing: 0.5px !important;
    box-shadow: 0 4px 14px rgba(99,102,241,0.35) !important;
    transition: var(--transition) !important;
}
#btn-add-nav:hover {
    transform: translateY(-1px) !important;
    box-shadow: 0 6px 20px rgba(99,102,241,0.45) !important;
    background: linear-gradient(135deg,#4f46e5,#7c3aed) !important;
}

/* ---------- 11. Inputs ---------- */
input, select {
    border-radius: 10px !important;
    border: 1.5px solid var(--border) !important;
    background: var(--surface) !important;
    color: var(--text-main) !important;
    padding: 11px 14px !important;
    font-size: 14px !important;
    transition: var(--transition) !important;
    outline: none !important;
}
input:focus, select:focus {
    border-color: var(--primary) !important;
    box-shadow: 0 0 0 3px var(--primary-glow) !important;
}

/* ---------- 12. Modals ---------- */
.modal-overlay { backdrop-filter: blur(8px) !important; background: rgba(0,0,0,0.5) !important; }
.modal-card {
    border-radius: 22px !important;
    border: 1px solid var(--border) !important;
    box-shadow: var(--shadow-lg) !important;
    padding: 30px !important;
    overflow: hidden !important;
}

/* Pay Modal */
#p-total-price {
    font-size: 36px !important; font-weight: 900 !important;
    background: linear-gradient(135deg,var(--primary),#8b5cf6) !important;
    -webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important;
}
.pay-tile {
    border-radius: 14px !important; padding: 18px !important;
    border: 2px solid var(--border) !important;
    font-weight: 800 !important; font-size: 13px !important;
    transition: var(--transition) !important; cursor: pointer !important;
}
.pay-tile:hover {
    background: linear-gradient(135deg,#1a1a2e,#16213e) !important;
    color: #fff !important; border-color: #4f46e5 !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 20px rgba(99,102,241,0.3) !important;
}

/* Manual Order Modal */
#manual-order-modal .modal-card { max-width: 680px !important; }
#mo-search {
    width: 100% !important; border-radius: 10px !important;
    padding: 12px 16px !important; font-size: 14px !important;
}

/* ---------- 13. Report / Chart ---------- */
#report-sec {
    background: var(--surface) !important;
    border: 1px solid var(--border) !important;
    border-radius: var(--radius) !important;
    padding: 24px !important;
    box-shadow: var(--shadow) !important;
}
.report-grid { gap: 24px !important; }
.ai-card {
    background: var(--surface) !important;
    border: 1px solid var(--border) !important;
    border-radius: var(--radius) !important;
    padding: 22px !important;
    box-shadow: var(--shadow) !important;
}
.report-table {
    border-radius: 12px !important;
    overflow: hidden !important;
    border: 1px solid var(--border) !important;
}
.report-table th {
    background: var(--slate) !important;
    font-size: 10px !important; letter-spacing: 1.5px !important;
    padding: 14px 16px !important; font-weight: 800 !important;
    color: var(--text-muted) !important;
}
.report-table td { padding: 14px 16px !important; }
.report-table tr:hover td { background: var(--slate) !important; transition: var(--transition) !important; }

/* Chart area */
#salesChart { border-radius: 12px !important; }

/* ---------- 14. Points Section ---------- */
#points-sec {
    padding: 24px !important;
    max-width: 960px !important;
    margin: 0 auto !important;
}

/* Points header */
#points-sec > div:first-child {
    background: var(--surface) !important;
    border: 1px solid var(--border) !important;
    border-radius: 22px !important;
    padding: 32px !important;
    box-shadow: var(--shadow-md) !important;
}

/* Points form card */
#points-sec .ai-card {
    border-radius: 18px !important;
    border: 1.5px solid var(--border) !important;
    padding: 28px !important;
    position: relative !important; overflow: hidden !important;
}
#points-sec .ai-card::before {
    content: '⭐' !important;
    position: absolute !important;
    font-size: 100px !important; opacity: 0.04 !important;
    right: -10px !important; top: -20px !important;
    pointer-events: none !important;
}
#points-sec .ai-card[style*="border-left"] {
    border-left: 4px solid var(--primary) !important;
    background: linear-gradient(135deg, var(--surface), rgba(99,102,241,0.03)) !important;
}

/* Points table */
#points-sec table.report-table th {
    font-size: 11px !important; padding: 16px 20px !important;
}
#points-sec table.report-table td {
    padding: 16px 20px !important;
}
#points-list tr { transition: var(--transition) !important; }
#points-list tr:hover td { background: rgba(99,102,241,0.04) !important; }

/* Save button in points */
#points-sec .btn-black[onclick*="savePoint"] {
    background: linear-gradient(135deg,#6366f1,#8b5cf6) !important;
    border-color: transparent !important;
    box-shadow: 0 4px 14px rgba(99,102,241,0.4) !important;
    border-radius: 12px !important;
    padding: 13px 28px !important;
    width: auto !important;
}
#points-sec .btn-black[onclick*="savePoint"]:hover {
    box-shadow: 0 6px 24px rgba(99,102,241,0.55) !important;
    background: linear-gradient(135deg,#4f46e5,#7c3aed) !important;
}

/* ---------- 15. Login Page ---------- */
#login-overlay > div {
    border-radius: 24px !important;
    border: 1px solid var(--border) !important;
    box-shadow: var(--shadow-lg) !important;
    padding: 48px 40px !important;
}
#login-pin {
    border-radius: 14px !important;
    font-size: 28px !important;
    letter-spacing: 12px !important;
    text-align: center !important;
    border: 2px solid var(--border) !important;
}
#login-pin:focus { border-color: var(--primary) !important; box-shadow: 0 0 0 4px var(--primary-glow) !important; }

/* ---------- 16. Stock Section ---------- */
#stock-sec > div:first-child {
    border-radius: var(--radius) !important;
    border: 1px solid var(--border) !important;
    box-shadow: var(--shadow) !important;
    padding: 18px !important;
}

/* ---------- 17. Sync badge + closing timer ---------- */
#sync-status {
    border-radius: 20px !important;
    font-size: 10px !important; letter-spacing: 0.8px !important;
    background: rgba(16,185,129,0.1) !important;
    border: 1px solid rgba(16,185,129,0.25) !important;
    color: var(--success) !important;
}

/* ---------- 18. Scrollbar ---------- */
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 20px; }
::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }

/* ---------- 19. Animations ---------- */
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
}
.order-card, .stat-card, .map-section, .ai-card {
    animation: fadeInUp 0.35s ease both;
}
@keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
}

/* Closing banner */
.closing-banner {
    border-radius: 14px !important;
    font-size: 13px !important; letter-spacing: 0.3px !important;
    background: linear-gradient(90deg,#ef4444,#dc2626) !important;
    border: none !important;
}

/* Mobile responsive */
@media (max-width: 768px) {
    .container { padding: 14px !important; }
    .stats-grid { grid-template-columns: 1fr 1fr !important; }
    .tab-bar { width: 100% !important; overflow-x: auto !important; }
    #points-sec { padding: 14px !important; }
}
/* END WITHU PREMIUM CSS */
`;

// Inject at the END of the main <style> block (before closing </style>)
// Find the first </style> tag after the :root block
const styleEnd = html.indexOf('</style>');
if(styleEnd === -1) {
    console.log('ERROR: No </style> found');
    process.exit(1);
}

html = html.slice(0, styleEnd) + premiumCSS + '\n    </style>' + html.slice(styleEnd + 8);

fs.writeFileSync('d:/withu/withU/admin.html', html, 'utf8');
console.log('Premium CSS injected at position:', styleEnd);
console.log('New file size:', fs.readFileSync('d:/withu/withU/admin.html', 'utf8').length);
