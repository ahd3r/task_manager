const mysql = require('mysql2');

const pool = mysql.createPool({
  password:'1111',
  user:'root',
  host:'localhost',
  database:'task_manager'
});

module.exports = pool.promise();

// {
//   password:'myf7rCcAqw',
//   user:'sql7282290',
//   host:'sql7.freemysqlhosting.net',
//   database:'sql7282290'
// }
