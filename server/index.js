require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const usersRoutes = require('./routes/users');
const foodsRoutes = require('./routes/foods');
const exercisesRoutes = require('./routes/exercises');
const checkinsRoutes = require('./routes/checkins');
const checkinFoodsRoutes = require('./routes/checkinFoods');
const checkinExercisesRoutes = require('./routes/checkinExercises');
const statisticsRoutes = require('./routes/statistics');
const aiChatRoutes = require('./routes/aiChat');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..')));

// 路由注册
app.use('/api/users', usersRoutes);
app.use('/api/foods', foodsRoutes);
app.use('/api/exercises', exercisesRoutes);
app.use('/api/checkins', checkinsRoutes);
app.use('/api/checkin-foods', checkinFoodsRoutes);
app.use('/api/checkin-exercises', checkinExercisesRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/ai-chat', aiChatRoutes);

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: '服务器运行正常' });
});

app.listen(PORT, () => {
  console.log(`后端服务器启动：http://localhost:${PORT}`);
});

process.on('uncaughtException', function (err) {
  console.error('捕获到未处理的异常：', err);
});
