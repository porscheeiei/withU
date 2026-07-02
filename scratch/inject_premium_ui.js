const fs = require('fs');

let html = fs.readFileSync('admin.html', 'utf8');

// Remove old revamp style if already exists
html = html.replace(/<!-- WITHU PREMIUM UI -->([\s\S]*?)<\/style>/g, '');

const premiumCSS = `
<!-- WITHU PREMIUM UI -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
/* =====================================================
   WITHU ADMIN - PREMIUM UI OVERHAUL
   Design System: Modern Dark-Light Glassmorphism
   ===================================================== */

/* --- FONT OVERRIDE --- */
* { font-family: 'Plus Jakarta Sans', 'Inter', 'Prompt', sans-serif !important; }

/* --- CSS VARIABLES --- */
:root {
  --blue: #3b82f6;
  --blue-dark: #1d4ed8;
  --blue-light: rgba(59,130,246,0.12);
  --green: #10b981;
  --amber: #f59e0b;
  --red: #ef4444;
  --purple: #8b5cf6;
  --transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

/* --- GLOBAL BODY --- */
body {
  background: var(--bg) !important;
  background-image: radial-gradient(ellipse at 20% 50%, rgba(59,130,246,0.04) 0%, transparent 50%),
                    radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.03) 0%, transparent 50%) !important;
}

/* --- OP BAR (Top Status Bar) --- */
.op-bar {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%) !important;
  padding: 8px 20px !important;
  font-size: 11px !important;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2) !important;
}
.op-bar > div { gap: 15px !important; align-items: center !important; }
#close-timer { color: #60a5fa !important; font-weight: 900 !important; font-size: 13px !important; }

/* --- TOP NAV --- */
.top-nav {
  background: rgba(255,255,255,0.92) !important;
  backdrop-filter: blur(20px) saturate(1.8) !important;
  -webkit-backdrop-filter: blur(20px) saturate(1.8) !important;
  border-bottom: 1px solid rgba(59,130,246,0.15) !important;
  padding: 12px 25px !important;
  box-shadow: 0 1px 20px rgba(0,0,0,0.06) !important;
}
[data-theme="dark"] .top-nav {
  background: rgba(18,18,18,0.95) !important;
  border-bottom: 1px solid rgba(59,130,246,0.1) !important;
}
.logo {
  font-size: 20px !important;
  font-weight: 900 !important;
  letter-spacing: -1px !important;
  background: linear-gradient(135deg, #1e293b 0%, #3b82f6 100%) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
}
[data-theme="dark"] .logo {
  background: linear-gradient(135deg, #ffffff 0%, #60a5fa 100%) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
}
.hamburger-btn {
  background: rgba(59,130,246,0.1) !important;
  border: 1px solid rgba(59,130,246,0.2) !important;
  border-radius: 10px !important;
  color: #3b82f6 !important;
  padding: 8px 12px !important;
  font-size: 18px !important;
  transition: var(--transition) !important;
}
.hamburger-btn:hover {
  background: #3b82f6 !important;
  color: white !important;
  transform: scale(1.05) !important;
}

/* Action Buttons in Nav */
.action-btns .tab-btn {
  border-radius: 10px !important;
  font-size: 11px !important;
  font-weight: 700 !important;
  padding: 8px 16px !important;
  letter-spacing: 0.3px !important;
  transition: var(--transition) !important;
}
#btn-add-nav {
  background: linear-gradient(135deg, #3b82f6, #2563eb) !important;
  color: white !important;
  border: none !important;
  box-shadow: 0 4px 12px rgba(59,130,246,0.35) !important;
}
#btn-add-nav:hover { transform: translateY(-1px) !important; box-shadow: 0 6px 18px rgba(59,130,246,0.45) !important; }
#btn-staff-nav {
  background: linear-gradient(135deg, #1e293b, #0f172a) !important;
  color: white !important;
  border: none !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
}
#btn-export-nav {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed) !important;
  color: white !important;
  border: none !important;
  box-shadow: 0 4px 12px rgba(139,92,246,0.35) !important;
}

/* --- SIDEBAR --- */
.sidebar {
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%) !important;
  border-right: none !important;
  box-shadow: 8px 0 30px rgba(0,0,0,0.3) !important;
  width: 270px !important;
}
.sidebar-header {
  background: rgba(59,130,246,0.1) !important;
  border-bottom: 1px solid rgba(255,255,255,0.08) !important;
  padding: 24px 20px !important;
}
.sidebar-logo {
  color: white !important;
  font-size: 20px !important;
  font-weight: 900 !important;
  letter-spacing: -0.5px !important;
  background: linear-gradient(135deg, #fff 0%, #60a5fa 100%) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
}
.sidebar-close {
  color: rgba(255,255,255,0.6) !important;
  background: rgba(255,255,255,0.08) !important;
  border-radius: 8px !important;
  padding: 6px 10px !important;
  border: 1px solid rgba(255,255,255,0.1) !important;
  transition: var(--transition) !important;
}
.sidebar-close:hover { background: rgba(239,68,68,0.2) !important; color: #ef4444 !important; }

.sidebar-menu { padding: 15px 12px !important; gap: 4px !important; }
.sidebar-item {
  color: rgba(255,255,255,0.65) !important;
  border-radius: 12px !important;
  padding: 12px 14px !important;
  font-size: 13.5px !important;
  font-weight: 600 !important;
  transition: var(--transition) !important;
  border: 1px solid transparent !important;
  letter-spacing: -0.2px;
}
.sidebar-item:hover {
  background: rgba(255,255,255,0.08) !important;
  color: white !important;
  border-color: rgba(255,255,255,0.08) !important;
  transform: translateX(4px) !important;
}
.sidebar-item.active {
  background: linear-gradient(135deg, rgba(59,130,246,0.25), rgba(59,130,246,0.1)) !important;
  color: #60a5fa !important;
  border-color: rgba(59,130,246,0.3) !important;
  box-shadow: inset 0 0 20px rgba(59,130,246,0.1) !important;
  transform: translateX(0) !important;
}
.sidebar-divider {
  background: rgba(255,255,255,0.06) !important;
  height: 1px !important;
  margin: 8px 0 !important;
}
#sb-settings { color: rgba(100,200,255,0.7) !important; }
#sb-settings:hover { color: #60a5fa !important; }
button[onclick*="handleLogout"] { color: rgba(239,68,68,0.7) !important; }
button[onclick*="handleLogout"]:hover { color: #ef4444 !important; background: rgba(239,68,68,0.1) !important; }

/* --- CONTAINER --- */
.container { max-width: 1500px !important; padding: 0 24px !important; margin-top: 20px !important; }

/* --- MAP SECTION --- */
.map-section {
  background: white !important;
  border: 1px solid rgba(59,130,246,0.12) !important;
  border-radius: 20px !important;
  padding: 24px !important;
  box-shadow: 0 4px 25px rgba(59,130,246,0.06), 0 1px 4px rgba(0,0,0,0.05) !important;
  margin-bottom: 24px !important;
}
[data-theme="dark"] .map-section {
  background: #161b27 !important;
  border: 1px solid rgba(59,130,246,0.15) !important;
}
.map-title {
  font-size: 10px !important;
  font-weight: 800 !important;
  letter-spacing: 1.5px !important;
  color: #3b82f6 !important;
  text-transform: uppercase !important;
  margin-bottom: 16px !important;
}
.map-table {
  border-radius: 10px !important;
  border: 1px solid rgba(0,0,0,0.08) !important;
  font-size: 10px !important;
  font-weight: 800 !important;
  transition: var(--transition) !important;
  padding: 10px 4px !important;
  letter-spacing: 0.3px;
}
.map-table:hover { transform: scale(1.05) !important; box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important; z-index: 1 !important; position: relative !important; }
.map-table.map-new, .map-table.map-cooking, .map-table.map-serving,
.map-table.map-ordered-more, .map-table.map-waiting-bill {
  background: linear-gradient(135deg, #1e293b, #0f172a) !important;
  color: white !important;
  border-color: transparent !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
}
.map-table.alert-trigger {
  background: linear-gradient(135deg, #ef4444, #b91c1c) !important;
  box-shadow: 0 4px 20px rgba(239,68,68,0.5) !important;
}

/* --- STATS CARDS --- */
.stats-grid { gap: 16px !important; margin-bottom: 24px !important; }
.stat-card {
  background: white !important;
  border-radius: 18px !important;
  padding: 22px !important;
  border: 1px solid rgba(59,130,246,0.1) !important;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06) !important;
  transition: var(--transition) !important;
  position: relative;
  overflow: hidden;
}
.stat-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 18px 18px 0 0;
}
.stat-card:hover { transform: translateY(-3px) !important; box-shadow: 0 8px 30px rgba(59,130,246,0.12) !important; }
[data-theme="dark"] .stat-card { background: #161b27 !important; border-color: rgba(59,130,246,0.15) !important; }
.stat-card small {
  font-size: 10px !important;
  font-weight: 800 !important;
  letter-spacing: 1.5px !important;
  color: #6b7280 !important;
  text-transform: uppercase !important;
}
.stat-card h3 { font-size: 28px !important; font-weight: 900 !important; letter-spacing: -1px !important; }

/* --- TAB BAR --- */
.tab-bar {
  background: rgba(59,130,246,0.06) !important;
  border: 1px solid rgba(59,130,246,0.12) !important;
  border-radius: 14px !important;
  padding: 5px !important;
  gap: 4px !important;
}
.tab-btn {
  border-radius: 10px !important;
  font-size: 11px !important;
  font-weight: 700 !important;
  padding: 9px 20px !important;
  transition: var(--transition) !important;
  letter-spacing: 0.3px;
}
.tab-btn:hover { background: rgba(59,130,246,0.08) !important; color: #3b82f6 !important; }
.tab-btn.active {
  background: linear-gradient(135deg, #3b82f6, #2563eb) !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(59,130,246,0.35) !important;
  border-bottom: none !important;
}

/* --- ORDER CARDS --- */
.order-grid { gap: 18px !important; }
.order-card {
  border-radius: 18px !important;
  border: 1px solid rgba(0,0,0,0.07) !important;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06) !important;
  transition: var(--transition) !important;
  overflow: hidden !important;
}
.order-card:hover { transform: translateY(-3px) !important; box-shadow: 0 10px 35px rgba(0,0,0,0.1) !important; }
.order-card.sla-trigger {
  border: 2px solid #ef4444 !important;
  box-shadow: 0 0 20px rgba(239,68,68,0.2) !important;
}
[data-theme="dark"] .order-card { border-color: rgba(255,255,255,0.08) !important; background: #161b27 !important; }
.card-head {
  background: linear-gradient(135deg, rgba(59,130,246,0.04), rgba(139,92,246,0.03)) !important;
  border-bottom: 1px solid rgba(0,0,0,0.06) !important;
  padding: 16px 18px !important;
}
[data-theme="dark"] .card-head { background: rgba(255,255,255,0.03) !important; }

.table-status-pill {
  border-radius: 8px !important;
  font-size: 10px !important;
  font-weight: 800 !important;
  letter-spacing: 0.5px !important;
  padding: 5px 12px !important;
  text-transform: uppercase !important;
}

.track-bar { gap: 4px !important; margin-top: 14px !important; }
.track-step {
  border-radius: 8px !important;
  font-size: 9px !important;
  font-weight: 800 !important;
  padding: 5px !important;
  letter-spacing: 0.3px;
}
.track-step.active.step-new { background: linear-gradient(135deg, #3b82f6, #2563eb) !important; color: white !important; box-shadow: 0 2px 8px rgba(59,130,246,0.4) !important; }
.track-step.active.step-cooking { background: linear-gradient(135deg, #f59e0b, #d97706) !important; color: white !important; box-shadow: 0 2px 8px rgba(245,158,11,0.4) !important; }
.track-step.active.step-serving { background: linear-gradient(135deg, #10b981, #059669) !important; color: white !important; box-shadow: 0 2px 8px rgba(16,185,129,0.4) !important; }

/* --- BUTTONS --- */
.btn-black {
  background: linear-gradient(135deg, #1e293b, #0f172a) !important;
  border-radius: 10px !important;
  font-weight: 800 !important;
  font-size: 12px !important;
  letter-spacing: 0.3px !important;
  transition: var(--transition) !important;
  border: none !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
}
.btn-black:hover {
  background: linear-gradient(135deg, #3b82f6, #2563eb) !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 6px 20px rgba(59,130,246,0.4) !important;
}
.btn-outline {
  border-radius: 10px !important;
  font-weight: 700 !important;
  font-size: 11px !important;
  border: 1.5px solid rgba(0,0,0,0.12) !important;
  transition: var(--transition) !important;
  letter-spacing: 0.3px;
}
.btn-outline:hover {
  background: linear-gradient(135deg, #1e293b, #0f172a) !important;
  color: white !important;
  border-color: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
}
[data-theme="dark"] .btn-outline { border-color: rgba(255,255,255,0.15) !important; }
.btn-void {
  border-radius: 8px !important;
  transition: var(--transition) !important;
}
.btn-void:hover { transform: scale(1.02) !important; }

/* --- AI CARDS --- */
.ai-card {
  background: white !important;
  border-radius: 18px !important;
  border: 1px solid rgba(59,130,246,0.1) !important;
  padding: 24px !important;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05) !important;
  transition: var(--transition) !important;
}
.ai-card:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 30px rgba(59,130,246,0.1) !important; }
[data-theme="dark"] .ai-card { background: #161b27 !important; border-color: rgba(59,130,246,0.15) !important; }
.ai-node {
  border-left: 2px solid #3b82f6 !important;
  color: var(--text-muted) !important;
  border-radius: 0 8px 8px 0 !important;
  background: rgba(59,130,246,0.03) !important;
  padding: 10px 15px !important;
}

/* --- MODALS --- */
.modal-overlay {
  background: rgba(15,23,42,0.7) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
}
.modal-card {
  background: white !important;
  border-radius: 22px !important;
  border: 1px solid rgba(59,130,246,0.15) !important;
  box-shadow: 0 25px 60px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.5) !important;
  max-width: 500px !important;
  padding: 30px !important;
}
[data-theme="dark"] .modal-card { background: #1e293b !important; border-color: rgba(59,130,246,0.2) !important; }

/* --- INPUTS --- */
input, select, textarea {
  border-radius: 10px !important;
  border: 1.5px solid rgba(0,0,0,0.1) !important;
  padding: 12px 16px !important;
  font-size: 14px !important;
  transition: var(--transition) !important;
  background: white !important;
  font-weight: 500 !important;
}
input:focus, select:focus {
  outline: none !important;
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.12) !important;
}
[data-theme="dark"] input, [data-theme="dark"] select {
  background: #0f172a !important;
  border-color: rgba(255,255,255,0.1) !important;
  color: white !important;
}

/* --- REPORT TABLE --- */
.report-table {
  border-radius: 14px !important;
  overflow: hidden !important;
  border: 1px solid rgba(59,130,246,0.1) !important;
  box-shadow: 0 2px 10px rgba(0,0,0,0.04) !important;
}
.report-table th {
  background: linear-gradient(135deg, #f8fafc, #f1f5f9) !important;
  padding: 14px 16px !important;
  font-size: 10px !important;
  font-weight: 800 !important;
  letter-spacing: 1px !important;
  color: #64748b !important;
  border-bottom: 1px solid rgba(59,130,246,0.1) !important;
}
[data-theme="dark"] .report-table th { background: rgba(255,255,255,0.04) !important; color: #94a3b8 !important; }
.report-table td { padding: 14px 16px !important; font-size: 13px !important; }
.report-table tr:hover td { background: rgba(59,130,246,0.04) !important; }
[data-theme="dark"] .report-table tr:hover td { background: rgba(59,130,246,0.07) !important; }

/* --- PAY TILE --- */
.pay-tile {
  border-radius: 12px !important;
  transition: var(--transition) !important;
  border: 1.5px solid rgba(0,0,0,0.1) !important;
  font-weight: 800 !important;
}
.pay-tile:hover {
  background: linear-gradient(135deg, #3b82f6, #2563eb) !important;
  color: white !important;
  border-color: transparent !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 25px rgba(59,130,246,0.35) !important;
}

/* --- ITEM DETAILS --- */
.item-details-highlight {
  border-radius: 10px !important;
  background: linear-gradient(135deg, rgba(239,68,68,0.08), rgba(239,68,68,0.04)) !important;
  border: 1px solid rgba(239,68,68,0.2) !important;
  font-size: 13px !important;
}

/* --- LOGIN OVERLAY --- */
#login-overlay {
  background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%) !important;
}
#login-overlay .modal-card,
#login-overlay > div {
  background: rgba(255,255,255,0.05) !important;
  backdrop-filter: blur(20px) !important;
  border: 1px solid rgba(255,255,255,0.1) !important;
  border-radius: 24px !important;
  padding: 40px !important;
  box-shadow: 0 30px 80px rgba(0,0,0,0.5) !important;
  max-width: 420px !important;
  width: 90% !important;
}
#login-pin {
  background: rgba(255,255,255,0.08) !important;
  border: 1px solid rgba(255,255,255,0.15) !important;
  color: white !important;
  font-size: 32px !important;
  border-radius: 14px !important;
  text-align: center !important;
  letter-spacing: 15px !important;
  padding: 20px !important;
}
#login-pin:focus { border-color: #3b82f6 !important; box-shadow: 0 0 0 4px rgba(59,130,246,0.25) !important; }

/* --- TOAST NOTIFICATIONS --- */
.toast-notify {
  border-radius: 0 !important;
  font-size: 16px !important;
  font-weight: 700 !important;
  letter-spacing: 0.3px !important;
}
.toast-notify-new {
  background: linear-gradient(90deg, #059669, #10b981) !important;
  box-shadow: 0 6px 30px rgba(16,185,129,0.5) !important;
}
.toast-notify-call {
  background: linear-gradient(90deg, #b91c1c, #ef4444) !important;
  box-shadow: 0 6px 30px rgba(239,68,68,0.5) !important;
}
.toast-notify-add {
  background: linear-gradient(90deg, #d97706, #f59e0b) !important;
  box-shadow: 0 6px 30px rgba(245,158,11,0.5) !important;
}
.toast-notify-pay {
  background: linear-gradient(90deg, #7c3aed, #8b5cf6) !important;
  box-shadow: 0 6px 30px rgba(139,92,246,0.5) !important;
}

/* --- CLOSING BANNER --- */
.closing-banner {
  border-radius: 14px !important;
  background: linear-gradient(135deg, #b91c1c, #ef4444) !important;
  box-shadow: 0 6px 25px rgba(239,68,68,0.3) !important;
  border: none !important;
}

/* --- SCROLLBAR STYLING --- */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.3); border-radius: 99px; }
::-webkit-scrollbar-thumb:hover { background: rgba(59,130,246,0.5); }

/* --- SIDEBAR BADGE --- */
.badge {
  background: linear-gradient(135deg, #3b82f6, #2563eb) !important;
  color: white !important;
  border-radius: 8px !important;
  font-size: 10px !important;
  font-weight: 800 !important;
  padding: 3px 8px !important;
  box-shadow: 0 2px 8px rgba(59,130,246,0.4) !important;
}

/* --- SECTION HEADINGS --- */
#settings-sec h2, #report-sec h2, #points-sec h2 {
  background: linear-gradient(135deg, var(--text-main) 0%, #3b82f6 100%) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
  font-size: 26px !important;
  font-weight: 900 !important;
  letter-spacing: -0.5px !important;
}

/* --- MICRO ANIMATION --- */
@keyframes slideInUp {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
#order-sec, #takeaway-sec, #stock-sec, #report-sec, #points-sec, #settings-sec {
  animation: slideInUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* --- BUTTON SOUND / NAV BUTTONS --- */
#btn-sound {
  background: rgba(59,130,246,0.1) !important;
  border: 1px solid rgba(59,130,246,0.25) !important;
  color: #3b82f6 !important;
  border-radius: 8px !important;
  font-size: 10px !important;
  padding: 5px 10px !important;
  font-weight: 700 !important;
}
#btn-sound:hover { background: #3b82f6 !important; color: white !important; }

#sync-status {
  font-size: 11px !important;
  background: rgba(16,185,129,0.1) !important;
  color: #10b981 !important;
  border-radius: 6px !important;
  padding: 3px 10px !important;
  border: 1px solid rgba(16,185,129,0.2) !important;
  animation: none !important;
}

/* --- ITEM BADGE --- */
.badge-new-item {
  border-radius: 6px !important;
  font-size: 10px !important;
}

/* --- ORDER CARD PAID STATUS --- */
.pill-ordered-more, .pill-waiting-bill {
  background: linear-gradient(135deg, #1e293b, #0f172a) !important;
  color: white !important;
  border: none !important;
}

/* --- DARK MODE OVERRIDES --- */
[data-theme="dark"] .map-section { background: #161b27 !important; }
[data-theme="dark"] .stat-card { background: #161b27 !important; }
[data-theme="dark"] .tab-bar { background: rgba(59,130,246,0.06) !important; border-color: rgba(59,130,246,0.1) !important; }
[data-theme="dark"] .report-table th { background: rgba(255,255,255,0.04) !important; }
[data-theme="dark"] .order-card { background: #161b27 !important; }
[data-theme="dark"] .btn-outline { color: rgba(255,255,255,0.85) !important; }
[data-theme="dark"] .top-nav { border-bottom: 1px solid rgba(59,130,246,0.1) !important; }

/* --- WITHU REVAMP UI OVERRIDES (inline specifics) --- */
.withu-revamp-script .settings-sec .ai-card { border-top-width: 4px !important; }
</style>
`;

// Inject before </head>
if (html.includes('<!-- WITHU PREMIUM UI -->')) {
    console.log('Premium UI already applied.');
} else {
    html = html.replace('</head>', premiumCSS + '\n</head>');
    fs.writeFileSync('admin.html', html, 'utf8');
    console.log('Premium UI CSS applied successfully.');
}
