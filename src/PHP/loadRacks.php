<?php

$txt = file_get_contents('../../rackLoc.txt');
$rows = explode("\n", $txt);
$info = array();


foreach ($rows as $row => $data) {
    $row_data = explode(", ", $data);

    $info[$row]['name'] = $row_data[0];
    $info[$row]['lat'] = $row_data[1];
    $info[$row]['lng'] = $row_data[2];
    $info[$row]['id'] = $row_data[3];
}

$servername = "127.0.0.1";
$user = "root";
$password = "password";
$dbname = "CLERacks";

$connection = new mysqli($servername, $user, $password, $dbname);
if (!$connection) {
    die('Not connected :' . $connection->connect_error);
}

$len = count($info);
$query = "";
for ($r = 0; $r < $len; $r++) {
    if ($r < $len) {
        $query .= "INSERT INTO Racks (name, lat, lng, rackID) VALUES ('" . $info[$r]['name'] . "', " . $info[$r]['lat'] . ", " . $info[$r]['lng'] . ", " . $info[$r]['id'] . ");";
    } else {
        $query .= "INSERT INTO Racks (name, lat, lng, rackID) VALUES ('" . $info[$r]['name'] . "', " . $info[$r]['lat'] . ", " . $info[$r]['lng'] . ", " . $info[$r]['id'] . ")";
    }
}

if (mysqli_multi_query($connection, $query)) {
    echo "Nice job, A plux";
} else {
    echo "Fucked up, pal.";
}