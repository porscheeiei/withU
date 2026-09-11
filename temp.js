
    function openSlipModal(imgData) {
        document.getElementById('slip-image-view').src = imgData;
        document.getElementById('slip-modal').style.display = 'flex';
    }
    function closeSlipModal() {
        document.getElementById('slip-modal').style.display = 'none';
        document.getElementById('slip-image-view').src = "";
    }

    // ==========================================
    // Async Firebase Fetch for Delivery Orders
    // ==========================================
    window.deliveryDataCache = window.deliveryDataCache || {};

    async function loadFirebaseDelivery(tableId, groupData) {
        let el = document.getElementById(`delivery-block-${tableId}`);
        if (!el) return;
        
        // 1. Fallback for legacy orders packed in details
        let legacyItem = groupData.items.find(i => i.details && i.details.includes('[DELIVERY_DATA]'));
        if (legacyItem) {
            let raw = legacyItem.details;
            let dInfo = raw.split('[DELIVERY_DATA]')[1].split('[SLIP_DATA]')[0];
            let dSlip = raw.includes('[SLIP_DATA]') ? raw.split('[SLIP_DATA]')[1] : "";
            window.deliveryDataCache[tableId] = { info: dInfo, slip: dSlip };
        }
        
        // 2. Render from cache immediately if exists
        if (window.deliveryDataCache[tableId]) {
            if (!window.deliveryDataCache[tableId].empty) renderDeliveryBlock(tableId, window.deliveryDataCache[tableId]);
            return;
        }

        if(el.innerHTML === "") el.innerHTML = `<span style="font-size:11px; color:#94a3b8; display:block; margin-bottom:8px;">กำลังโหลดข้อมูลจัดส่ง... <i class="fas fa-spinner fa-spin"></i></span>`;
        
        // 3. Fetch from Firebase
        try {
            let res = await fetch(`https://withu-da97c-default-rtdb.asia-southeast1.firebasedatabase.app/slips/${tableId}.json`);
            let data = await res.json();
            if (data && data.info) {
                window.deliveryDataCache[tableId] = data;
                renderDeliveryBlock(tableId, data);
            } else {
                window.deliveryDataCache[tableId] = { empty: true };
                if (el) el.innerHTML = "";
            }
        } catch(e) {
            console.warn("Firebase delivery load failed", e);
            if (el) el.innerHTML = "";
        }
    }

    function renderDeliveryBlock(tableId, data) {
        let el = document.getElementById(`delivery-block-${tableId}`);
        if (!el || data.empty) return;
        let dText = data.info.replace(/\|/g, '<br>');
        let slipBtn = data.slip ? `<button onclick="openSlipModal('${data.slip}')" style="margin-top:8px; background:var(--primary); color:white; border:none; padding:4px 10px; border-radius:6px; font-size:12px; cursor:pointer;">ดูสลิปโอนเงิน</button>` : "";
        el.innerHTML = `
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:10px; margin-bottom:12px; font-size:13px; color:#475569; line-height:1.5;">
            <strong style="color:var(--primary); display:block; margin-bottom:4px;"><i class="fas fa-truck"></i> ข้อมูลการจัดส่ง / ชำระเงิน</strong>
            ${dText}
            <br>${slipBtn}
        </div>`;
    }

// Custom Confirm Function
window.customConfirm = function(msg, callback) {
    // If modal already exists, show it, otherwise create it
    let modal = document.getElementById('custom-confirm-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'custom-confirm-modal';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:99999;';
        modal.innerHTML = `
            <div style="background:#fff; border-radius:12px; padding:24px; max-width:400px; width:90%; text-align:center; box-shadow:0 10px 25px rgba(0,0,0,0.2);">
                <div style="font-size:40px; color:#111; margin-bottom:15px;"><i class="fas fa-exclamation-circle"></i></div>
                <h3 style="margin:0 0 10px 0; color:#111; font-size:20px;">ยืนยันการทำรายการ</h3>
                <p id="custom-confirm-msg" style="color:#555; margin-bottom:20px; font-size:16px;"></p>
                <div style="display:flex; gap:10px; justify-content:center;">
                    <button id="custom-confirm-cancel" style="flex:1; padding:12px; border-radius:8px; border:1px solid #ccc; background:#fff; color:#333; cursor:pointer; font-weight:bold;">ยกเลิก</button>
                    <button id="custom-confirm-ok" style="flex:1; padding:12px; border-radius:8px; border:none; background:#111; color:#fff; cursor:pointer; font-weight:bold;">ตกลง</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    document.getElementById('custom-confirm-msg').innerText = msg;
    modal.style.display = 'flex';
    
    document.getElementById('custom-confirm-cancel').onclick = function() {
        modal.style.display = 'none';
        if (callback) callback(false);
    };
    document.getElementById('custom-confirm-ok').onclick = function() {
        modal.style.display = 'none';
        if (callback) callback(true);
    };
};

