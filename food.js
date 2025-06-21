// 食物管理页面JavaScript
const API_BASE_URL = 'http://localhost:3000';

// 页面加载时获取食物列表
document.addEventListener('DOMContentLoaded', function() {
    loadFoods();
});

// 加载食物列表
async function loadFoods() {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/foods`);
        const foods = response.data;
        displayFoods(foods);
    } catch (error) {
        console.error('加载食物列表失败:', error);
        showError('加载食物列表失败，请检查网络连接');
    }
}

// 显示食物列表
function displayFoods(foods) {
    const tableBody = document.getElementById('foodTableBody');
    
    if (foods.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    <h3>暂无食物数据</h3>
                    <p>点击"添加食物"按钮开始添加您的第一个食物</p>
                    <button class="btn btn-primary" onclick="showAddFoodModal()">
                        ➕ 添加食物
                    </button>
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = foods.map(food => `
        <tr>
            <td>${food.name}</td>
            <td>${food.calories}</td>
            <td>${food.protein}</td>
            <td>${food.carbs}</td>
            <td>${food.fat}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editFood(${food.id})">
                    ✏️ 编辑
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteFood(${food.id})">
                    🗑️ 删除
                </button>
            </td>
        </tr>
    `).join('');
}

// 搜索食物
function searchFoods() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#foodTableBody tr');
    
    rows.forEach(row => {
        const foodName = row.cells[0]?.textContent.toLowerCase() || '';
        if (foodName.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// 显示添加食物模态框
function showAddFoodModal() {
    document.getElementById('modalTitle').textContent = '添加食物';
    document.getElementById('foodForm').reset();
    document.getElementById('foodId').value = '';
    document.getElementById('foodModal').style.display = 'block';
}

// 编辑食物
async function editFood(foodId) {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/foods/${foodId}`);
        const food = response.data;
        
        document.getElementById('modalTitle').textContent = '编辑食物';
        document.getElementById('foodId').value = food.id;
        document.getElementById('foodName').value = food.name;
        document.getElementById('foodCalories').value = food.calories;
        document.getElementById('foodProtein').value = food.protein;
        document.getElementById('foodCarbs').value = food.carbs;
        document.getElementById('foodFat').value = food.fat;
        
        document.getElementById('foodModal').style.display = 'block';
    } catch (error) {
        console.error('获取食物信息失败:', error);
        showError('获取食物信息失败');
    }
}

// 删除食物
async function deleteFood(foodId) {
    if (!confirm('确定要删除这个食物吗？此操作不可撤销。')) {
        return;
    }
    
    try {
        await axios.delete(`${API_BASE_URL}/api/foods/${foodId}`);
        showSuccess('食物删除成功');
        loadFoods();
    } catch (error) {
        console.error('删除食物失败:', error);
        showError('删除食物失败');
    }
}

// 关闭模态框
function closeModal() {
    document.getElementById('foodModal').style.display = 'none';
}

// 表单提交处理
document.getElementById('foodForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const foodId = document.getElementById('foodId').value;
    const foodData = {
        name: document.getElementById('foodName').value,
        calories: parseInt(document.getElementById('foodCalories').value),
        protein: parseFloat(document.getElementById('foodProtein').value),
        carbs: parseFloat(document.getElementById('foodCarbs').value),
        fat: parseFloat(document.getElementById('foodFat').value)
    };
    
    try {
        if (foodId) {
            // 编辑食物
            await axios.put(`${API_BASE_URL}/api/foods/${foodId}`, foodData);
            showSuccess('食物更新成功');
        } else {
            // 添加食物
            await axios.post(`${API_BASE_URL}/api/foods`, foodData);
            showSuccess('食物添加成功');
        }
        
        closeModal();
        loadFoods();
    } catch (error) {
        console.error('保存食物失败:', error);
        showError('保存食物失败，请检查输入信息');
    }
});

// 点击模态框外部关闭
window.onclick = function(event) {
    const modal = document.getElementById('foodModal');
    if (event.target === modal) {
        closeModal();
    }
}

// 显示成功消息
function showSuccess(message) {
    // 创建临时提示
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
    // 创建临时提示
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