
<?php
$id = urldecode($_GET['id']);
$newPIN = intval($_GET['p']);
$servername = "127.0.0.1";
$user = "root";
$password = "password";
$dbname = "BikeLock";
$conn = new mysqli($servername, $user, $password, $dbname);
if (!$conn) {
    die('Not connected :' . $conn->connect_error);
}
$sql = "UPDATE LockDevice SET inUse= '" . $newState . "' WHERE lockID = '" . $id . "';";
if (mysqli_query($conn, $sql)) {
    echo "Ya, did good";
} else {
    echo "Fucked  up, pal";
}
mysqli_close($conn);
