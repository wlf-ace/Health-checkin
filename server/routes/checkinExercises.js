const express = require('express');
const router = express.Router();
const db = require('../db');

// 根据打卡id获取运动明细
router.get('/:checkinId', async (req, res) => {
  try {
    const { checkinId } = req.params;
    const [rows] = await db.query(
      `SELECT ce.*, e.name as exercise_name FROM checkin_exercises ce 
       JOIN exercises e ON ce.exercise_id = e.id
       WHERE ce.checkin_id=?`,
      [checkinId]
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 添加运动明细
router.post('/', async (req, res) => {
  try {
    const { checkin_id, exercise_id, duration_min, calories_burn } = req.body;
    await db.query(
      'INSERT INTO checkin_exercises (checkin_id, exercise_id, duration_min, calories_burn) VALUES (?, ?, ?, ?)',
      [checkin_id, exercise_id, duration_min, calories_burn]
    );
    res.json({ message: '运动明细添加成功' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 删除运动明细
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await db.query('DELETE FROM checkin_exercises WHERE id=?', [id]);
    res.json({ message: '运动明细删除成功' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
