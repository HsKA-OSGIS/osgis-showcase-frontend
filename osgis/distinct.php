<?php
include 'conn.php';
$db = pg_connect($conn_string)  or die('connection failed'); 
$sql = "SELECT DISTINCT type FROM ogrgeojson;";
$rs = pg_query($db, $sql);
if (!$rs) {
  echo "Ein Fehler ist aufgetreten.\n";
  exit;
}
$json = array();
while($row=pg_fetch_array($rs)) {
    array_push($json, $row['type']);
}
pg_close($db);
header("Content-Type:application/json",true);
echo json_encode($json);
?>