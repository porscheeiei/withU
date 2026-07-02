const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf8');

// 1. Re-position date to be immediately after WITHU ADMIN
const currentLogoHtml = `<div class="logo">WITHU ADMIN</div>
        <span id="date-now" style="background:rgba(100,116,139,0.08); padding:5px 10px; border-radius:8px; color:#64748b; font-weight:700; border:1px solid rgba(100,116,139,0.1);"></span>`;
        
const newLogoHtml = `<div class="logo" style="display:flex; align-items:center; gap:10px;">WITHU ADMIN <span id="date-now" style="font-size:12px; color:#3b82f6; font-weight:800; background:rgba(59,130,246,0.1); padding:4px 8px; border-radius:6px; letter-spacing:0.5px;"></span></div>`;

if (html.includes(currentLogoHtml)) {
    html = html.replace(currentLogoHtml, newLogoHtml);
} else {
    // Try regex
    const logoRegex = /<div class="logo">WITHU ADMIN<\/div>\s*<span id="date-now"[^>]*><\/span>/;
    html = html.replace(logoRegex, newLogoHtml);
}

// 2. Export fullData to window
html = html.replace(/fullData = data;/g, 'fullData = data; window.fullData = data;');

// 3. Update renderPerformance to just call renderReport
const oldRenderPerf = `function renderPerformance(report) {
            safeText('report-date-text', "PERFORMANCE DATA OVERVIEW - " + new Date().toLocaleDateString('en-GB', {dateStyle:'full'}).toUpperCase());`;
            
const newRenderPerf = `function renderPerformance(report) {
            if (window.renderReport) { window.renderReport('1d'); }
            safeText('report-date-text', "PERFORMANCE DATA OVERVIEW - " + new Date().toLocaleDateString('en-GB', {dateStyle:'full'}).toUpperCase());`;

if (html.includes(oldRenderPerf)) {
    html = html.replace(oldRenderPerf, newRenderPerf);
}

fs.writeFileSync('admin.html', html, 'utf8');
console.log('UI Fixes 4 applied.');
