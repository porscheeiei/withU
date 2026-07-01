const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf8');

const pointsSecMatch = html.match(/<div id="points-sec"[^>]*>([\s\S]*?)<div id="report-sec"/);
if (pointsSecMatch) {
    console.log(pointsSecMatch[1].trim());
} else {
    console.log('points-sec not found or match failed');
}

console.log('\n--- Points Logic ---');
const pointsLogicMatch = html.match(/function loadPoints\(\)\s*\{([\s\S]*?)\}/);
if (pointsLogicMatch) {
    console.log(pointsLogicMatch[0]);
}

const updatePointsLogicMatch = html.match(/function updatePoint\([^)]*\)\s*\{([\s\S]*?)\}/);
if (updatePointsLogicMatch) {
    console.log(updatePointsLogicMatch[0]);
}
