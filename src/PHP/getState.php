<?php
$id = urldecode($_GET['id']);
$servername = "127.0.0.1";
$user = "root";
$password = "password";
$dbname = "BikeLock";
$conn = new mysqli($servername, $user, $password, $dbname);
if (!$conn) {
    die('Not connected :' . $conn->connect_error);
}
$sql = "SELECT inUse FROM LockDevice WHERE lockID = '" . $id . "';";
$result = mysqli_query($conn, $sql);
if ($row = mysqli_fetch_assoc($result)) {
    echo $row['inUse'];
} else {
    echo "inUse not working";
}
mysqli_close($conn);
