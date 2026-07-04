const fs = require('fs');
let html = fs.readFileSync('d:/withu/withU/admin.html', 'utf8');

const migrationCode = `
// ==========================================
// MIGRATE OLD POINTS FROM LOCALSTORAGE TO FIREBASE
// ==========================================
window.migrateOldPoints = async function() {
    var old = localStorage.getItem('withu_points');
    if (!old) return;
    try {
        var arr = JSON.parse(old);
        if (arr && arr.length > 0) {
            if(typeof showToast==='function') showToast('กำลังซิงค์ข้อมูลเก่าเข้า Firebase...', 'new');
            let promises = arr.map(m => {
                let updateUrl = FIREBASE_POINTS_URL.replace('.json', '/' + m.phone + '.json');
                return fetch(updateUrl, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: m.name||'-', points: m.points||0 })
                });
            });
            await Promise.all(promises);
            localStorage.removeItem('withu_points'); // Prevent double sync
            if(typeof showToast==='function') showToast('กู้ข้อมูลเก่ากลับมาครบแล้ว!', 'success');
            window.loadPoints(); // Refresh UI
        }
    } catch(e) {
        console.error("Migration error:", e);
    }
};
`;

// Insert the migration code above loadPoints
html = html.replace('window.loadPoints = async function() {', migrationCode + '\nwindow.loadPoints = async function() {\n    window.migrateOldPoints(); // Auto-sync old data on load\n');

fs.writeFileSync('d:/withu/withU/admin.html', html, 'utf8');
console.log('Migration logic added to admin.html');
