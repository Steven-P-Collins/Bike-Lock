<?php

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
$names = "SELECT rack FROM LockDevice";

$result = $connection->query($names);
if (!$result) {
    die('Invalid query: ' . $connection->connect_error);
}

$x = 0;
while ($id = @mysqli_fetch_assoc($result)) {
    if ($x != 0 && $data[$x-1][0] == "'" . $id['rack'] . "': ") {
        continue;
    }
    $data[$x][0] = "'" . $id['rack'] . "': ";

    $x++;
}

$len = count($data);
$query = "";
for ($r = 1; $r <= $len; $r++) {
    $query .= "SELECT COUNT(*) as 'num' FROM LockDevice WHERE rack=" . $r . " AND inUse=0;";
    $query .= "SELECT COUNT(*) as 'num' FROM LockDevice WHERE (rack=" . $r . " AND inUse=1);";
    if ($r < $len) {
        $query .= "SELECT COUNT(*) as 'num' FROM LockDevice WHERE rack=" . $r . ";";
    } else {
        $query .= "SELECT COUNT(*) as 'num' FROM LockDevice WHERE rack=" . $r;
    }
}


if (mysqli_multi_query($connection,$query)) {
    $i = 0;
    $j = 1;
    do {
        mysqli_next_result($connection);

        if ($result = mysqli_store_result($connection)) {
            while($row = mysqli_fetch_row($result)) {
                switch ($j) {
                    case 1:
                        $data[$i][0] .= "[" . $row[0] . ", ";
                        break;
                    case 3:
                        $data[$i][0] .= $row[0] . "]";
                        break;
                    default:
                        $data[$i][0] .=  $row[0] . ", ";
                }
            }
        mysqli_free_result($result);
        }
        $j++;
        if ($j == 4) {
            $j = 0;
            $i++;
        }
    }
    while (mysqli_more_results($connection));
}

$data = json_encode($data);

$filename = 'locks.json';
if(file_put_contents($filename, $data)) {
    echo 'JSON created';
} else {
    echo 'Fucked up, pal';
}

?>