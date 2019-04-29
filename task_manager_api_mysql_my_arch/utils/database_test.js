const mysql = require('mysql2');

const pool = mysql.createPool({
  user:'root',
  password:'1111',
  host:'localhost',
  database: 'task_manager_test'
});

module.exports = pool.promise();
