const fs = require('fs');
let html = fs.readFileSync('delivery.html', 'utf8');

html = html.replace('https://promptpay.io/0931805507/', 'https://promptpay.io/${localStorage.getItem(\'withu_promptpay\') || \'0931805507\'}/');

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

fs.writeFileSync('delivery.html', html, 'utf8');
console.log('Updated delivery.html logic');
