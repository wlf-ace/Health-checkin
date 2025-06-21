const express = require('express');
const router = express.Router();
const db = require('../db');

// 获取所有食物
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM foods');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 添加食物
router.post('/', async (req, res) => {
  try {
    const { name, calories, protein, carbs, fat } = req.body;
    await db.query(
      'INSERT INTO foods (name, calories, protein, carbs, fat) VALUES (?, ?, ?, ?, ?)',
      [name, calories, protein, carbs, fat]
    );
    res.json({ message: '食物添加成功' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 更新食物
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { name, calories, protein, carbs, fat } = req.body;
    await db.query(
      'UPDATE foods SET name=?, calories=?, protein=?, carbs=?, fat=? WHERE id=?',
      [name, calories, protein, carbs, fat, id]
    );
    res.json({ message: '食物更新成功' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 删除食物
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await db.query('DELETE FROM foods WHERE id=?', [id]);
    res.json({ message: '食物删除成功' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
