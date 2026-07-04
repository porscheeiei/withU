const fs = require('fs');
let html = fs.readFileSync('d:/withu/withU/admin.html', 'utf8');

html = html.replace('https://your-project-id.firebaseio.com/points.json', 'https://withu-da97c-default-rtdb.asia-southeast1.firebasedatabase.app/points.json');
html = html.replace('FIREBASE_POINTS_URL.includes(\'your-project-id\')', 'false'); // Remove the check that displays the error

fs.writeFileSync('d:/withu/withU/admin.html', html, 'utf8');
console.log('Firebase URL updated in admin.html');
