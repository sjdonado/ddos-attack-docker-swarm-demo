const express = require('express');
const { mongoClient, mysqlClient } = require('./db');
const benchmark = require('./benchmark');
const app = express();

app.get('/benchmark', async function (req, res) {
  const result = await benchmark.run(mongoClient, mysqlClient);
  res.send(result);
});

app.listen(3000);