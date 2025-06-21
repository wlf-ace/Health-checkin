// 运动管理页面JavaScript
const API_BASE_URL = 'http://localhost:3000';

// 页面加载时获取运动列表
document.addEventListener('DOMContentLoaded', function() {
    loadExercises();
});

// 加载运动列表
async function loadExercises() {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/exercises`);
        const exercises = response.data;
        displayExercises(exercises);
    } catch (error) {
        console.error('加载运动列表失败:', error);
        showError('加载运动列表失败，请检查网络连接');
    }
}

// 显示运动列表
function displayExercises(exercises) {
    const tableBody = document.getElementById('exerciseTableBody');
    
    if (exercises.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="3" class="empty-state">
                    <h3>暂无运动数据</h3>
                    <p>点击"添加运动"按钮开始添加您的第一个运动</p>
                    <button class="btn btn-primary" onclick="showAddExerciseModal()">
                        ➕ 添加运动
                    </button>
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = exercises.map(exercise => `
        <tr>
            <td>${exercise.name}</td>
            <td>${exercise.calories_per_hour}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editExercise(${exercise.id})">
                    ✏️ 编辑
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteExercise(${exercise.id})">
                    🗑️ 删除
                </button>
            </td>
        </tr>
    `).join('');
}

// 搜索运动
function searchExercises() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#exerciseTableBody tr');
    
    rows.forEach(row => {
        const exerciseName = row.cells[0]?.textContent.toLowerCase() || '';
        if (exerciseName.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// 显示添加运动模态框
function showAddExerciseModal() {
    document.getElementById('modalTitle').textContent = '添加运动';
    document.getElementById('exerciseForm').reset();
    document.getElementById('exerciseId').value = '';
    document.getElementById('exerciseModal').style.display = 'block';
}

// 编辑运动
async function editExercise(exerciseId) {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/exercises/${exerciseId}`);
        const exercise = response.data;
        
        document.getElementById('modalTitle').textContent = '编辑运动';
        document.getElementById('exerciseId').value = exercise.id;
        document.getElementById('exerciseName').value = exercise.name;
        document.getElementById('exerciseCalories').value = exercise.calories_per_hour;
        
        document.getElementById('exerciseModal').style.display = 'block';
    } catch (error) {
        console.error('获取运动信息失败:', error);
        showError('获取运动信息失败');
    }
}

// 删除运动
async function deleteExercise(exerciseId) {
    if (!confirm('确定要删除这个运动吗？此操作不可撤销。')) {
        return;
    }
    
    try {
        await axios.delete(`${API_BASE_URL}/api/exercises/${exerciseId}`);
        showSuccess('运动删除成功');
        loadExercises();
    } catch (error) {
        console.error('删除运动失败:', error);
        showError('删除运动失败');
    }
}

// 关闭模态框
function closeModal() {
    document.getElementById('exerciseModal').style.display = 'none';
}

// 表单提交处理
document.getElementById('exerciseForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const exerciseId = document.getElementById('exerciseId').value;
    const exerciseData = {
        name: document.getElementById('exerciseName').value,
        calories_per_hour: parseInt(document.getElementById('exerciseCalories').value)
    };
    
    try {
        if (exerciseId) {
            // 编辑运动
            await axios.put(`${API_BASE_URL}/api/exercises/${exerciseId}`, exerciseData);
            showSuccess('运动更新成功');
        } else {
            // 添加运动
            await axios.post(`${API_BASE_URL}/api/exercises`, exerciseData);
            showSuccess('运动添加成功');
        }
        
        closeModal();
        loadExercises();
    } catch (error) {
        console.error('保存运动失败:', error);
        showError('保存运动失败，请检查输入信息');
    }
});

// 点击模态框外部关闭
window.onclick = function(event) {
    const modal = document.getElementById('exerciseModal');
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
        background: #2196F3;
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