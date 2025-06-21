const express = require('express');
const axios = require('axios');
const router = express.Router();

// 讯飞星火API配置
const API_URL = 'https://spark-api-open.xf-yun.com/v1/chat/completions';
const API_PASSWORD = ''; //填写你的AIpassword，
const MODEL = '4.0Ultra'; //作者用的版本是4.0ultra，官方赠送了100000token


const WELCOME_MSG = '您好，我是健康打卡AI助手星火，有任何关于饮食、运动、打卡或健康管理的问题，随时可以问我哦！';

// POST /api/ai-chat
router.post('/', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages参数缺失或格式错误' });
    }
   
    let userMsg = null;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        userMsg = messages[i];
        break;
      }
    }
    if (!userMsg) {
      return res.status(400).json({ error: '缺少用户输入' });
    }
    const payload = {
      model: MODEL,
      messages: [
        { role: 'system', content: '你是健康管理助手' },
        userMsg
      ],
      stream: false
    };
    console.log('实际请求payload:', JSON.stringify(payload, null, 2));
    const response = await axios.post(API_URL, payload, {
      headers: {
        'Authorization': `Bearer ${API_PASSWORD}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('讯飞返回原始数据:', JSON.stringify(response.data, null, 2));
    
    let aiMsg = 'AI无回复';
    if (response.data.choices && response.data.choices[0]) {
      const msgObj = response.data.choices[0].message;
      if (msgObj) {
        if (msgObj.content) {
          aiMsg = msgObj.content;
        } else if (typeof msgObj === 'string') {
          aiMsg = msgObj;
        } else {
          aiMsg = JSON.stringify(msgObj);
        }
      }
    } else if (response.data.data && response.data.data.result) {
      aiMsg = response.data.data.result;
    } else {
      aiMsg = JSON.stringify(response.data);
    }
    res.json({ reply: aiMsg });
  } catch (err) {
    console.error('AI chat error:', err.response?.data || err.message);
    res.status(500).json({ error: 'AI服务异常', detail: err.response?.data || err.message });
  }
});

// GET /api/ai-chat/welcome
router.get('/welcome', (req, res) => {
  res.json({ reply: WELCOME_MSG });
});

module.exports = router; 
