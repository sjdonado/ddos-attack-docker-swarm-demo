const mysql = require('mysql');
const { connect } = require('mongodb');

// Set up the connection to the local db
const mongoClient = connect("mongodb://mongodb:27017/Benchmark", { useNewUrlParser: true });
const mysqlClient = new Promise((resolve, reject) => {
  const conn = mysql.createConnection({
    host: "mysql",
    user: "tester",
    password: "testerpass",
    database: 'Benchmark'
  });
  conn.connect(err => {
    if (err) {
      reject(err);
    } else {      
      resolve(conn);
    }
  })
});

exports.mongoClient = mongoClient;
exports.mysqlClient = mysqlClient;
