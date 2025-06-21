// 汇总统计页面JavaScript
const API_BASE_URL = 'http://localhost:3000';

// 图表实例
let caloriesChart = null;

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    // 设置默认日期范围（最近30天）
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    document.getElementById('endDate').value = endDate.toISOString().split('T')[0];
    document.getElementById('startDate').value = startDate.toISOString().split('T')[0];
    
    // 加载统计数据
    updateStatistics();
});

// 更新统计数据，使用a'xios发起get请求来获取统计数据
async function updateStatistics() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    if (!startDate || !endDate) {
        showError('请选择开始和结束日期');
        return;
    }
    
    if (new Date(startDate) > new Date(endDate)) {
        showError('开始日期不能晚于结束日期');
        return;
    }
    
    try {
        // 获取统计数据
        const response = await axios.get(`${API_BASE_URL}/api/statistics?start_date=${startDate}&end_date=${endDate}`);
        const data = response.data;
        
        // 更新统计卡片
        updateStatCards(data);
        
        // 更新图表
        updateCharts(data);
        
        // 更新详细记录表格
        updateRecordsTable(data.records || []);
        
    } catch (error) {
        console.error('获取统计数据失败:', error);
        showError('获取统计数据失败，请检查网络连接');
    }
}

// 更新统计卡片
function updateStatCards(data) {
    document.getElementById('checkinDays').textContent = data.checkin_days || 0;
    document.getElementById('totalCaloriesIn').textContent = `${data.total_calories_in || 0} kcal`;
    document.getElementById('totalCaloriesOut').textContent = `${data.total_calories_out || 0} kcal`;
    
    const netCalories = (data.total_calories_in || 0) - (data.total_calories_out || 0);
    document.getElementById('netCalories').textContent = `${netCalories} kcal`;
    
    // 根据净热量设置颜色
    const netElement = document.getElementById('netCalories');
    if (netCalories > 0) {
        netElement.style.color = '#f44336';
    } else if (netCalories < 0) {
        netElement.style.color = '#4CAF50';
    } else {
        netElement.style.color = '#333';
    }
}

// 更新图表
function updateCharts(data) {
    updateCaloriesChart(data.calories_trend || []);
}

// 更新热量趋势图
function updateCaloriesChart(trendData) {
    const ctx = document.getElementById('caloriesChart').getContext('2d');
    
    if (caloriesChart) {
        caloriesChart.destroy();
    }
    
    const labels = trendData.map(item => item.date);
    const caloriesIn = trendData.map(item => item.calories_in);
    const caloriesOut = trendData.map(item => item.calories_out);
    
    caloriesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: '摄入热量',
                    data: caloriesIn,
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: '消耗热量',
                    data: caloriesOut,
                    borderColor: '#2196F3',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: '每日热量趋势'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '热量 (kcal)'
                    }
                }
            }
        }
    });
}

// 更新详细记录表格
function updateRecordsTable(records) {
    const tableBody = document.getElementById('recordsTableBody');
    
    if (records.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    <h3>暂无记录数据</h3>
                    <p>在选定时间范围内没有找到打卡记录</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = records.map(record => {
        const caloriesIn = Number(record.total_calories_in) || 0;
        const caloriesOut = Number(record.total_calories_out) || 0;
        const netCalories = caloriesIn - caloriesOut;
        const netColor = netCalories > 0 ? '#f44336' : netCalories < 0 ? '#4CAF50' : '#333';
        return `
            <tr>
                <td>${formatDate(record.date)}</td>
                <td>${caloriesIn} kcal</td>
                <td>${caloriesOut} kcal</td>
                <td style="color: ${netColor}; font-weight: bold;">${netCalories} kcal</td>
                <td>${record.food_count || 0}</td>
                <td>${record.exercise_count || 0}</td>
            </tr>
        `;
    }).join('');
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

// 显示成功消息
function showSuccess(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10001;
        animation: slideInRight 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// 显示错误消息
function showError(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f44336;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10001;
        animation: slideInRight 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style); 