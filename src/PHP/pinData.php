<?php
$id = intval($_GET['q']);

$servername = "127.0.0.1";
$user = "root";
$password = "password";
$dbname = "BikeLock";

$digits = 4;
$newPIN = str_pad(rand(0, pow(10, $digits)-1), $digits, '0', STR_PAD_LEFT);

$conn = new mysqli($servername, $user, $password, $dbname);
if (!$conn) {
    die('Not connected :' . $conn->connect_error);
}

$sql = "SELECT currentPIN FROM LockDevice WHERE lockID = '" . $id . "';";
$sql .= "UPDATE LockDevice SET currentPIN = nextPIN WHERE lockID = '" . $id . "';";
$sql .= "UPDATE LockDevice SET nextPIN= '" . $newPIN . "' WHERE lockID = '" . $id . "';";
$sql .= "UPDATE LockDevice SET inUse = CASE
            WHEN inUse = 1 THEN 0
            WHEN inUse = 0 THEN 1
            END
         WHERE lockID= '" . $id . "'";

if (mysqli_multi_query($conn, $sql)) {
    do {
        mysqli_next_result($conn);

        if ($result = mysqli_store_result($conn)) {
            while ($row = mysqli_fetch_row($result)) {
                echo $row[0];
            }
            mysqli_free_result($result);
        }

    }
    while (mysqli_more_results($conn));
}

mysqli_close($conn);