const fs = require('fs');
let html = fs.readFileSync('d:/withu/withU/admin.html', 'utf8');

// Inject logic to update sidebar report variables
const syncLogic = `
                const avg = data.orders && data.orders.length > 0 ? (data.orders.reduce((s,o) => s + getTimeDiff(o.time), 0) / data.orders.length).toFixed(1) : "0.0";
                safeText('avg-speed', avg + " MINS");
                
                // Update Sidebar Live Report
                safeText('sb-rep-avg', avg + " MINS");
`;

html = html.replace(/const avg = [^]+?safeText\('avg-speed', avg \+ " MINS"\);/, syncLogic);

const perfLogic = `
        function renderPerformance(report) {
            let total = 0; let count = 0;
            report.forEach(r => { total += r.total; count++; });
            safeText('rep-total', total.toLocaleString());
            safeText('rep-count', count);
            
            // Update Sidebar Live Report
            safeText('sb-rep-total', '฿' + total.toLocaleString());
            safeText('sb-rep-count', count);
`;

html = html.replace(/function renderPerformance\(report\) \{[\s\S]*?safeText\('rep-count', count\);/, perfLogic);

fs.writeFileSync('d:/withu/withU/admin.html', html, 'utf8');
console.log('Admin JS Mod Applied!');
