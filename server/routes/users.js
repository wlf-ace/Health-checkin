const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // 使用环境变量

// 注册
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await db.query(
      'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
      [username, hashedPassword, email || null]
    );
    
    res.json({ message: '用户注册成功' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const [rows] = await db.query(
      'SELECT * FROM users WHERE username = ?', 
      [username]
    );
    
    if (!rows.length) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }
    
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    
    if (!match) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }
    
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ token, userId: user.id, username: user.username });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;