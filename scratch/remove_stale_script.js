const fs = require('fs');
let html = fs.readFileSync('d:/withu/withU/admin.html', 'utf8');

// The problem: script block at line 1290 contains `window.deletePoint = async function`
// but the `await confirm()` inside is parsed at top-level scope by new Function()
// Fix: convert that small script tag block to use the proper API (no await at top level)

// Remove the problematic small script block entirely (lines 1290-1323 approx)
// by replacing it with just a comment
const badBlock = `    <script>
        function loadPoints() {
            const db = JSON.parse(safeStorageGet('withu_points_db', '{}'));
            let html = '';
            for(let phone in db) {
                html += \`<tr><td>\${phone}</td><td style="font-size:18px; font-weight:800; color:var(--primary);">\${db[phone]}</td><td><button class="btn-outline" style="border-color:var(--danger); color:var(--danger); padding:6px 12px;" onclick="deletePoint('\${phone}')">ลบข้อมูล</button></td></tr>\`;
            }
            safeHtml('points-list-body', html || '<tr><td colspan="3" style="text-align:center; padding:30px; color:var(--text-muted);">ยังไม่มีข้อมูลสมาชิก</td></tr>');
        }
        function savePoint() {
            const phone = document.getElementById('point-phone-input').value.trim();
            const pts = parseInt(document.getElementById('point-val-input').value);
            if(!phone || isNaN(pts)) return alert("กรุณาใส่เบอร์โทรศัพท์และจำนวนแต้มให้ถูกต้อง");
            const db = JSON.parse(safeStorageGet('withu_points_db', '{}'));
            db[phone] = pts;
            safeStorageSet('withu_points_db', JSON.stringify(db));
            document.getElementById('point-phone-input').value = '';
            document.getElementById('point-val-input').value = '';
            loadPoints();
            alert("บันทึกข้อมูลสำเร็จ!");
        }
        window.deletePoint = async function(phone) {
            if(!await confirm('ต้องการลบข้อมูลของเบอร์ ' + phone + ' ใช่หรือไม่?')) return;
            if(typeof showToast==='function') showToast('กำลังลบข้อมูล...', 'new');
            const delUrl = FIREBASE_POINTS_URL.replace('.json', '/' + phone + '.json');
            try {
                await fetch(delUrl, { method: 'DELETE' });
                if(typeof showToast==='function') showToast('ลบสำเร็จ', 'success');
                window.loadPoints();
            } catch(e) {
                if(typeof showToast==='function') showToast('ลบล้มเหลว', 'error');
            }
        };
    </script>`;

const goodBlock = `    <script>
        const API_URL_dup = null; // removed old inline points functions - now handled by main script
    </script>`;

if(html.includes(badBlock)) {
    html = html.replace(badBlock, '<!-- old inline points script removed -->');
    console.log('Replaced bad block with comment');
} else {
    console.log('Could not find exact block - trying line-by-line approach');
    const lines = html.split('\n');
    let startLine = -1, endLine = -1;
    for(let i = 0; i < lines.length; i++) {
        if(lines[i].includes('<script>') && lines[i+1] && lines[i+1].includes('function loadPoints()')) {
            startLine = i;
        }
        if(startLine !== -1 && lines[i].includes('</script>') && i > startLine) {
            endLine = i;
            break;
        }
    }
    if(startLine !== -1 && endLine !== -1) {
        console.log('Found stale script at lines:', startLine+1, 'to', endLine+1);
        // Check if this is the small one with old loadPoints
        const blockContent = lines.slice(startLine, endLine+1).join('\n');
        if(blockContent.includes('function savePoint') && blockContent.includes('window.deletePoint')) {
            lines.splice(startLine, endLine - startLine + 1, '<!-- old inline points script removed -->');
            html = lines.join('\n');
            console.log('Removed stale script block');
        }
    }
}

fs.writeFileSync('d:/withu/withU/admin.html', html, 'utf8');
console.log('Done');
