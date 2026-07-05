const fs = require('fs');
let html = fs.readFileSync('d:/withu/withU/admin.html', 'utf8');

// ===== 1. INJECT CSS before </style> of main style block =====
const modalCSS = `
        /* ========== WITHU MODAL SYSTEM CSS ========== */
        .withu-overlay {
            position: fixed; inset: 0; z-index: 99999;
            background: rgba(0,0,0,0.55);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            display: none; align-items: center; justify-content: center;
            opacity: 0;
            transition: opacity 0.25s ease;
        }
        .withu-overlay.open { display: flex; }
        .withu-overlay.visible { opacity: 1; }
        .withu-modal-box {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 22px;
            padding: 36px 30px 28px;
            max-width: 400px; width: 88%;
            box-shadow: 0 32px 80px rgba(0,0,0,0.25);
            transform: translateY(28px) scale(0.96);
            transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease;
            opacity: 0;
            text-align: center;
        }
        .withu-overlay.visible .withu-modal-box {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        .withu-modal-icon {
            width: 60px; height: 60px; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            margin: 0 auto 18px; font-size: 28px;
        }
        .withu-modal-icon.type-info { background: rgba(59,130,246,0.12); }
        .withu-modal-icon.type-success { background: rgba(16,185,129,0.12); }
        .withu-modal-icon.type-danger { background: rgba(239,68,68,0.12); }
        .withu-modal-icon.type-warn { background: rgba(245,158,11,0.12); }
        .withu-modal-title {
            font-size: 18px; font-weight: 800; letter-spacing: -0.4px;
            color: var(--text-main); margin-bottom: 10px;
        }
        .withu-modal-msg {
            font-size: 14px; color: var(--text-muted);
            line-height: 1.75; margin-bottom: 28px;
        }
        .withu-modal-actions { display: flex; gap: 10px; justify-content: center; }
        .withu-mbtn {
            flex: 1; padding: 13px 18px; border-radius: 13px;
            font-size: 14px; font-weight: 700; cursor: pointer;
            border: 1.5px solid transparent; transition: all 0.18s ease;
            letter-spacing: -0.2px; font-family: inherit;
        }
        .withu-mbtn:active { transform: scale(0.96); }
        .withu-mbtn-primary { background: #000; color: #fff; border-color: #000; }
        [data-theme="dark"] .withu-mbtn-primary { background: #fff; color: #000; border-color: #fff; }
        .withu-mbtn-primary:hover { opacity: 0.85; }
        .withu-mbtn-danger { background: #ef4444; color: #fff; border-color: #ef4444; }
        .withu-mbtn-danger:hover { background: #dc2626; }
        .withu-mbtn-ghost { background: transparent; color: var(--text-main); border-color: var(--border); }
        .withu-mbtn-ghost:hover { background: var(--slate); }
        /* ========== TOAST ENHANCEMENT ========== */
        #toast-container .toast {
            border-radius: 14px !important;
            backdrop-filter: blur(20px);
            box-shadow: 0 8px 32px rgba(0,0,0,0.18) !important;
        }
`;

// Insert into main <style> block, before closing tag
html = html.replace(/(\s*)(\* \{ font-family)/, modalCSS + '\n        $2');

// ===== 2. INJECT Modal HTML + JS right before </body> =====
const modalHTML = `
<!-- ========== WITHU CUSTOM MODAL ========== -->
<div class="withu-overlay" id="withu-alert-ov">
    <div class="withu-modal-box">
        <div class="withu-modal-icon type-info" id="withu-alert-icon">ℹ️</div>
        <div class="withu-modal-title" id="withu-alert-title">แจ้งเตือน</div>
        <div class="withu-modal-msg" id="withu-alert-msg"></div>
        <div class="withu-modal-actions">
            <button class="withu-mbtn withu-mbtn-primary" id="withu-alert-ok">ตกลง</button>
        </div>
    </div>
</div>
<div class="withu-overlay" id="withu-confirm-ov">
    <div class="withu-modal-box">
        <div class="withu-modal-icon type-danger">⚠️</div>
        <div class="withu-modal-title" id="withu-confirm-title">ยืนยันการดำเนินการ</div>
        <div class="withu-modal-msg" id="withu-confirm-msg"></div>
        <div class="withu-modal-actions">
            <button class="withu-mbtn withu-mbtn-ghost" id="withu-confirm-cancel">ยกเลิก</button>
            <button class="withu-mbtn withu-mbtn-danger" id="withu-confirm-ok">ยืนยัน</button>
        </div>
    </div>
</div>

<script>
(function() {
    function showOverlay(id) {
        var el = document.getElementById(id);
        if (!el) return;
        el.style.display = 'flex';
        el.classList.add('open');
        requestAnimationFrame(function() {
            requestAnimationFrame(function() { el.classList.add('visible'); });
        });
    }
    function hideOverlay(id) {
        var el = document.getElementById(id);
        if (!el) return;
        el.classList.remove('visible');
        setTimeout(function() { el.classList.remove('open'); el.style.display = 'none'; }, 280);
    }

    window.__withuAlert = function(msg, type) {
        var msgStr = String(msg || '');
        var icon = document.getElementById('withu-alert-icon');
        var title = document.getElementById('withu-alert-title');
        var msgEl = document.getElementById('withu-alert-msg');
        if (!icon || !title || !msgEl) { return; }

        if (type === 'success' || msgStr.match(/สำเร็จ|บันทึก|เรียบร้อย|กู้/)) {
            icon.textContent = '✅'; icon.className = 'withu-modal-icon type-success';
            title.textContent = 'สำเร็จ';
        } else if (type === 'error' || msgStr.match(/ล้มเหลว|ผิดพลาด|กรุณา/)) {
            icon.textContent = '❌'; icon.className = 'withu-modal-icon type-danger';
            title.textContent = 'เกิดข้อผิดพลาด';
        } else if (type === 'warn') {
            icon.textContent = '⚠️'; icon.className = 'withu-modal-icon type-warn';
            title.textContent = 'คำเตือน';
        } else {
            icon.textContent = 'ℹ️'; icon.className = 'withu-modal-icon type-info';
            title.textContent = 'แจ้งเตือน';
        }
        msgEl.textContent = msgStr;

        var okBtn = document.getElementById('withu-alert-ok');
        if (okBtn) okBtn.onclick = function() { hideOverlay('withu-alert-ov'); };

        showOverlay('withu-alert-ov');
        document.getElementById('withu-alert-ov').onclick = function(e) {
            if (e.target === this) hideOverlay('withu-alert-ov');
        };
    };

    window.__withuConfirm = function(msg) {
        return new Promise(function(resolve) {
            var msgEl = document.getElementById('withu-confirm-msg');
            if (msgEl) msgEl.textContent = String(msg || '');
            var okBtn = document.getElementById('withu-confirm-ok');
            var cancelBtn = document.getElementById('withu-confirm-cancel');
            function done(result) { hideOverlay('withu-confirm-ov'); resolve(result); }
            if (okBtn) { var newOk = okBtn.cloneNode(true); okBtn.parentNode.replaceChild(newOk, okBtn); newOk.onclick = function() { done(true); }; }
            if (cancelBtn) { var newCan = cancelBtn.cloneNode(true); cancelBtn.parentNode.replaceChild(newCan, cancelBtn); newCan.onclick = function() { done(false); }; }
            showOverlay('withu-confirm-ov');
            document.getElementById('withu-confirm-ov').onclick = function(e) {
                if (e.target === this) done(false);
            };
        });
    };

    // Override window.alert and window.confirm AFTER page loads
    document.addEventListener('DOMContentLoaded', function() {
        window._nativeAlert = window.alert;
        window._nativeConfirm = window.confirm;
        window.alert = window.__withuAlert;
        window.confirm = window.__withuConfirm;
    });
})();
</script>
`;

// Insert before </body>
if(html.includes('</body>')) {
    html = html.replace('</body>', modalHTML + '\n</body>');
    console.log('Injected modal HTML and JS');
} else {
    console.log('ERROR: </body> not found!');
    process.exit(1);
}

fs.writeFileSync('d:/withu/withU/admin.html', html, 'utf8');
console.log('Saved successfully');
