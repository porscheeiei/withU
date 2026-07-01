const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf8');

const newReportSec = `
    <div id="report-sec" style="display:none; padding:20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="font-size: 24px; font-weight: 800;"><i class="fas fa-chart-bar"></i> รายงานยอดขายและประวัติ</h2>
            <div style="display: flex; gap: 10px;">
                <button class="btn-outline" onclick="switchReportTab('dashboard')" id="rtab-dashboard" style="border-color: #3b82f6; color: #3b82f6; background: rgba(59,130,246,0.1);"><i class="fas fa-chart-pie"></i> ภาพรวม (Dashboard)</button>
                <button class="btn-outline" onclick="switchReportTab('history')" id="rtab-history"><i class="fas fa-history"></i> ประวัติการขาย (History)</button>
            </div>
        </div>

        <div id="report-dashboard">
            <div style="display: flex; gap: 10px; margin-bottom: 20px; overflow-x: auto; padding-bottom: 5px;">
                <button class="btn-black" onclick="renderReport('1d')" style="flex: 1; min-width: 80px; background: #3b82f6;">1 วัน</button>
                <button class="btn-black" onclick="renderReport('7d')" style="flex: 1; min-width: 80px; background: var(--text-main);">7 วัน</button>
                <button class="btn-black" onclick="renderReport('30d')" style="flex: 1; min-width: 80px; background: var(--text-main);">1 เดือน</button>
                <button class="btn-black" onclick="renderReport('all')" style="flex: 1; min-width: 80px; background: var(--text-main);">ทั้งหมด</button>
            </div>

            <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
                <div class="ai-card">
                    <p style="font-size: 12px; color: var(--text-muted); font-weight: 700;">ยอดขายรวม</p>
                    <p style="font-size: 24px; font-weight: 800; color: #3b82f6;">฿<span id="rep-total">0</span></p>
                </div>
                <div class="ai-card">
                    <p style="font-size: 12px; color: var(--text-muted); font-weight: 700;">จำนวนออเดอร์</p>
                    <p style="font-size: 24px; font-weight: 800;" id="rep-count">0</p>
                </div>
                <div class="ai-card">
                    <p style="font-size: 12px; color: var(--text-muted); font-weight: 700;">เมนูขายดีที่สุด</p>
                    <p style="font-size: 16px; font-weight: 800; margin-top: 5px;" id="rep-top-menu">-</p>
                </div>
            </div>

            <div class="ai-card" style="width: 100%; overflow-x: auto;">
                <h3 style="font-size: 14px; margin-bottom: 15px;"><i class="fas fa-chart-line"></i> กราฟยอดขาย</h3>
                <div style="min-width: 600px; height: 300px;">
                    <canvas id="salesChart"></canvas>
                </div>
            </div>
        </div>

        <div id="report-history" style="display: none;">
            <div class="ai-card" style="padding: 0;">
                <div style="overflow-x: auto;">
                    <table class="report-table" style="min-width: 800px; width: 100%;">
                        <thead>
                            <tr>
                                <th>เวลา</th>
                                <th>รหัสออเดอร์</th>
                                <th>โต๊ะ/ช่องทาง</th>
                                <th>ยอดรวม</th>
                                <th>การชำระเงิน</th>
                                <th>จัดการ</th>
                            </tr>
                        </thead>
                        <tbody id="history-list">
                            <!-- Populated by JS -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
`;

// Extract old report-sec and replace
const secRegex = /<div id="report-sec"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/;
html = html.replace(secRegex, newReportSec + '\n    ');

// Inject Report JS Logic
const newReportLogic = `
        let salesChartInstance = null;

        function switchReportTab(tab) {
            document.getElementById('report-dashboard').style.display = tab === 'dashboard' ? 'block' : 'none';
            document.getElementById('report-history').style.display = tab === 'history' ? 'block' : 'none';
            
            document.getElementById('rtab-dashboard').style.cssText = tab === 'dashboard' ? 'border-color: #3b82f6; color: #3b82f6; background: rgba(59,130,246,0.1);' : 'border-color: var(--border); color: var(--text-main); background: transparent;';
            document.getElementById('rtab-history').style.cssText = tab === 'history' ? 'border-color: #3b82f6; color: #3b82f6; background: rgba(59,130,246,0.1);' : 'border-color: var(--border); color: var(--text-main); background: transparent;';
            
            if (tab === 'dashboard') {
                renderReport('1d'); // Default to 1D
            } else {
                renderHistory();
            }
        }

        // Helper to get orders (assuming old logic saves to withu_completed_orders or similar, if not we filter withu_orders)
        function getCompletedOrders() {
            // Need to fetch from the backend or local storage depending on how the app handles completed orders.
            // Assuming they are pushed to an array 'completedOrders' or stored in 'withu_completed_orders'
            const dataStr = localStorage.getItem('withu_completed_orders') || '[]';
            try { return JSON.parse(dataStr); } catch(e) { return []; }
        }

        function filterOrdersByDate(orders, period) {
            const now = new Date();
            const filtered = orders.filter(o => {
                if (!o.timestamp) return false;
                const oDate = new Date(o.timestamp);
                const diffTime = Math.abs(now - oDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                if (period === '1d') return diffDays <= 1 && oDate.getDate() === now.getDate();
                if (period === '7d') return diffDays <= 7;
                if (period === '30d') return diffDays <= 30;
                return true; // 'all'
            });
            return filtered;
        }

        function renderReport(period) {
            // Update buttons UI
            const btns = document.getElementById('report-dashboard').querySelectorAll('.btn-black');
            const pMap = {'1d': 0, '7d': 1, '30d': 2, 'all': 3};
            btns.forEach((b, i) => {
                b.style.background = i === pMap[period] ? '#3b82f6' : 'var(--text-main)';
            });

            const orders = getCompletedOrders();
            const fOrders = filterOrdersByDate(orders, period);
            
            let totalSales = 0;
            const itemCounts = {};
            const chartLabels = [];
            const chartData = [];
            
            // Group by date for chart (simple logic)
            const salesByDate = {};

            fOrders.forEach(o => {
                totalSales += (o.total || o.finalTotal || 0);
                if (o.cart) {
                    o.cart.forEach(item => {
                        itemCounts[item.name] = (itemCounts[item.name] || 0) + (item.qty || 1);
                    });
                }
                const dateKey = new Date(o.timestamp).toLocaleDateString('th-TH');
                salesByDate[dateKey] = (salesByDate[dateKey] || 0) + (o.total || o.finalTotal || 0);
            });

            document.getElementById('rep-total').innerText = totalSales.toLocaleString();
            document.getElementById('rep-count').innerText = fOrders.length;
            
            const topItem = Object.entries(itemCounts).sort((a, b) => b[1] - a[1])[0];
            document.getElementById('rep-top-menu').innerText = topItem ? \`\${topItem[0]} (\${topItem[1]})\` : '-';

            // Draw Chart
            Object.keys(salesByDate).forEach(k => {
                chartLabels.push(k);
                chartData.push(salesByDate[k]);
            });

            const ctx = document.getElementById('salesChart');
            if (salesChartInstance) salesChartInstance.destroy();
            
            if (window.Chart) {
                salesChartInstance = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: chartLabels.length ? chartLabels : ['-'],
                        datasets: [{
                            label: 'ยอดขาย (บาท)',
                            data: chartData.length ? chartData : [0],
                            borderColor: '#3b82f6',
                            backgroundColor: 'rgba(59,130,246,0.2)',
                            borderWidth: 2,
                            fill: true,
                            tension: 0.4
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false }
                });
            }
        }

        function renderHistory() {
            const orders = getCompletedOrders().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            const list = document.getElementById('history-list');
            list.innerHTML = '';
            
            if(orders.length === 0) {
                list.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:20px;">ไม่มีข้อมูลประวัติการขาย</td></tr>';
                return;
            }

            orders.forEach((o, i) => {
                const date = new Date(o.timestamp).toLocaleString('th-TH');
                list.innerHTML += \`
                    <tr>
                        <td style="font-size: 12px; color: var(--text-muted);">\${date}</td>
                        <td style="font-weight: 700;">#\${o.id || o.orderNo || (1000+i)}</td>
                        <td>\${o.table || 'Takeaway'}</td>
                        <td style="color: #10b981; font-weight: 800;">฿\${(o.total || o.finalTotal || 0).toLocaleString()}</td>
                        <td>\${o.paymentMethod === 'qr' ? 'PROMPTPAY' : 'CASH'}</td>
                        <td>
                            <button class="btn-outline" onclick="viewHistoryDetail('\${o.id || i}')" style="padding: 5px 10px;"><i class="fas fa-eye"></i></button>
                        </td>
                    </tr>
                \`;
            });
        }
        
        function viewHistoryDetail(id) {
            // Placeholder for viewing detail
            if (typeof showToast === 'function') showToast('ฟีเจอร์ดูรายละเอียดออเดอร์ย้อนหลังกำลังมาเร็วๆ นี้', 'new');
        }
`;

if (!html.includes('function switchReportTab')) {
    html = html.replace('function showSec(n) {', newReportLogic + '\n        function showSec(n) {');
    // Call switchReportTab on report section show
    html = html.replace("if (n === 'report') setTimeout(drawChart, 150);", "if (n === 'report') setTimeout(() => switchReportTab('dashboard'), 50);");
}

fs.writeFileSync('admin.html', html, 'utf8');
console.log('Updated Report and History System');
