const fs = require('fs');
let html = fs.readFileSync('d:/withu/withU/admin.html', 'utf8');

// ─────────────────────────────────────────────────────────────
// 1.  PREMIUM CSS — Business Hours + Customer Points
// ─────────────────────────────────────────────────────────────
const premiumCSS = `
<style id="withu-premium-redesign">
/* ── Font ───────────────────────────────────── */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

/* ── Tokens ─────────────────────────────────── */
:root {
  --pp: #6366F1; --pp2: #8B5CF6; --pp-glow: rgba(99,102,241,.18);
  --pg: linear-gradient(135deg,#6366F1,#8B5CF6);
  --gg: linear-gradient(135deg,#10B981,#059669);
  --sp: #F8FAFC; --sc: #ffffff;
  --sb: #E5E7EB; --st: #0F172A; --sm: #64748B;
  --br: 20px; --br-sm: 12px;
  --sh: 0 1px 3px rgba(0,0,0,.06),0 8px 24px rgba(99,102,241,.07);
  --sh-h: 0 4px 24px rgba(99,102,241,.18);
  --tr: all .2s cubic-bezier(.4,0,.2,1);
}
[data-theme="dark"] {
  --sp: #0d1117; --sc: #161b27; --sb: #2a2f3e; --st: #f1f5f9; --sm: #64748b;
}

/* ════════════════════════════════════════
   SETTINGS — Business Hours & Store Status
   ════════════════════════════════════════ */
#settings-sec {
  padding: 32px !important;
  max-width: 820px !important;
  margin: 0 auto !important;
  font-family: 'Inter','Prompt',sans-serif !important;
}
#settings-sec h2 {
  font-size: 26px !important; font-weight: 800 !important;
  letter-spacing: -.6px !important; margin-bottom: 28px !important;
  color: var(--st) !important;
}

/* — Card wrapper — */
.prem-card {
  background: var(--sc) !important;
  border: 1px solid var(--sb) !important;
  border-radius: 24px !important;
  padding: 32px !important;
  box-shadow: var(--sh) !important;
  margin-bottom: 20px !important;
  transition: var(--tr) !important;
  position: relative !important;
  overflow: hidden !important;
}
.prem-card:hover { box-shadow: var(--sh-h) !important; }
.prem-card::before {
  content: '' !important;
  position: absolute !important; inset: 0 !important;
  background: linear-gradient(135deg,rgba(99,102,241,.03) 0%,transparent 60%) !important;
  pointer-events: none !important;
}

/* — Section title row — */
.prem-section-title {
  display: flex !important; align-items: center !important; gap: 12px !important;
  margin-bottom: 24px !important;
}
.prem-section-icon {
  width: 40px !important; height: 40px !important;
  border-radius: 12px !important;
  display: flex !important; align-items: center !important; justify-content: center !important;
  font-size: 18px !important; flex-shrink: 0 !important;
}
.prem-section-icon.green  { background: rgba(16,185,129,.12) !important; }
.prem-section-icon.blue   { background: rgba(99,102,241,.12) !important; }
.prem-section-icon.purple { background: rgba(139,92,246,.12) !important; }
.prem-section-label { font-size: 16px !important; font-weight: 700 !important; color: var(--st) !important; }
.prem-section-sub   { font-size: 13px !important; color: var(--sm) !important; font-weight: 500 !important; }

/* — iOS Toggle — */
.ios-toggle-row {
  display: flex !important; align-items: center !important; justify-content: space-between !important;
  background: linear-gradient(135deg,rgba(16,185,129,.07),rgba(5,150,105,.04)) !important;
  border: 1.5px solid rgba(16,185,129,.2) !important;
  border-radius: 18px !important; padding: 18px 22px !important;
  margin-bottom: 26px !important; transition: var(--tr) !important;
}
.ios-toggle-row:hover { border-color: rgba(16,185,129,.4) !important; }
.ios-toggle-info { display: flex !important; align-items: center !important; gap: 12px !important; }
.ios-status-icon {
  width: 36px !important; height: 36px !important; border-radius: 50% !important;
  background: rgba(16,185,129,.15) !important;
  display: flex !important; align-items: center !important; justify-content: center !important;
  font-size: 16px !important;
}
.ios-status-text { font-size: 15px !important; font-weight: 700 !important; color: var(--st) !important; }
.ios-status-sub  { font-size: 12px !important; color: var(--sm) !important; font-weight: 500 !important; }
/* The actual switch */
.ios-switch { position: relative !important; display: inline-block !important; width: 52px !important; height: 30px !important; flex-shrink: 0 !important; }
.ios-switch input { opacity: 0 !important; width: 0 !important; height: 0 !important; }
.ios-slider {
  position: absolute !important; cursor: pointer !important;
  inset: 0 !important; background: #CBD5E1 !important;
  border-radius: 30px !important; transition: .3s !important;
}
.ios-slider::before {
  content: '' !important; position: absolute !important;
  height: 22px !important; width: 22px !important;
  left: 4px !important; bottom: 4px !important;
  background: #fff !important; border-radius: 50% !important;
  transition: .3s cubic-bezier(.34,1.56,.64,1) !important;
  box-shadow: 0 2px 8px rgba(0,0,0,.15) !important;
}
input:checked + .ios-slider { background: #10B981 !important; }
input:checked + .ios-slider::before { transform: translateX(22px) !important; }

/* — Operating Days — */
.prem-divider { height: 1px !important; background: var(--sb) !important; margin: 22px 0 !important; opacity: .6 !important; }
.prem-label { font-size: 11px !important; font-weight: 700 !important; letter-spacing: 1.2px !important; text-transform: uppercase !important; color: var(--sm) !important; margin-bottom: 12px !important; }
.days-grid { display: flex !important; gap: 8px !important; flex-wrap: wrap !important; margin-bottom: 24px !important; }
.day-pill {
  cursor: pointer !important;
  padding: 9px 16px !important; border-radius: 50px !important;
  font-size: 13px !important; font-weight: 700 !important;
  background: var(--sp) !important; border: 1.5px solid var(--sb) !important;
  color: var(--sm) !important; display: flex !important; align-items: center !important; gap: 6px !important;
  transition: var(--tr) !important; user-select: none !important;
}
.day-pill input { display: none !important; }
.day-pill:has(input:checked) {
  background: var(--pg) !important; border-color: transparent !important;
  color: #fff !important; box-shadow: 0 4px 12px var(--pp-glow) !important;
}
.day-pill:hover:not(:has(input:checked)) { border-color: var(--pp) !important; color: var(--pp) !important; }

/* — Time Pickers — */
.time-grid { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 16px !important; margin-bottom: 24px !important; }
.time-field { position: relative !important; }
.time-field label { display: block !important; font-size: 11px !important; font-weight: 700 !important; letter-spacing: 1px !important; text-transform: uppercase !important; color: var(--sm) !important; margin-bottom: 8px !important; }
.time-field-wrap {
  position: relative !important;
  background: var(--sp) !important;
  border: 1.5px solid var(--sb) !important; border-radius: 14px !important;
  display: flex !important; align-items: center !important;
  padding: 0 16px !important; gap: 10px !important;
  transition: var(--tr) !important;
}
.time-field-wrap:focus-within { border-color: var(--pp) !important; box-shadow: 0 0 0 3px var(--pp-glow) !important; }
.time-field-wrap .t-icon { font-size: 16px !important; flex-shrink: 0 !important; }
.time-field-wrap input[type="time"] {
  border: none !important; background: transparent !important; box-shadow: none !important;
  font-size: 18px !important; font-weight: 700 !important; color: var(--st) !important;
  padding: 14px 0 !important; flex: 1 !important;
}
.time-field-wrap input[type="time"]:focus { outline: none !important; box-shadow: none !important; border: none !important; }

/* — Save Button — */
.prem-save-btn {
  display: inline-flex !important; align-items: center !important; gap: 10px !important;
  height: 52px !important; padding: 0 32px !important;
  background: var(--pg) !important; color: #fff !important;
  font-size: 14px !important; font-weight: 700 !important; letter-spacing: .3px !important;
  border: none !important; border-radius: 16px !important; cursor: pointer !important;
  box-shadow: 0 4px 20px var(--pp-glow) !important;
  transition: var(--tr) !important; position: relative !important; overflow: hidden !important;
  font-family: 'Inter','Prompt',sans-serif !important;
}
.prem-save-btn::after {
  content: '' !important; position: absolute !important;
  inset: 0 !important; background: rgba(255,255,255,0) !important;
  transition: var(--tr) !important;
}
.prem-save-btn:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 28px var(--pp-glow) !important; }
.prem-save-btn:hover::after { background: rgba(255,255,255,.08) !important; }
.prem-save-btn:active { transform: scale(.97) !important; }
.prem-save-green { background: var(--gg) !important; box-shadow: 0 4px 20px rgba(16,185,129,.25) !important; }
.prem-save-green:hover { box-shadow: 0 8px 28px rgba(16,185,129,.38) !important; }
.prem-last-updated { font-size: 11px !important; color: var(--sm) !important; margin-top: 10px !important; font-weight: 500 !important; }

/* ════════════════════════════════════════
   CUSTOMER POINTS — Premium Redesign
   ════════════════════════════════════════ */
#points-sec {
  padding: 32px !important;
  max-width: 960px !important;
  margin: 0 auto !important;
  font-family: 'Inter','Prompt',sans-serif !important;
}
#points-sec h2, #points-sec .pts-header-title {
  font-size: 26px !important; font-weight: 800 !important;
  letter-spacing: -.6px !important; color: var(--st) !important;
  margin-bottom: 28px !important;
}

/* Points form card */
.pts-form-card {
  background: var(--sc) !important;
  border: 1px solid var(--sb) !important;
  border-radius: 24px !important;
  padding: 36px !important;
  box-shadow: var(--sh) !important;
  margin-bottom: 20px !important;
  position: relative !important; overflow: hidden !important;
  transition: var(--tr) !important;
}
.pts-form-card::after {
  content: '⭐' !important; position: absolute !important;
  font-size: 120px !important; opacity: .04 !important;
  right: -16px !important; top: -24px !important;
  pointer-events: none !important;
}
.pts-form-card:hover { box-shadow: var(--sh-h) !important; }

/* Floating label inputs */
.pts-field { position: relative !important; }
.pts-input-wrap {
  position: relative !important;
  display: flex !important; align-items: center !important;
  background: var(--sp) !important;
  border: 1.5px solid var(--sb) !important;
  border-radius: 14px !important; padding: 0 16px !important; gap: 10px !important;
  transition: var(--tr) !important;
}
.pts-input-wrap:focus-within { border-color: var(--pp) !important; box-shadow: 0 0 0 3px var(--pp-glow) !important; background: #fff !important; }
.pts-input-wrap .inp-icon { font-size: 16px !important; color: var(--sm) !important; flex-shrink: 0 !important; }
.pts-input-wrap input {
  border: none !important; background: transparent !important; box-shadow: none !important;
  flex: 1 !important; padding: 15px 0 !important;
  font-size: 15px !important; font-weight: 600 !important; color: var(--st) !important;
  font-family: 'Inter','Prompt',sans-serif !important;
}
.pts-input-wrap input::placeholder { color: #CBD5E1 !important; font-weight: 500 !important; }
.pts-input-wrap input:focus { outline: none !important; box-shadow: none !important; border: none !important; }

/* Points field highlight */
.pts-input-wrap.pts-big input {
  font-size: 22px !important; font-weight: 800 !important;
  color: var(--pp) !important;
}
.pts-input-wrap.pts-big { border-color: rgba(99,102,241,.3) !important; background: rgba(99,102,241,.03) !important; }
.pts-input-wrap.pts-big:focus-within { border-color: var(--pp) !important; background: #fff !important; }

.pts-field-label {
  font-size: 11px !important; font-weight: 700 !important;
  letter-spacing: 1px !important; text-transform: uppercase !important;
  color: var(--sm) !important; margin-bottom: 8px !important;
  display: block !important;
}

/* Buttons row */
.pts-btn-row { display: flex !important; gap: 10px !important; align-items: center !important; flex-wrap: wrap !important; margin-top: 24px !important; }
.pts-btn-save {
  display: inline-flex !important; align-items: center !important; gap: 9px !important;
  height: 50px !important; padding: 0 28px !important;
  background: var(--pg) !important; color: #fff !important;
  font-size: 14px !important; font-weight: 700 !important;
  border: none !important; border-radius: 16px !important; cursor: pointer !important;
  box-shadow: 0 4px 18px var(--pp-glow) !important;
  transition: var(--tr) !important; font-family: 'Inter','Prompt',sans-serif !important;
}
.pts-btn-save:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 28px var(--pp-glow) !important; }
.pts-btn-save:active { transform: scale(.96) !important; }

.pts-btn-clear {
  display: inline-flex !important; align-items: center !important; gap: 8px !important;
  height: 50px !important; padding: 0 24px !important;
  background: transparent !important; color: var(--sm) !important;
  font-size: 14px !important; font-weight: 600 !important;
  border: 1.5px solid var(--sb) !important; border-radius: 16px !important; cursor: pointer !important;
  transition: var(--tr) !important; font-family: 'Inter','Prompt',sans-serif !important;
}
.pts-btn-clear:hover { border-color: var(--sm) !important; color: var(--st) !important; background: var(--sp) !important; }

.pts-btn-search {
  display: inline-flex !important; align-items: center !important; gap: 8px !important;
  height: 50px !important; padding: 0 24px !important;
  background: rgba(99,102,241,.08) !important; color: var(--pp) !important;
  font-size: 14px !important; font-weight: 700 !important;
  border: 1.5px solid rgba(99,102,241,.25) !important; border-radius: 16px !important; cursor: pointer !important;
  transition: var(--tr) !important; font-family: 'Inter','Prompt',sans-serif !important;
}
.pts-btn-search:hover { background: var(--pg) !important; color: #fff !important; border-color: transparent !important; box-shadow: 0 4px 14px var(--pp-glow) !important; }

/* Table card */
.pts-table-card {
  background: var(--sc) !important;
  border: 1px solid var(--sb) !important;
  border-radius: 24px !important;
  overflow: hidden !important;
  box-shadow: var(--sh) !important;
}
.pts-table-card table { border: none !important; }
.pts-table-card thead th {
  background: var(--sp) !important;
  font-size: 10px !important; font-weight: 800 !important;
  letter-spacing: 1.5px !important; text-transform: uppercase !important;
  color: var(--sm) !important; padding: 16px 22px !important;
  border-bottom: 1px solid var(--sb) !important;
}
.pts-table-card tbody td { padding: 16px 22px !important; border-bottom: 1px solid var(--sb) !important; }
.pts-table-card tbody tr:last-child td { border-bottom: none !important; }
.pts-table-card tbody tr { transition: var(--tr) !important; }
.pts-table-card tbody tr:hover td { background: rgba(99,102,241,.03) !important; }

/* Points badge in table */
.pts-badge {
  display: inline-flex !important; align-items: center !important; gap: 5px !important;
  background: linear-gradient(135deg,rgba(99,102,241,.12),rgba(139,92,246,.08)) !important;
  color: var(--pp) !important; font-weight: 800 !important; font-size: 14px !important;
  padding: 5px 12px !important; border-radius: 50px !important;
  border: 1px solid rgba(99,102,241,.2) !important;
}

/* Delete button in table */
.pts-table-card .btn-outline {
  border-radius: 10px !important; padding: 7px 14px !important;
  font-size: 12px !important; font-weight: 700 !important;
  border: 1.5px solid #fca5a5 !important; color: #ef4444 !important;
  background: rgba(239,68,68,.04) !important;
  transition: var(--tr) !important;
}
.pts-table-card .btn-outline:hover {
  background: #ef4444 !important; color: #fff !important;
  border-color: #ef4444 !important; transform: scale(1.04) !important;
}

/* Animations */
@keyframes prem-fadeup { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
.pts-form-card, .pts-table-card, .prem-card { animation: prem-fadeup .3s ease both !important; }
</style>
`;

// Insert before </head>
html = html.replace('</head>', premiumCSS + '\n</head>');

// ─────────────────────────────────────────────────────────────
// 2.  JS INJECTOR — Runs after DOMContentLoaded
//     Transforms Settings + Points sections to premium HTML
// ─────────────────────────────────────────────────────────────
const premiumJS = `
<script id="withu-premium-js">
(function() {
  function buildSettingsSection(sec) {
    // Preserve existing inputs by wrapping them instead of replacing
    sec.innerHTML = \`
<h2 style="margin-bottom:28px;font-size:26px;font-weight:800;letter-spacing:-.6px;">
  <i class="fas fa-cog" style="background:linear-gradient(135deg,#6366F1,#8B5CF6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-right:10px;"></i>
  Store Settings
</h2>

<!-- Business Hours Card -->
<div class="prem-card">
  <div class="prem-section-title">
    <div class="prem-section-icon green">🕐</div>
    <div>
      <div class="prem-section-label">Business Hours &amp; Store Status</div>
      <div class="prem-section-sub">Manage operating hours and availability</div>
    </div>
  </div>

  <!-- iOS Toggle -->
  <div class="ios-toggle-row" id="prem-toggle-row">
    <div class="ios-toggle-info">
      <div class="ios-status-icon" id="prem-status-icon">✅</div>
      <div>
        <div class="ios-status-text" id="prem-status-text">Open for Orders</div>
        <div class="ios-status-sub" id="prem-status-sub">Store is currently accepting orders</div>
      </div>
    </div>
    <label class="ios-switch">
      <input type="checkbox" id="store-open-status" onchange="toggleStoreStatus(); updateStoreToggleUI();" checked>
      <span class="ios-slider"></span>
    </label>
  </div>

  <div class="prem-divider"></div>
  <div class="prem-label">Operating Days</div>
  <div class="days-grid" id="bh-days">
    <label class="day-pill"><input type="checkbox" value="1" checked> จ.</label>
    <label class="day-pill"><input type="checkbox" value="2" checked> อ.</label>
    <label class="day-pill"><input type="checkbox" value="3" checked> พ.</label>
    <label class="day-pill"><input type="checkbox" value="4" checked> พฤ.</label>
    <label class="day-pill"><input type="checkbox" value="5" checked> ศ.</label>
    <label class="day-pill"><input type="checkbox" value="6" checked> ส.</label>
    <label class="day-pill"><input type="checkbox" value="0" checked> อา.</label>
  </div>

  <div class="prem-divider"></div>
  <div class="time-grid">
    <div class="time-field">
      <label>เวลาเปิด (Open)</label>
      <div class="time-field-wrap">
        <span class="t-icon">🌅</span>
        <input type="time" id="bh-start" value="09:00">
      </div>
    </div>
    <div class="time-field">
      <label>เวลาปิด (Close)</label>
      <div class="time-field-wrap">
        <span class="t-icon">🌙</span>
        <input type="time" id="bh-end" value="21:00">
      </div>
    </div>
  </div>

  <button class="prem-save-btn prem-save-green" onclick="saveBusinessHours(); this.nextElementSibling.textContent='Last saved: '+new Date().toLocaleTimeString('th-TH');">
    💾 บันทึกเวลาทำการ
  </button>
  <div class="prem-last-updated" id="prem-last-saved"></div>
</div>

<!-- Sound Card -->
<div class="prem-card">
  <div class="prem-section-title">
    <div class="prem-section-icon blue">🔔</div>
    <div>
      <div class="prem-section-label">Sound Alerts</div>
      <div class="prem-section-sub">Enable or disable notification sounds</div>
    </div>
  </div>
  <button id="btn-sound-setting" onclick="window.toggleSound()" class="prem-save-btn" style="background:linear-gradient(135deg,#3b82f6,#2563eb);box-shadow:0 4px 18px rgba(59,130,246,.25);">
    🔊 เปิด/ปิด เสียงแจ้งเตือน
  </button>
</div>
\`;

    // Restore saved business hours from localStorage
    try {
      var bh = JSON.parse(localStorage.getItem('withu_business_hours') || '{}');
      if (bh.start) { var bs = document.getElementById('bh-start'); if(bs) bs.value = bh.start; }
      if (bh.end)   { var be = document.getElementById('bh-end');   if(be) be.value = bh.end; }
      if (bh.days && Array.isArray(bh.days)) {
        var dayInputs = document.querySelectorAll('#bh-days input[type=checkbox]');
        dayInputs.forEach(function(inp) { inp.checked = bh.days.indexOf(parseInt(inp.value)) !== -1; });
      }
      var storeStatus = localStorage.getItem('withu_store_open');
      var chk = document.getElementById('store-open-status');
      if (chk && storeStatus === 'false') { chk.checked = false; updateStoreToggleUI(); }
    } catch(e) {}
  }

  function buildPointsSection(sec) {
    // Preserve the existing tbody id="points-list"
    sec.innerHTML = \`
<div class="pts-header-title">
  <span style="background:linear-gradient(135deg,#F59E0B,#D97706);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-right:10px;">⭐</span>
  Loyalty Points
</div>

<!-- Form Card -->
<div class="pts-form-card">
  <div class="prem-section-title">
    <div class="prem-section-icon purple">👤</div>
    <div>
      <div class="prem-section-label">เพิ่ม / แก้ไข สมาชิก</div>
      <div class="prem-section-sub">Add or update member loyalty points</div>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;">
    <div class="pts-field">
      <span class="pts-field-label">📱 Phone</span>
      <div class="pts-input-wrap">
        <span class="inp-icon">📞</span>
        <input type="tel" id="pts-phone" placeholder="09XXXXXXXX">
      </div>
    </div>
    <div class="pts-field">
      <span class="pts-field-label">👤 Name</span>
      <div class="pts-input-wrap">
        <span class="inp-icon">✏️</span>
        <input type="text" id="pts-name" placeholder="ชื่อลูกค้า">
      </div>
    </div>
    <div class="pts-field">
      <span class="pts-field-label">⭐ Points</span>
      <div class="pts-input-wrap pts-big">
        <span class="inp-icon">🌟</span>
        <input type="number" id="pts-val" value="0" min="0">
      </div>
    </div>
  </div>

  <div class="pts-btn-row">
    <button class="pts-btn-save" onclick="savePointData()">💾 บันทึกสมาชิก</button>
    <button class="pts-btn-search" onclick="searchMember()">🔍 ค้นหาสมาชิก</button>
    <button class="pts-btn-clear" onclick="document.getElementById('pts-phone').value='';document.getElementById('pts-name').value='';document.getElementById('pts-val').value=0;">✕ ล้างข้อมูล</button>
  </div>
</div>

<!-- Table Card -->
<div class="pts-table-card">
  <table class="report-table" style="min-width:500px;width:100%;border:none;">
    <thead>
      <tr>
        <th>Phone</th><th>Name</th><th>Points</th><th>Actions</th>
      </tr>
    </thead>
    <tbody id="points-list"></tbody>
  </table>
</div>
\`;
  }

  // Search member helper
  window.searchMember = function() {
    var phone = (document.getElementById('pts-phone') || {}).value;
    if (!phone) { if(typeof showToast==='function') showToast('กรุณากรอกเบอร์โทรก่อน','error'); return; }
    if(typeof showToast==='function') showToast('กำลังค้นหา...','info');
    var url = (typeof FIREBASE_POINTS_URL !== 'undefined') ? FIREBASE_POINTS_URL.replace('.json', '/' + phone.trim() + '.json') : null;
    if (!url) return;
    fetch(url).then(function(r){return r.json();}).then(function(d){
      if (d && d.points !== undefined) {
        var n = document.getElementById('pts-name'); var v = document.getElementById('pts-val');
        if(n) n.value = d.name || '';
        if(v) v.value = (typeof d.points === 'object' ? d.points.points : d.points) || 0;
        if(typeof showToast==='function') showToast('พบสมาชิก: '+phone,'success');
      } else { if(typeof showToast==='function') showToast('ไม่พบสมาชิกในระบบ','error'); }
    }).catch(function(){ if(typeof showToast==='function') showToast('ค้นหาล้มเหลว','error'); });
  };

  // Update toggle UI
  window.updateStoreToggleUI = function() {
    var chk = document.getElementById('store-open-status');
    var icon = document.getElementById('prem-status-icon');
    var txt  = document.getElementById('prem-status-text');
    var sub  = document.getElementById('prem-status-sub');
    var row  = document.getElementById('prem-toggle-row');
    if (!chk) return;
    if (chk.checked) {
      if(icon) icon.textContent = '✅';
      if(txt)  txt.textContent  = 'Open for Orders';
      if(sub)  sub.textContent  = 'Store is currently accepting orders';
      if(row)  { row.style.background='linear-gradient(135deg,rgba(16,185,129,.07),rgba(5,150,105,.04))'; row.style.borderColor='rgba(16,185,129,.2)'; }
    } else {
      if(icon) icon.textContent = '🔴';
      if(txt)  txt.textContent  = 'Store Closed';
      if(sub)  sub.textContent  = 'Not accepting orders right now';
      if(row)  { row.style.background='linear-gradient(135deg,rgba(239,68,68,.06),rgba(220,38,38,.03))'; row.style.borderColor='rgba(239,68,68,.2)'; }
    }
  };

  // Wrap loadPoints render to add points badge
  function wrapLoadPoints() {
    if (typeof window._origLoadPoints === 'undefined' && typeof window.loadPoints === 'function') {
      window._origLoadPoints = window.loadPoints;
      window.loadPoints = async function() {
        await window._origLoadPoints();
        // Wrap raw number in badge if not already
        var rows = document.querySelectorAll('#points-list tr');
        rows.forEach(function(row) {
          var cells = row.querySelectorAll('td');
          if (cells[2] && !cells[2].querySelector('.pts-badge')) {
            var raw = cells[2].textContent.trim();
            if (raw && raw !== '-') {
              cells[2].innerHTML = '<span class="pts-badge">⭐ ' + raw + '</span>';
            }
          }
        });
      };
    }
  }

  function init() {
    var settingsSec = document.getElementById('settings-sec');
    var pointsSec   = document.getElementById('points-sec');
    if (settingsSec && !settingsSec.querySelector('.prem-card')) buildSettingsSection(settingsSec);
    if (pointsSec   && !pointsSec.querySelector('.pts-form-card')) buildPointsSection(pointsSec);
    wrapLoadPoints();
  }

  // Run after DOM + existing scripts have had a chance to create sections
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(init, 400); });
  } else {
    setTimeout(init, 400);
  }

  // Also watch for settings-sec being inserted dynamically
  var mo = new MutationObserver(function(muts) {
    muts.forEach(function(m) {
      m.addedNodes.forEach(function(n) {
        if (n.id === 'settings-sec' && !n.querySelector('.prem-card')) buildSettingsSection(n);
        if (n.id === 'points-sec'   && !n.querySelector('.pts-form-card')) buildPointsSection(n);
      });
    });
  });
  mo.observe(document.body || document.documentElement, { childList: true, subtree: true });
})();
</script>
`;

// Insert premium JS before </body>
html = html.replace('</body>', premiumJS + '\n</body>');

fs.writeFileSync('d:/withu/withU/admin.html', html, 'utf8');

// Validate all scripts
const scriptMatches = html.match(/<script\b[^>]*>([\s\S]*?)<\/script>/gi);
let allOk = true;
scriptMatches.forEach(function(s, i) {
    const code = s.replace(/<\/?script[^>]*>/gi, '');
    try { new Function(code); }
    catch(e) { console.log('Script ' + i + ' Error: ' + e.message); allOk = false; }
});
if (allOk) console.log('✅ ALL ' + scriptMatches.length + ' SCRIPTS OK. File: ' + fs.statSync('d:/withu/withU/admin.html').size + ' bytes');
