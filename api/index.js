const express = require('express');
const fibonacci = require ('fibonacci');

const app = express();

app.get('/', function (req, res) {
  const bigNumber = fibonacci.iterate(5000);
  res.send(bigNumber);
});

app.listen(3000);
