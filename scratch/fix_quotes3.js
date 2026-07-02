const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf8');

// Fix all the onclick handlers inside single-quoted JS strings
// The problem: 'onclick="switchReportTab('dashboard')"' - inner single quotes break outer
// Solution: use template literal approach - replace the affected concatenated string section entirely

// Fix switchReportTab('dashboard') -> use double quotes for JS string, escaped
html = html.replace(
    /'\<button class=\\"btn-outline\\" onclick=\\"switchReportTab\('dashboard'\)\\" id=\\"rtab-dashboard\\"/g,
    '"<button class=\\"btn-outline\\" onclick=\\"switchReportTab(\'dashboard\')\\" id=\\"rtab-dashboard\\"'
);
html = html.replace(
    /Dashboard<\/button>'\s*\+/g,
    'Dashboard</button>" +'
);

html = html.replace(
    /'\<button class=\\"btn-outline\\" onclick=\\"switchReportTab\('history'\)\\" id=\\"rtab-history\\"/g,
    '"<button class=\\"btn-outline\\" onclick=\\"switchReportTab(\'history\')\\" id=\\"rtab-history\\"'
);
html = html.replace(
    /Order History<\/button>'\s*\+/g,
    'Order History</button>" +'
);

// Fix renderReport('1d') etc
html = html.replace(
    /'\<button class=\\"btn-black rpt-btn\\" onclick=\\"renderReport\('1d'\)\\"/g,
    '"<button class=\\"btn-black rpt-btn\\" onclick=\\"renderReport(\'1d\')\\"'
);
html = html.replace(/1 Day<\/button>'\s*\+/g, '1 Day</button>" +');

html = html.replace(
    /'\<button class=\\"btn-black rpt-btn\\" onclick=\\"renderReport\('7d'\)\\"/g,
    '"<button class=\\"btn-black rpt-btn\\" onclick=\\"renderReport(\'7d\')\\"'
);
html = html.replace(/7 Days<\/button>'\s*\+/g, '7 Days</button>" +');

html = html.replace(
    /'\<button class=\\"btn-black rpt-btn\\" onclick=\\"renderReport\('30d'\)\\"/g,
    '"<button class=\\"btn-black rpt-btn\\" onclick=\\"renderReport(\'30d\')\\"'
);
html = html.replace(/30 Days<\/button>'\s*\+/g, '30 Days</button>" +');

html = html.replace(
    /'\<button class=\\"btn-black rpt-btn\\" onclick=\\"renderReport\('all'\)\\"/g,
    '"<button class=\\"btn-black rpt-btn\\" onclick=\\"renderReport(\'all\')\\"'
);
html = html.replace(/All<\/button>'\s*\+/g, 'All</button>" +');

fs.writeFileSync('admin.html', html, 'utf8');
console.log('Fixed JS string quoting.');
