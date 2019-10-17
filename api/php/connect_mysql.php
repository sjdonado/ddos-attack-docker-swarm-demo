<?php

// Create connection
$conn = new mysqli($mysqlserver, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$countSec=0;
$idSales=1;
while ($countSec < 1) {
	 $start = microtime(true);

  $sql="SELECT * FROM Sales100K_alt WHERE SalesID=". $idSales;
	$result = $conn->query($sql);

  $time_elapsed_secs = microtime(true) - $start;
  $idSales++;
  $countSec = $countSec + $time_elapsed_secs;
  if ($idSales % 1000 == 0)
    echo "<br/>Tiempo: " . $countSec . ", IdSales: " . $idSales;
  if ($idSales > 100000)
    $countSec = 1;

		flush();  
		ob_flush();  
}

echo "<br/>total time:".$countSec.", Ids:".$idSales;

// try {
//   // Create connection
//   $conn = new mysqli($mysqlserver, $username, $password, $dbname);
//   // Check connection
//   if ($conn->connect_error) {
//     die("Connection failed: " . $conn->connect_error);
//   }

//   $countSec=0;
//   $idAuthor=1;
//   while ($countSec < 1) {
//     $start = microtime(true);

//     $sql="SELECT * FROM posts WHERE author_id=". $idAuthor;
//     $result = $conn->query($sql);

//     $time_elapsed_secs = microtime(true) - $start;
//     $idAuthor++;
//     $countSec = $countSec + $time_elapsed_secs;
//     if ($idAuthor % 1000 == 0)
//       echo "<br/>Tiempo: " . $countSec . ", idAuthor: " . $idAuthor;
//     if ($idAuthor > 100000)
//       $countSec = 1;

//       flush();  
//       ob_flush();  
//   }

//   echo "<br/>total time:".$countSec.", Ids:".$idAuthor;
// } catch (Exception $e) {
//   echo 'Caught exception: ',  $e->getMessage(), "\n";
// }
