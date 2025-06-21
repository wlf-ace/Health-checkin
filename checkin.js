// 每日打卡页面JavaScript
const API_BASE_URL = 'http://localhost:3000';

// 全局变量
let selectedFoods = [];
let selectedExercises = [];
let foodsList = [];
let exercisesList = [];

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    // 设置默认日期为今天
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('checkinDate').value = today;
    
    // 加载数据
    loadFoods();
    loadExercises();
    loadCheckinData();
});

// 加载食物列表
async function loadFoods() {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/foods`);
        foodsList = response.data;
        populateFoodSelect();
    } catch (error) {
        console.error('加载食物列表失败:', error);
        showError('加载食物列表失败');
    }
}

// 加载运动列表
async function loadExercises() {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/exercises`);
        exercisesList = response.data;
        populateExerciseSelect();
    } catch (error) {
        console.error('加载运动列表失败:', error);
        showError('加载运动列表失败');
    }
}

// 填充食物选择器
function populateFoodSelect() {
    const foodSelect = document.getElementById('foodSelect');
    foodSelect.innerHTML = '<option value="">选择食物...</option>';
    
    foodsList.forEach(food => {
        const option = document.createElement('option');
        option.value = food.id;
        option.textContent = `${food.name} (${food.calories} kcal/100g)`;
        foodSelect.appendChild(option);
    });
}

// 填充运动选择器
function populateExerciseSelect() {
    const exerciseSelect = document.getElementById('exerciseSelect');
    exerciseSelect.innerHTML = '<option value="">选择运动...</option>';
    
    exercisesList.forEach(exercise => {
        const option = document.createElement('option');
        option.value = exercise.id;
        option.textContent = `${exercise.name} (${exercise.calories_per_hour} kcal/小时)`;
        exerciseSelect.appendChild(option);
    });
}

// 添加食物项目
function addFoodItem() {
    const foodId = document.getElementById('foodSelect').value;
    const quantity = document.getElementById('foodQuantity').value;
    const unit = document.getElementById('foodUnit').value;
    
    if (!foodId || !quantity) {
        showError('请选择食物并输入数量');
        return;
    }
    
    const food = foodsList.find(f => f.id == foodId);
    if (!food) return;
    
    let realQuantity = parseInt(quantity);
    let calories = 0;
    if (unit === '克') {
        calories = food.calories * realQuantity / 100;
    } else {
        calories = food.calories * realQuantity;
    }
    
    const foodItem = {
        id: Date.now(),
        food_id: foodId,
        name: food.name,
        quantity: realQuantity,
        unit: unit,
        calories: calories
    };
    
    selectedFoods.push(foodItem);
    updateFoodList();
    updateSummary();
    
    // 清空输入
    document.getElementById('foodSelect').value = '';
    document.getElementById('foodQuantity').value = '';
}

// 添加运动项目
function addExerciseItem() {
    const exerciseId = document.getElementById('exerciseSelect').value;
    const duration = document.getElementById('exerciseDuration').value;
    
    if (!exerciseId || !duration) {
        showError('请选择运动并输入时长');
        return;
    }
    
    const exercise = exercisesList.find(e => e.id == exerciseId);
    if (!exercise) return;
    
    const calories = Math.round(exercise.calories_per_hour * duration / 60);
    
    const exerciseItem = {
        id: Date.now(),
        exercise_id: exerciseId,
        name: exercise.name,
        duration: parseInt(duration),
        calories: calories
    };
    
    selectedExercises.push(exerciseItem);
    updateExerciseList();
    updateSummary();
    
    // 清空输入
    document.getElementById('exerciseSelect').value = '';
    document.getElementById('exerciseDuration').value = '';
}

// 更新食物列表显示
function updateFoodList() {
    const foodList = document.getElementById('foodList');
    
    if (selectedFoods.length === 0) {
        foodList.innerHTML = '<p class="empty-text">暂无饮食记录</p>';
        return;
    }
    
    foodList.innerHTML = selectedFoods.map(item => `
        <div class="list-item">
            <div class="item-info">
                <div class="item-name">${item.name}</div>
                <div class="item-details">${item.quantity} ${item.unit}</div>
            </div>
            <div class="item-calories">+${item.calories} kcal</div>
            <button class="btn btn-sm btn-danger" onclick="removeFoodItem(${item.id})">
                🗑️
            </button>
        </div>
    `).join('');
}

// 更新运动列表显示
function updateExerciseList() {
    const exerciseList = document.getElementById('exerciseList');
    
    if (selectedExercises.length === 0) {
        exerciseList.innerHTML = '<p class="empty-text">暂无运动记录</p>';
        return;
    }
    
    exerciseList.innerHTML = selectedExercises.map(item => `
        <div class="list-item">
            <div class="item-info">
                <div class="item-name">${item.name}</div>
                <div class="item-details">${item.duration} 分钟</div>
            </div>
            <div class="item-calories">-${item.calories} kcal</div>
            <button class="btn btn-sm btn-danger" onclick="removeExerciseItem(${item.id})">
                🗑️
            </button>
        </div>
    `).join('');
}

// 移除食物项目
function removeFoodItem(id) {
    selectedFoods = selectedFoods.filter(item => item.id !== id);
    updateFoodList();
    updateSummary();
}

// 移除运动项目
function removeExerciseItem(id) {
    selectedExercises = selectedExercises.filter(item => item.id !== id);
    updateExerciseList();
    updateSummary();
}

// 更新汇总信息
function updateSummary() {
    const totalCaloriesIn = selectedFoods.reduce((sum, item) => sum + item.calories, 0);
    const totalCaloriesOut = selectedExercises.reduce((sum, item) => sum + item.calories, 0);
    const netCalories = totalCaloriesIn - totalCaloriesOut;
    
    document.getElementById('totalCaloriesIn').textContent = `${totalCaloriesIn} kcal`;
    document.getElementById('totalCaloriesOut').textContent = `${totalCaloriesOut} kcal`;
    document.getElementById('netCalories').textContent = `${netCalories} kcal`;
    
    // 根据净热量设置颜色
    const netElement = document.getElementById('netCalories');
    if (netCalories > 0) {
        netElement.style.color = '#f44336'; // 红色表示摄入过多
    } else if (netCalories < 0) {
        netElement.style.color = '#4CAF50'; // 绿色表示消耗更多
    } else {
        netElement.style.color = '#333'; // 默认颜色
    }
}

// 加载打卡数据
async function loadCheckinData() {
    const date = document.getElementById('checkinDate').value;
    if (!date) return;

    try {
        // 这里写死user_id=1
        const response = await axios.get(`${API_BASE_URL}/api/checkins/1/${date}`);
        const checkinData = response.data;

        if (checkinData) {
            // 只回显汇总
            selectedFoods = [];
            selectedExercises = [];
            updateFoodList();
            updateExerciseList();
            // 汇总
            document.getElementById('totalCaloriesIn').textContent = `${checkinData.total_calories_in} kcal`;
            document.getElementById('totalCaloriesOut').textContent = `${checkinData.total_calories_out} kcal`;
            document.getElementById('netCalories').textContent = `${checkinData.total_calories_in - checkinData.total_calories_out} kcal`;
        } else {
            // 清空
            selectedFoods = [];
            selectedExercises = [];
            updateFoodList();
            updateExerciseList();
            updateSummary();
        }
    } catch (error) {
        console.error('加载打卡数据失败:', error);
        selectedFoods = [];
        selectedExercises = [];
        updateFoodList();
        updateExerciseList();
        updateSummary();
    }
}

// 保存打卡
async function saveCheckin() {
    const date = document.getElementById('checkinDate').value;
    if (!date) {
        showError('请选择日期');
        return;
    }
    
    if (selectedFoods.length === 0 && selectedExercises.length === 0) {
        showError('请至少添加一条饮食或运动记录');
        return;
    }
    
    // 计算总热量
    const total_calories_in = selectedFoods.reduce((sum, item) => sum + item.calories, 0);
    const total_calories_out = selectedExercises.reduce((sum, item) => sum + item.calories, 0);

    const checkinData = {
        user_id: 1, // 默认用户
        date: date,
        total_calories_in,
        total_calories_out
    };
    
    try {
        await axios.post(`${API_BASE_URL}/api/checkins`, checkinData);
        showSuccess('打卡保存成功！');
    } catch (error) {
        console.error('保存打卡失败:', error);
        showError('保存打卡失败，请重试');
    }
}

// 重置表单
function resetForm() {
    if (confirm('确定要重置所有数据吗？')) {
        selectedFoods = [];
        selectedExercises = [];
        updateFoodList();
        updateExerciseList();
        updateSummary();
        
        // 清空输入框
        document.getElementById('foodSelect').value = '';
        document.getElementById('foodQuantity').value = '';
        document.getElementById('exerciseSelect').value = '';
        document.getElementById('exerciseDuration').value = '';
    }
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