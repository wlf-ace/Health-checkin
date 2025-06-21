const express = require('express');
const router = express.Router();
const db = require('../db');

// 汇总统计接口
router.get('/', async (req, res) => {
  try {
    const userId = parseInt(req.query.user_id, 10) || 1; // 支持动态user_id，默认1
    const { start_date, end_date } = req.query;
    if (!start_date || !end_date) {
      return res.status(400).json({ error: '缺少日期参数' });
    }

    // 1. 打卡天数、总摄入、总消耗
    const [summaryRows] = await db.query(
      `SELECT COUNT(*) AS checkin_days, 
              SUM(total_calories_in) AS total_calories_in, 
              SUM(total_calories_out) AS total_calories_out
         FROM checkins
        WHERE user_id=? AND date BETWEEN ? AND ?`,
      [userId, start_date, end_date]
    );
    const summary = summaryRows[0] || {};

    // 2. 每日趋势
    const [trendRows] = await db.query(
      `SELECT date, total_calories_in AS calories_in, total_calories_out AS calories_out
         FROM checkins
        WHERE user_id=? AND date BETWEEN ? AND ?
        ORDER BY date ASC`,
      [userId, start_date, end_date]
    );

    // 3. 食物热量分布
    const [foodRows] = await db.query(
      `SELECT f.name, SUM(cf.calories) AS total_calories
         FROM checkins c
         JOIN checkin_foods cf ON c.id = cf.checkin_id
         JOIN foods f ON cf.food_id = f.id
        WHERE c.user_id=? AND c.date BETWEEN ? AND ?
        GROUP BY f.id, f.name
        ORDER BY total_calories DESC`,
      [userId, start_date, end_date]
    );
    // 强制转为数字
    foodRows.forEach(row => row.total_calories = Number(row.total_calories));

    // 4. 运动热量分布
    const [exerciseRows] = await db.query(
      `SELECT e.name, SUM(ce.calories_burn) AS total_calories
         FROM checkins c
         JOIN checkin_exercises ce ON c.id = ce.checkin_id
         JOIN exercises e ON ce.exercise_id = e.id
        WHERE c.user_id=? AND c.date BETWEEN ? AND ?
        GROUP BY e.id, e.name
        ORDER BY total_calories DESC`,
      [userId, start_date, end_date]
    );
    // 强制转为数字
    exerciseRows.forEach(row => row.total_calories = Number(row.total_calories));

    // 5. 详细打卡记录
    const [recordRows] = await db.query(
      `SELECT c.date, c.total_calories_in, c.total_calories_out,
              (SELECT COUNT(*) FROM checkin_foods cf WHERE cf.checkin_id = c.id) AS food_count,
              (SELECT COUNT(*) FROM checkin_exercises ce WHERE ce.checkin_id = c.id) AS exercise_count
         FROM checkins c
        WHERE c.user_id=? AND c.date BETWEEN ? AND ?
        ORDER BY c.date DESC`,
      [userId, start_date, end_date]
    );

    res.json({
      checkin_days: summary.checkin_days || 0,
      total_calories_in: summary.total_calories_in || 0,
      total_calories_out: summary.total_calories_out || 0,
      calories_trend: trendRows,
      food_distribution: foodRows,
      exercise_distribution: exerciseRows,
      records: recordRows
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router; 