const express = require('express');
const router = express.Router();
const db = require('../db');

// 获取指定用户指定日期的打卡
router.get('/:userId/:date', async (req, res) => {
  try {
    const { userId, date } = req.params;
    const [rows] = await db.query(
      'SELECT * FROM checkins WHERE user_id=? AND date=?',
      [userId, date]
    );
    res.json(rows.length ? rows[0] : null);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 新增或更新当天打卡（upsert）
router.post('/', async (req, res) => {
  try {
    const { user_id, date, total_calories_in, total_calories_out } = req.body;

    // 先查询是否存在
    const [rows] = await db.query(
      'SELECT id FROM checkins WHERE user_id=? AND date=?',
      [user_id, date]
    );

    if (rows.length) {
      // 更新
      await db.query(
        'UPDATE checkins SET total_calories_in=?, total_calories_out=? WHERE id=?',
        [total_calories_in, total_calories_out, rows[0].id]
      );
      res.json({ message: '打卡更新成功' });
    } else {
      // 插入
      await db.query(
        'INSERT INTO checkins (user_id, date, total_calories_in, total_calories_out) VALUES (?, ?, ?, ?)',
        [user_id, date, total_calories_in, total_calories_out]
      );
      res.json({ message: '打卡新增成功' });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
