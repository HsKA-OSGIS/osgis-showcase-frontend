<?php
include 'conn.php';
$db = pg_connect($conn_string)  or die('connection failed'); 
$sql = "SELECT *, st_asgeojson(st_transform(geom_3857, 4326)) AS geojson FROM ogrgeojson";
$filter = "";
if (array_key_exists('year', $_GET) or array_key_exists('type', $_GET)){
    $filter .= ' where ';
}
if (array_key_exists('type', $_GET)){
    $filter .= (" type = '" . $_GET['type'] . "' ");
}
if (array_key_exists('year', $_GET) and array_key_exists('type', $_GET)){
    $filter .= " and ";
}
if (array_key_exists('year', $_GET)){
    $filter .= (" year = " . $_GET['year']);
}
$sql .= $filter;
$sql .= ";";
$rs = pg_query($db, $sql);
if (!$rs) {
  echo "Ein Fehler ist aufgetreten.\n";
  exit;
}
$geojson = array(
       'filter'    => $sql,
       'type'      => 'FeatureCollection',
       'features'  => array()
    ); 
        
while($row=pg_fetch_array($rs)) {  
  $feature = array(
          'type' => 'Feature', 
          'geometry' => json_decode($row[6]),
          'properties' => array(
            'id' => $row[3],
            'type' => $row[4],
            'year' => $row[5]
           )
       );
       // Add feature array to feature collection array
       array_push($geojson['features'], $feature);
    }
    pg_close($db);
    header("Content-Type:application/json",true);
    echo json_encode($geojson);
?>