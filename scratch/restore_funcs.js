const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf8');

const missingFuncs = `
        function safeStyle(id, prop, val) {
            const el = document.getElementById(id);
            if(el) el.style[prop] = val;
        }

        function showSec(n) {
            ['order-sec', 'takeaway-sec', 'stock-sec', 'report-sec', 'points-sec', 'settings-sec'].forEach(s => {
                safeStyle(s, 'display', 'none');
            });
            
            const targetEl = document.getElementById(n + '-sec');
            if (targetEl) {
                targetEl.style.display = (n === 'report' || n === 'settings' || n === 'points') ? 'block' : 'grid';
            }
            
            if (n === 'points') {
                if (typeof loadPoints === 'function') loadPoints();
            }
            if (n === 'settings') {
                if (typeof loadSettings === 'function') loadSettings();
            }
            if (n === 'report') {
                if (typeof switchReportTab === 'function') setTimeout(() => switchReportTab('dashboard'), 50);
            }
            
            document.querySelectorAll('.tab-btn').forEach(b => {
                if (b.id) b.classList.toggle('active', b.id === 't-' + n);
            });
            document.querySelectorAll('.sidebar-item').forEach(b => {
                if (b.id) b.classList.toggle('active', b.id === 'sb-' + n);
            });
        }
`;

if (!html.includes('function showSec(n)')) {
    html = html.replace('</script>\n</body>', missingFuncs + '\n    </script>\n</body>');
    fs.writeFileSync('admin.html', html, 'utf8');
    console.log('Restored showSec and safeStyle.');
} else {
    console.log('showSec already exists?');
}
