const fs = require('fs');
let html = fs.readFileSync('d:/withu/withU/admin.html', 'utf8');

// 1. Inject CSS for modal system right before </style> in main style block
const modalCSS = `
        /* ==================== CUSTOM MODAL SYSTEM ==================== */
        .withu-overlay {
            position: fixed; inset: 0; z-index: 99999;
            background: rgba(0,0,0,0.55);
            backdrop-filter: blur(6px);
            display: flex; align-items: center; justify-content: center;
            opacity: 0; pointer-events: none;
            transition: opacity 0.25s ease;
        }
        .withu-overlay.active { opacity: 1; pointer-events: all; }
        .withu-modal-box {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 20px;
            padding: 36px 32px 28px;
            max-width: 420px; width: 90%;
            box-shadow: 0 24px 60px rgba(0,0,0,0.20);
            transform: translateY(24px) scale(0.97);
            transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease;
            opacity: 0;
            text-align: center;
            position: relative;
        }
        .withu-overlay.active .withu-modal-box { transform: translateY(0) scale(1); opacity: 1; }
        .withu-modal-icon {
            width: 56px; height: 56px; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            margin: 0 auto 18px;
            font-size: 26px;
        }
        .withu-modal-icon.alert-icon { background: rgba(59,130,246,0.12); color: #3b82f6; }
        .withu-modal-icon.confirm-icon { background: rgba(239,68,68,0.12); color: #ef4444; }
        .withu-modal-icon.success-icon { background: rgba(16,185,129,0.12); color: #10b981; }
        .withu-modal-title {
            font-size: 18px; font-weight: 800; letter-spacing: -0.3px;
            color: var(--text-main); margin-bottom: 10px;
        }
        .withu-modal-msg {
            font-size: 14px; color: var(--text-muted);
            line-height: 1.7; margin-bottom: 26px;
        }
        .withu-modal-actions { display: flex; gap: 10px; justify-content: center; }
        .withu-btn {
            flex: 1; padding: 13px 20px; border-radius: 12px;
            font-size: 14px; font-weight: 700; cursor: pointer;
            border: none; transition: all 0.18s ease;
            letter-spacing: -0.2px;
        }
        .withu-btn:active { transform: scale(0.97); }
        .withu-btn-primary { background: #000; color: #fff; }
        .withu-btn-primary:hover { background: #1a1a1a; }
        .withu-btn-danger { background: #ef4444; color: #fff; }
        .withu-btn-danger:hover { background: #dc2626; }
        .withu-btn-ghost { background: var(--slate); color: var(--text-main); border: 1px solid var(--border); }
        .withu-btn-ghost:hover { background: var(--border); }
        /* ==================== TOAST SYSTEM UPGRADE ==================== */
        .toast-container { bottom: 30px !important; }
        .toast {
            border-radius: 14px !important; padding: 14px 20px !important;
            font-size: 13px !important; backdrop-filter: blur(20px);
            background: rgba(0,0,0,0.88) !important;
            box-shadow: 0 8px 32px rgba(0,0,0,0.22) !important;
            min-width: 220px;
        }
`;

// Insert CSS before the first </style>
html = html.replace('        * { font-family', modalCSS + '\n        * { font-family');

// 2. Inject modal HTML and JS before </body>
const modalHTML = `
<!-- ============ WITHU MODAL SYSTEM ============ -->
<div class="withu-overlay" id="withu-alert-overlay">
    <div class="withu-modal-box">
        <div class="withu-modal-icon alert-icon" id="withu-alert-icon">ℹ️</div>
        <div class="withu-modal-title" id="withu-alert-title">แจ้งเตือน</div>
        <div class="withu-modal-msg" id="withu-alert-msg"></div>
        <div class="withu-modal-actions">
            <button class="withu-btn withu-btn-primary" id="withu-alert-ok">ตกลง</button>
        </div>
    </div>
</div>
<div class="withu-overlay" id="withu-confirm-overlay">
    <div class="withu-modal-box">
        <div class="withu-modal-icon confirm-icon">⚠️</div>
        <div class="withu-modal-title" id="withu-confirm-title">ยืนยันการดำเนินการ</div>
        <div class="withu-modal-msg" id="withu-confirm-msg"></div>
        <div class="withu-modal-actions">
            <button class="withu-btn withu-btn-ghost" id="withu-confirm-cancel">ยกเลิก</button>
            <button class="withu-btn withu-btn-danger" id="withu-confirm-ok">ยืนยัน</button>
        </div>
    </div>
</div>
<script>
// ============ WITHU MODAL JS ============
(function() {
    function openOverlay(id) {
        var el = document.getElementById(id);
        if (!el) return;
        el.style.display = 'flex';
        requestAnimationFrame(function() {
            requestAnimationFrame(function() { el.classList.add('active'); });
        });
    }
    function closeOverlay(id) {
        var el = document.getElementById(id);
        if (!el) return;
        el.classList.remove('active');
        setTimeout(function() { el.style.display = 'none'; }, 280);
    }

    // Override alert
    window.alert = function(msg, type) {
        var icon = document.getElementById('withu-alert-icon');
        var title = document.getElementById('withu-alert-title');
        var msgEl = document.getElementById('withu-alert-msg');
        
        var msgStr = String(msg);
        
        if (type === 'success' || msgStr.includes('สำเร็จ') || msgStr.includes('บันทึก') || msgStr.includes('เรียบร้อย')) {
            if (icon) { icon.textContent = '✅'; icon.className = 'withu-modal-icon success-icon'; }
            if (title) title.textContent = 'สำเร็จ';
        } else if (type === 'error' || msgStr.includes('ล้มเหลว') || msgStr.includes('ผิดพลาด') || msgStr.includes('กรุณา')) {
            if (icon) { icon.textContent = '❌'; icon.className = 'withu-modal-icon confirm-icon'; }
            if (title) title.textContent = 'เกิดข้อผิดพลาด';
        } else {
            if (icon) { icon.textContent = 'ℹ️'; icon.className = 'withu-modal-icon alert-icon'; }
            if (title) title.textContent = 'แจ้งเตือน';
        }
        
        if (msgEl) msgEl.textContent = msgStr;
        
        var okBtn = document.getElementById('withu-alert-ok');
        if (okBtn) {
            okBtn.onclick = function() { closeOverlay('withu-alert-overlay'); };
        }
        openOverlay('withu-alert-overlay');
    };

    // Override confirm
    window.confirm = function(msg) {
        return new Promise(function(resolve) {
            var msgEl = document.getElementById('withu-confirm-msg');
            if (msgEl) msgEl.textContent = msg;
            
            var okBtn = document.getElementById('withu-confirm-ok');
            var cancelBtn = document.getElementById('withu-confirm-cancel');
            
            function done(result) {
                closeOverlay('withu-confirm-overlay');
                resolve(result);
            }
            if (okBtn) okBtn.onclick = function() { done(true); };
            if (cancelBtn) cancelBtn.onclick = function() { done(false); };
            
            openOverlay('withu-confirm-overlay');
        });
    };

    // Overlay click outside to close alert
    var alertOverlay = document.getElementById('withu-alert-overlay');
    if (alertOverlay) {
        alertOverlay.addEventListener('click', function(e) {
            if (e.target === alertOverlay) closeOverlay('withu-alert-overlay');
        });
    }
    var confirmOverlay = document.getElementById('withu-confirm-overlay');
    if (confirmOverlay) {
        confirmOverlay.addEventListener('click', function(e) {
            if (e.target === confirmOverlay) {
                var cancelBtn = document.getElementById('withu-confirm-cancel');
                if (cancelBtn) cancelBtn.click();
            }
        });
    }
})();
</script>
`;

// Insert before </body>
html = html.replace('</body>\r\n</html>', modalHTML + '</body>\n</html>');
html = html.replace('</body>\n</html>', modalHTML + '</body>\n</html>');

// 3. Fix all confirm() calls to use await (where they are used with if())
// Replace patterns like: if(!confirm( with: if(!await confirm(
html = html.replace(/if\s*\(\s*!confirm\s*\(/g, 'if(!await confirm(');
html = html.replace(/if\s*\(\s*confirm\s*\(/g, 'if(await confirm(');

fs.writeFileSync('d:/withu/withU/admin.html', html, 'utf8');
console.log('Modal system injected successfully');
