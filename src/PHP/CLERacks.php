<?php

$servername = "127.0.0.1";
$user = "root";
$password = "password";
$dbname = "CLERacks";

$connection = new mysqli($servername, $user, $password, $dbname);
if (!$connection) {
    die('Not connected :' . $connection->connect_error);
}

$racks = array();
$query = "SELECT * FROM Racks";
$result = $connection->query($query);
if (!$result) {
    die('Invalid query: ' . $connection->connect_error);
}

$x = 0;
while ($row = @mysqli_fetch_assoc($result)) {
    $racks[$x][] = $row['name'];
    $racks[$x][] = $row['lat'];
    $racks[$x][] = $row['lng'];
    $racks[$x][] = $row['rackID'];

    $x++;
}

echo json_encode($racks);