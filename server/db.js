// db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // 你的 MySQL 用户名
  password: 'Walofe1188', 
  database: 'health_checkin' // 
});

module.exports = pool.promise();
