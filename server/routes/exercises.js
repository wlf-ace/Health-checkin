const express = require('express');
const router = express.Router();
const db = require('../db');

// 获取所有运动
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM exercises');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 添加运动
router.post('/', async (req, res) => {
  try {
    const { name, calories_per_hour } = req.body;
    await db.query(
      'INSERT INTO exercises (name, calories_per_hour) VALUES (?, ?)',
      [name, calories_per_hour]
    );
    res.json({ message: '运动添加成功' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 更新运动
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { name, calories_per_hour } = req.body;
    await db.query(
      'UPDATE exercises SET name=?, calories_per_hour=? WHERE id=?',
      [name, calories_per_hour, id]
    );
    res.json({ message: '运动更新成功' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 删除运动
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await db.query('DELETE FROM exercises WHERE id=?', [id]);
    res.json({ message: '运动删除成功' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 获取单个运动
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await db.query('SELECT * FROM exercises WHERE id=?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: '未找到该运动' });
    }
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
