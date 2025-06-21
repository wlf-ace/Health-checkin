# 健康打卡应用

一个基于 Node.js + Express + MySQL 的健康打卡应用，包含完整的后端API和现代化前端界面。

## 功能特性axios

- 用户注册和登录
- 食物管理（增删改查）
- 运动管理（增删改查）
- 每日打卡记录
- 食物和运动明细管理
- 现代化响应式前端界面

## 技术栈

### 后端
- Node.js
- Express.js
- MySQL

### 前端
- HTML5
- CSS3 (响应式设计)
- JavaScript (ES6+)
-  图标

## 项目结构

```
health-checkin-app/
├── server/                 # 后端代码
│   ├── index.js           # 服务器入口
│   ├── db.js              # 数据库配置
│   └── routes/            # API路由
│       ├── users.js       # 用户相关API
│       ├── foods.js       # 食物管理API
│       ├── exercises.js   # 运动管理API
│       ├── checkins.js    # 打卡记录API
│       ├── checkinFoods.js    # 打卡食物明细API
│       └── checkinExercises.js # 打卡运动明细API
├── index.html             # 前端主页面
├── styles.css             # 样式文件
├── script.js              # 交互脚本
├── package.json           # 项目配置
├── env.example            # 环境变量示例
└── README.md              # 项目说明
```
## 运行项目

注意
数据库做了比较多修改，没能详细记录下来到底做了哪些修改


https://github.com/user-attachments/assets/05d86c4f-899e-4860-923e-927b476e7fa1

