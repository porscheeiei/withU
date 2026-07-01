const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// For index.html, promptpay might not be used directly if it's table service. But there might be a qr generated somewhere.
// Let's just add the store close logic.
const storeCloseLogic = `
    // Check Store Open Status
    if (localStorage.getItem('withu_store_open') === 'false') {
        const body = document.querySelector('body');
        body.innerHTML = '<div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; background:var(--bg); color:var(--text); text-align:center; padding:20px;"><i class="fas fa-store-slash" style="font-size:64px; color:#ef4444; margin-bottom:20px;"></i><h1 style="font-family:var(--font-head); font-weight:800; font-size:28px;">ขออภัย ร้านปิดรับออเดอร์ชั่วคราว</h1><p style="color:var(--secondary); font-size:16px; margin-top:10px;">ขณะนี้ร้านปิดทำการ หรืออยู่นอกเวลาให้บริการ กรุณากลับมาใหม่ภายหลัง</p></div>';
        return;
    }
`;

if (!html.includes('withu_store_open')) {
    html = html.replace('function init() {', 'function init() {' + storeCloseLogic);
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Updated index.html logic');
