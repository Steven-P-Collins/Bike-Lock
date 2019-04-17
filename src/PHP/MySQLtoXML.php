<?php
//require("phpsqlajax_dbinfo.php");

$servername = "127.0.0.1";
$user = "root";
$password = "Sokka8745";
$dbname = "BikeLock";

$connection = new mysqli($servername, $user, $password, $dbname);
if (!$connection) {
    die('Not connected :' . $connection->connect_error);
}

// Start XML file, create parent node
$doc = new DOMDocument("1.0");
$node = $doc->createElement("markers");
$parnode = $doc->appendChild($node);

// Opens a connection to a MySQL server
//$connection=mysql_connect ('localhost', 'root', 'Sokka8745');
//if (!$connection) {
//    die('Not connected : ' . mysql_error());
//}

// Set the active MySQL database
//$db_selected = mysql_select_db('BikeLock', $connection);
//if (!$db_selected) {
//    die ('Can\'t use db : ' . $connection->connect_error);
//}

// Select all the rows in the markers table
$query = "SELECT * FROM Rack";
$result = $connection->query($query);
if (!$result) {
    die('Invalid query: ' . $connection->connect_error);
}

header("Content-type: text/xml");

// Iterate through the rows, adding XML nodes for each
while ($row = @mysqli_fetch_assoc($result)){
    // Add to XML document node
    $node = $doc->createElement("marker");
    $newnode = $parnode->appendChild($node);

    $newnode->setAttribute("id", $row['rackID']);
    $newnode->setAttribute("name", $row['name']);
    $newnode->setAttribute("lat", $row['lat']);
    $newnode->setAttribute("lng", $row['lng']);
}

$xmlfile = $doc->saveXML();
echo $xmlfile;

?>