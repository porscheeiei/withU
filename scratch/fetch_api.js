const fs = require('fs');
const html = fs.readFileSync('d:/withu/withU/admin.html', 'utf8');
const match = html.match(/const API_URL\s*=\s*['"]([^'"]+)['"]/);
if(match) {
    const url = match[1] + '?action=getAdminData';
    console.log('Fetching', url);
    fetch(url).then(r=>r.text()).then(t => {
        try {
            const data = JSON.parse(t);
            console.log(Object.keys(data));
            if(data.analytics) console.log('analytics keys:', Object.keys(data.analytics));
            if(data.points) console.log('points:', typeof data.points, Array.isArray(data.points) ? data.points.length : 'not array');
            if(data.history) console.log('history:', typeof data.history, Array.isArray(data.history) ? data.history.length : 'not array');
        } catch(e) {
            console.log('Parse error', e.message);
            console.log(t.substring(0, 200));
        }
    });
} else {
    console.log('API_URL not found');
}
