const fs = require('fs');
let html = fs.readFileSync('d:/withu/withU/admin.html', 'utf8');

const statCSS = `
<style id="withu-stat-cards">
/* ── Premium Stat Cards ────────────────────────────── */
.stats-grid {
  display: grid !important;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)) !important;
  gap: 16px !important;
  margin-bottom: 22px !important;
}
.stat-card {
  background: #fff !important;
  border: 1px solid #F1F5F9 !important;
  border-radius: 22px !important;
  padding: 22px 22px 18px !important;
  box-shadow: 0 2px 12px rgba(99,102,241,.07), 0 1px 3px rgba(0,0,0,.05) !important;
  position: relative !important;
  overflow: hidden !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 0 !important;
  transition: all .22s cubic-bezier(.4,0,.2,1) !important;
  cursor: default !important;
}
.stat-card:hover {
  transform: translateY(-3px) !important;
  box-shadow: 0 8px 28px rgba(99,102,241,.13), 0 2px 6px rgba(0,0,0,.06) !important;
}
[data-theme="dark"] .stat-card {
  background: #161b27 !important;
  border-color: #2a2f3e !important;
  box-shadow: 0 2px 16px rgba(0,0,0,.4) !important;
}

/* Decorative blob bottom-right */
.stat-card::after {
  content: '' !important;
  position: absolute !important;
  bottom: -18px !important; right: -18px !important;
  width: 90px !important; height: 90px !important;
  border-radius: 50% !important;
  opacity: .09 !important;
  pointer-events: none !important;
}
.stat-card:nth-child(1)::after { background: radial-gradient(circle,#6366F1,#8B5CF6) !important; }
.stat-card:nth-child(2)::after { background: radial-gradient(circle,#6366F1,#A78BFA) !important; }
.stat-card:nth-child(3)::after { background: radial-gradient(circle,#3B82F6,#60A5FA) !important; }
.stat-card:nth-child(4)::after { background: radial-gradient(circle,#10B981,#34D399) !important; }

/* Icon box */
.sc-icon {
  width: 44px !important; height: 44px !important;
  border-radius: 13px !important;
  display: flex !important; align-items: center !important; justify-content: center !important;
  font-size: 20px !important;
  margin-bottom: 14px !important;
  flex-shrink: 0 !important;
}
.sc-icon-1 { background: linear-gradient(135deg,#6366F1,#8B5CF6) !important; }
.sc-icon-2 { background: linear-gradient(135deg,#6366F1,#A78BFA) !important; }
.sc-icon-3 { background: linear-gradient(135deg,#3B82F6,#60A5FA) !important; }
.sc-icon-4 { background: linear-gradient(135deg,#10B981,#34D399) !important; }

/* Label */
.stat-card small {
  font-size: 12px !important; font-weight: 600 !important;
  letter-spacing: .1px !important; text-transform: none !important;
  color: #64748B !important; display: block !important;
  margin-bottom: 4px !important;
}
[data-theme="dark"] .stat-card small { color: #94A3B8 !important; }

/* Number */
.stat-card h3 {
  font-size: 30px !important; font-weight: 800 !important;
  letter-spacing: -1px !important; line-height: 1.1 !important;
  color: #0F172A !important; margin: 0 0 14px !important;
  background: none !important;
  -webkit-text-fill-color: #0F172A !important;
}
[data-theme="dark"] .stat-card h3 { color: #F1F5F9 !important; -webkit-text-fill-color: #F1F5F9 !important; }

/* Comparison row */
.sc-compare {
  display: flex !important; align-items: center !important; gap: 6px !important;
  font-size: 12px !important; font-weight: 600 !important;
  border-top: 1px solid #F1F5F9 !important;
  padding-top: 11px !important; margin-top: auto !important;
}
[data-theme="dark"] .sc-compare { border-top-color: #2a2f3e !important; }
.sc-compare .sc-delta {
  display: inline-flex !important; align-items: center !important; gap: 3px !important;
  font-size: 11px !important; font-weight: 700 !important;
  padding: 3px 8px !important; border-radius: 50px !important;
}
.sc-delta.up   { background: rgba(16,185,129,.1) !important; color: #059669 !important; }
.sc-delta.down { background: rgba(239,68,68,.1) !important; color: #DC2626 !important; }
.sc-delta.flat { background: rgba(100,116,139,.1) !important; color: #64748B !important; }
.sc-compare .sc-label { color: #94A3B8 !important; font-weight: 500 !important; }
</style>
`;

// JS to rebuild stat cards with new icon+compare structure
const statJS = `
<script id="withu-stat-rebuild">
(function() {
  var CARD_CONFIGS = [
    { id: 'stat-card-0', icon: '📊', iconClass: 'sc-icon-1', labelId: 'lbl-stat-profit',  valId: 'prof-val',   compareId: 'sc-cmp-0', storeKey: '_prev_prof'    },
    { id: 'stat-card-1', icon: '💰', iconClass: 'sc-icon-2', labelId: 'lbl-stat-revenue', valId: 'rev-val',    compareId: 'sc-cmp-1', storeKey: '_prev_rev'     },
    { id: 'stat-card-2', icon: '⏱️', iconClass: 'sc-icon-3', labelId: 'lbl-stat-speed',   valId: 'avg-speed',  compareId: 'sc-cmp-2', storeKey: '_prev_speed'   },
    { id: 'stat-card-3', icon: '📋', iconClass: 'sc-icon-4', labelId: 'lbl-stat-orders',  valId: 'order-count',compareId: 'sc-cmp-3', storeKey: '_prev_orders'  },
  ];

  function parseNum(txt) {
    if (!txt) return 0;
    var n = parseFloat(txt.replace(/[^0-9.\\-]/g, ''));
    return isNaN(n) ? 0 : n;
  }

  function rebuildCards() {
    var grid = document.querySelector('.stats-grid');
    if (!grid || grid.querySelector('.sc-icon')) return;

    var cards = grid.querySelectorAll('.stat-card');
    cards.forEach(function(card, i) {
      var cfg = CARD_CONFIGS[i];
      if (!cfg) return;

      // Get existing small and h3
      var small = card.querySelector('small');
      var h3    = card.querySelector('h3');
      if (!small || !h3) return;

      // Build new inner HTML (keep existing elements, just wrap)
      card.innerHTML =
        '<div class="sc-icon ' + cfg.iconClass + '" aria-hidden="true">' + cfg.icon + '</div>' +
        '<small id="' + cfg.labelId + '">' + (small.textContent || '') + '</small>' +
        '<h3 id="' + cfg.valId + '">' + (h3.textContent || '0') + '</h3>' +
        '<div class="sc-compare">' +
          '<span class="sc-delta flat" id="' + cfg.compareId + '">— 0%</span>' +
          '<span class="sc-label">จากเมื่อวาน</span>' +
        '</div>';

      card.setAttribute('data-stat-idx', i);
    });
  }

  // Update deltas whenever stat values change
  function updateDeltas() {
    CARD_CONFIGS.forEach(function(cfg, i) {
      var valEl  = document.getElementById(cfg.valId);
      var cmpEl  = document.getElementById(cfg.compareId);
      if (!valEl || !cmpEl) return;
      var cur  = parseNum(valEl.textContent);
      var prev = parseFloat(localStorage.getItem(cfg.storeKey) || '0');
      if (prev === 0 && cur === 0) { cmpEl.textContent = '→ 0%'; cmpEl.className = 'sc-delta flat'; return; }
      if (prev === 0) { cmpEl.textContent = '↑ ' + cur; cmpEl.className = 'sc-delta up'; return; }
      var pct  = Math.round(((cur - prev) / Math.abs(prev)) * 100);
      if (pct > 0) { cmpEl.textContent = '↑ ' + pct + '%'; cmpEl.className = 'sc-delta up'; }
      else if (pct < 0) { cmpEl.textContent = '↓ ' + Math.abs(pct) + '%'; cmpEl.className = 'sc-delta down'; }
      else { cmpEl.textContent = '→ ' + pct + '%'; cmpEl.className = 'sc-delta flat'; }
    });
  }

  // Save today's values as yesterday's at midnight / first load of new day
  function savePrevIfNewDay() {
    var today = new Date().toDateString();
    var savedDay = localStorage.getItem('_withu_stat_day');
    if (savedDay !== today) {
      CARD_CONFIGS.forEach(function(cfg) {
        var el = document.getElementById(cfg.valId);
        if (el) localStorage.setItem(cfg.storeKey, parseNum(el.textContent));
      });
      localStorage.setItem('_withu_stat_day', today);
    }
  }

  function init() {
    rebuildCards();
    savePrevIfNewDay();
    // Observe value changes
    var mo = new MutationObserver(function() { updateDeltas(); });
    CARD_CONFIGS.forEach(function(cfg) {
      var el = document.getElementById(cfg.valId);
      if (el) mo.observe(el, { childList: true, characterData: true, subtree: true });
    });
    updateDeltas();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(init, 600); });
  } else {
    setTimeout(init, 600);
  }
})();
</script>
`;

// Inject CSS before </head>
html = html.replace('</head>', statCSS + '\n</head>');
// Inject JS before </body>
html = html.replace('</body>', statJS + '\n</body>');

fs.writeFileSync('d:/withu/withU/admin.html', html, 'utf8');

// Validate
const scriptMatches = html.match(/<script\b[^>]*>([\s\S]*?)<\/script>/gi);
let allOk = true;
scriptMatches.forEach(function(s, i) {
    const code = s.replace(/<\/?script[^>]*>/gi, '');
    try { new Function(code); }
    catch(e) { console.log('Script ' + i + ' Error: ' + e.message); allOk = false; }
});
console.log(allOk ? '✅ ALL OK — scripts: ' + scriptMatches.length : '❌ Errors found');
console.log('File size:', require('fs').statSync('d:/withu/withU/admin.html').size);
