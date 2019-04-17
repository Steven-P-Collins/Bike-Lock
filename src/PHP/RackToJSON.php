<?php
//require("phpsqlajax_dbinfo.php");

$servername = "127.0.0.1";
$user = "root";
$password = "password";
$dbname = "BikeLock";

$connection = new mysqli($servername, $user, $password, $dbname);
if (!$connection) {
    die('Not connected :' . $connection->connect_error);
}

$data = array(
    array()
);
$query = "SELECT * FROM Rack";
$result = $connection->query($query);
if (!$result) {
    die('Invalid query: ' . $connection->connect_error);
}

$x = 0;
while ($row = @mysqli_fetch_assoc($result)) {
    $data[$x][] = $row['name'];
    $data[$x][] = $row['lat'];
    $data[$x][] = $row['lng'];
    $data[$x][] = $row['rackID'];

    $x += 1;
}

$data = json_encode($data);

$filename = 'markers.json';
if(file_put_contents($filename, $data)) {
    echo 'JSON created';
} else {
    echo 'Fucked up, pal';
}

?>