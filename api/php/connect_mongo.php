<?php

$collection = (new MongoDB\Client($uri))->Benchmark->authors;

echo $collection;

$cursor = $collection->find([]);

// foreach ($cursor as $document) {
//     echo $document['_id'], "\n";
// }