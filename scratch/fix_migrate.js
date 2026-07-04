const fs = require('fs');
let html = fs.readFileSync('d:/withu/withU/admin.html', 'utf8');

const newMigrationCode = `window.migrateOldPoints = async function() {
    // Check both potential old keys
    var old1 = localStorage.getItem('withu_points_db'); // format: { phone: points }
    var old2 = localStorage.getItem('withu_points');    // format: [{phone, name, points}]
    
    if (!old1 && !old2) return;
    
    try {
        if(typeof showToast==='function') showToast('กำลังซิงค์ข้อมูลเก่าเข้า Firebase...', 'new');
        let promises = [];
        
        // Migrate old1 (withu_points_db)
        if (old1) {
            let db = JSON.parse(old1);
            for (let phone in db) {
                let updateUrl = FIREBASE_POINTS_URL.replace('.json', '/' + phone + '.json');
                promises.push(fetch(updateUrl, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: '-', points: db[phone]||0 })
                }));
            }
        }
        
        // Migrate old2 (withu_points)
        if (old2) {
            let arr = JSON.parse(old2);
            if (Array.isArray(arr)) {
                for(let m of arr) {
                    let updateUrl = FIREBASE_POINTS_URL.replace('.json', '/' + m.phone + '.json');
                    promises.push(fetch(updateUrl, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: m.name||'-', points: m.points||0 })
                    }));
                }
            }
        }
        
        if (promises.length > 0) {
            await Promise.all(promises);
        }
        
        // Prevent double sync
        localStorage.removeItem('withu_points_db');
        localStorage.removeItem('withu_points');
        
        if(typeof showToast==='function') showToast('กู้ข้อมูลเก่ากลับมาครบแล้ว!', 'success');
        
        // Let loadPoints handle the UI refresh next
    } catch(e) {
        console.error("Migration error:", e);
    }
};`;

html = html.replace(/window\.migrateOldPoints = async function\(\) \{[\s\S]*?\}\s*;/g, newMigrationCode);

fs.writeFileSync('d:/withu/withU/admin.html', html, 'utf8');
console.log('Fixed migration script to handle withu_points_db format');
