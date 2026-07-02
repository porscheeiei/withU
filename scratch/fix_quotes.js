const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf8');

// Fix the quote escaping issue in onclick handlers within JS string concatenation
html = html.replace(
    `onclick="switchReportTab('dashboard')"`,
    `onclick="switchReportTab(&quot;dashboard&quot;)"`
);
html = html.replace(
    `onclick="switchReportTab('history')"`,
    `onclick="switchReportTab(&quot;history&quot;)"`
);

// Fix extra closing div imbalance - find the stray one
// The issue is likely from removing the op-bar which had nested divs
// Let's check if there's an extra </div> near where op-bar was

fs.writeFileSync('admin.html', html, 'utf8');
console.log('Quote fix applied.');
