const fs = require('fs');

const patchCode = `
<script id="withu-frontend-patch">
    function checkStoreOpen() {
        const isForceOpen = localStorage.getItem('withu_store_open');
        if (isForceOpen === 'false') return false;

        try {
            const bhStr = localStorage.getItem('withu_business_hours');
            if (bhStr) {
                const bh = JSON.parse(bhStr);
                const now = new Date();
                const day = now.getDay(); // 0-6
                
                if (!bh.days.includes(day)) return false;
                
                if (bh.start && bh.end) {
                    const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
                    if (timeStr < bh.start || timeStr > bh.end) return false;
                }
            }
        } catch(e) {}
        
        return true;
    }

    // Intercept checkout
    const origCheckout = typeof checkout === 'function' ? checkout : null;
    if (origCheckout) {
        window.checkout = function() {
            if (!checkStoreOpen()) {
                if (typeof showToast === 'function') showToast('ขออภัยค่ะ ขณะนี้ร้านปิดให้บริการ', 'call');
                else alert('ขออภัยค่ะ ขณะนี้ร้านปิดให้บริการ');
                return;
            }
            origCheckout();
        };
    }

    // Intercept finalPay for QR
    const origFinalPay = typeof finalPay === 'function' ? finalPay : null;
    if (origFinalPay) {
        window.finalPay = function(method) {
            origFinalPay(method);
            if (method === 'qr') {
                const pp = localStorage.getItem('withu_promptpay') || '0931805507';
                const img = document.getElementById('p-qr-img');
                const totalEl = document.getElementById('p-total');
                if (img && totalEl) {
                    const amt = totalEl.innerText.replace(/,/g, '');
                    img.src = "https://promptpay.io/" + pp + "/" + amt + ".png";
                }
            }
        };
    }
</script>
`;

['index.html', 'delivery.html'].forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        if (!content.includes('id="withu-frontend-patch"')) {
            content = content.replace('</body>', patchCode + '\n</body>');
            fs.writeFileSync(file, content, 'utf8');
            console.log('Patched ' + file);
        }
    }
});
