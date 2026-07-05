const fs = require('fs');
let html = fs.readFileSync('d:/withu/withU/admin.html', 'utf8');

// Add Settings section CSS + misc improvements inside the existing premium block
const settingsCSS = `
/* ====================================================
   WITHU SETTINGS + EXTRA POLISH
==================================================== */

/* ---------- Settings Section ---------- */
#settings-sec {
    padding: 24px !important;
    max-width: 760px !important;
    margin: 0 auto !important;
}
#settings-sec h2 {
    font-size: 22px !important; font-weight: 900 !important;
    letter-spacing: -0.5px !important; margin-bottom: 24px !important;
}
#settings-sec .ai-card {
    border-radius: 18px !important;
    padding: 28px !important;
    margin-bottom: 18px !important;
    border: 1.5px solid var(--border) !important;
    transition: var(--transition) !important;
    position: relative !important; overflow: hidden !important;
}
#settings-sec .ai-card:hover { box-shadow: var(--shadow-md) !important; }

/* Store open toggle */
#store-open-status {
    width: 22px !important; height: 22px !important;
    accent-color: var(--success) !important;
    cursor: pointer !important;
}
label:has(#store-open-status) {
    border-radius: 14px !important;
    padding: 16px 20px !important;
    background: rgba(16,185,129,0.07) !important;
    border: 1.5px solid rgba(16,185,129,0.25) !important;
    font-weight: 800 !important; font-size: 15px !important;
    color: var(--success) !important;
    cursor: pointer !important;
    transition: var(--transition) !important;
}
label:has(#store-open-status):hover {
    background: rgba(16,185,129,0.12) !important;
}

/* Operating days */
#bh-days label {
    cursor: pointer !important;
    border-radius: 10px !important;
    padding: 10px 16px !important;
    font-size: 13px !important; font-weight: 700 !important;
    background: var(--slate) !important;
    border: 1.5px solid var(--border) !important;
    transition: var(--transition) !important;
    display: flex !important; align-items: center !important; gap: 8px !important;
}
#bh-days label:hover {
    border-color: var(--primary) !important;
    background: rgba(99,102,241,0.06) !important;
}
#bh-days label:has(input:checked) {
    background: linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.08)) !important;
    border-color: rgba(99,102,241,0.4) !important;
    color: var(--primary) !important;
}
#bh-days input[type="checkbox"] {
    width: 16px !important; height: 16px !important;
    accent-color: var(--primary) !important;
}

/* Time inputs */
#bh-start, #bh-end {
    font-size: 18px !important; font-weight: 700 !important;
    text-align: center !important;
    padding: 14px !important;
    border-radius: 12px !important;
    border: 1.5px solid var(--border) !important;
    background: var(--slate) !important;
}
#bh-start:focus, #bh-end:focus {
    border-color: var(--primary) !important;
    box-shadow: 0 0 0 3px var(--primary-glow) !important;
}

/* Save business hours button */
button[onclick="saveBusinessHours()"] {
    background: linear-gradient(135deg,#10b981,#059669) !important;
    border-radius: 12px !important; border: none !important;
    padding: 13px 28px !important;
    font-weight: 800 !important; color: #fff !important;
    box-shadow: 0 4px 14px rgba(16,185,129,0.35) !important;
    transition: var(--transition) !important;
}
button[onclick="saveBusinessHours()"]:hover {
    box-shadow: 0 6px 20px rgba(16,185,129,0.5) !important;
    transform: translateY(-1px) !important;
}

/* Sound toggle button */
#btn-sound-setting {
    border-radius: 12px !important;
    padding: 14px 28px !important;
    font-weight: 800 !important; font-size: 14px !important;
    border: 2px solid #3b82f6 !important; color: #3b82f6 !important;
    background: rgba(59,130,246,0.06) !important;
    transition: var(--transition) !important;
    max-width: 100% !important;
}
#btn-sound-setting:hover {
    background: #3b82f6 !important; color: #fff !important;
    box-shadow: 0 6px 20px rgba(59,130,246,0.35) !important;
    transform: translateY(-1px) !important;
}

/* ---------- Void + item-row polish ---------- */
.item-row {
    padding: 14px 0 !important;
    gap: 10px !important;
}
.item-info b { font-size: 15px !important; }
.item-details-highlight {
    border-radius: 10px !important;
    font-size: 14px !important; font-weight: 800 !important;
    padding: 8px 14px !important;
}

/* ---------- Stock table polish ---------- */
#stock-list-body tr:hover td {
    background: rgba(99,102,241,0.04) !important;
    transition: var(--transition) !important;
}

/* ---------- Manual Order Modal Polish ---------- */
#manual-order-modal .modal-card {
    max-width: 700px !important;
}
#mo-menu-list {
    border-radius: 12px !important;
    border: 1.5px solid var(--border) !important;
    overflow: hidden !important;
}
#mo-cart-list {
    font-size: 13px !important;
}

/* Cart total */
#mo-total {
    font-size: 22px !important; font-weight: 900 !important;
    color: var(--primary) !important;
}

/* ---------- Toast upgrade ---------- */
.toast {
    border-radius: 16px !important;
    padding: 14px 22px !important;
    font-size: 13px !important;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2) !important;
    gap: 10px !important;
}
.toast.toast-success { border-left: 4px solid var(--success) !important; }
.toast.toast-error { border-left: 4px solid var(--danger) !important; }
.toast.toast-info { border-left: 4px solid var(--primary) !important; }

/* END settings extra */
`;

// Append to end of last </style> before </head>
const headEnd = html.indexOf('</head>');
html = html.slice(0, headEnd) + `<style id="withu-settings-css">${settingsCSS}</style>\n` + html.slice(headEnd);

fs.writeFileSync('d:/withu/withU/admin.html', html, 'utf8');
console.log('Settings CSS injected. File size:', fs.readFileSync('d:/withu/withU/admin.html','utf8').length);
