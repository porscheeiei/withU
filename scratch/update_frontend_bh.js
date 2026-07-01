const fs = require('fs');

const updateLogic = (file) => {
    let html = fs.readFileSync(file, 'utf8');

    const businessHoursCheckLogic = `
        // Check Business Hours
        try {
            const bhStr = localStorage.getItem('withu_business_hours');
            if (bhStr) {
                const bh = JSON.parse(bhStr);
                const now = new Date();
                const currentDay = now.getDay();
                const currentHour = now.getHours();
                const currentMin = now.getMinutes();
                const currentTime = currentHour * 60 + currentMin;
                
                const [startH, startM] = bh.start.split(':').map(Number);
                const [endH, endM] = bh.end.split(':').map(Number);
                const startTime = startH * 60 + startM;
                const endTime = endH * 60 + endM;
                
                const isOpenToday = bh.days.includes(currentDay);
                const isOpenTime = currentTime >= startTime && currentTime <= endTime;
                
                if (!isOpenToday || !isOpenTime) {
                    const body = document.querySelector('body');
                    body.innerHTML = '<div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; background:var(--bg); color:var(--text); text-align:center; padding:20px;"><i class="fas fa-clock" style="font-size:64px; color:#ef4444; margin-bottom:20px;"></i><h1 style="font-family:var(--font-head); font-weight:800; font-size:28px;">ขออภัย อยู่นอกเวลาให้บริการ</h1><p style="color:var(--secondary); font-size:16px; margin-top:10px;">เวลาทำการ: ' + bh.start + ' - ' + bh.end + '</p></div>';
                    return;
                }
            }
        } catch(e) { console.error(e); }
    `;

    if (!html.includes('Check Business Hours')) {
        // Insert after the manual open/close check
        html = html.replace('// Check Store Open Status', businessHoursCheckLogic + '\n    // Check Store Open Status');
        fs.writeFileSync(file, html, 'utf8');
        console.log('Updated', file);
    }
};

updateLogic('index.html');
updateLogic('delivery.html');
