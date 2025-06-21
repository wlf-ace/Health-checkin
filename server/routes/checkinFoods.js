const express = require('express');
const router = express.Router();
const db = require('../db');

// 根据打卡id获取食物明细
router.get('/:checkinId', async (req, res) => {
  try {
    const { checkinId } = req.params;
    const [rows] = await db.query(
      `SELECT cf.*, f.name as food_name FROM checkin_foods cf 
       JOIN foods f ON cf.food_id = f.id
       WHERE cf.checkin_id=?`,
      [checkinId]
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 添加食物明细
router.post('/', async (req, res) => {
  try {
    const { checkin_id, food_id, amount, calories } = req.body;
    await db.query(
      'INSERT INTO checkin_foods (checkin_id, food_id, amount, calories) VALUES (?, ?, ?, ?)',
      [checkin_id, food_id, amount, calories]
    );
    res.json({ message: '食物明细添加成功' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 删除食物明细
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await db.query('DELETE FROM checkin_foods WHERE id=?', [id]);
    res.json({ message: '食物明细删除成功' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
