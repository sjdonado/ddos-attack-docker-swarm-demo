<?php

require_once __DIR__ . "/vendor/autoload.php";

$mysqlserver = "mysql";
$username = "user";
$password = "test";
$dbname = "Benchmark";
$uri = 'mongodb://mongodb:27017/Benchmark';

require_once 'connect_mongo.php';
require_once 'connect_mysql.php';
