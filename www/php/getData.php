<?php

include("db_conn.php");
date_default_timezone_set('Asia/Taipei');
header("Content-Type:text/html; charset=utf-8");
header("Access-Control-Allow-Origin: *");
$Data = array();
//$tag1=$_GET['tag1'];
$tag=[$_GET['tag1'],$_GET['tag2'],$_GET['tag3']];
mysqli_set_charset($link,"utf8");
for ($i=0;$i<3;$i++){
    $sql = "SELECT `isbn`, `name`, `img`, `date` FROM `$tag[$i]`";
    $result = mysqli_query($link, $sql);
    $row = mysqli_fetch_assoc($result);
    $result=mysqli_query($link, $sql);
//    $val = $result->num_rows;
    $Data[$i]['isbn']=$row['isbn'];
    $Data[$i]['name']=$row['name'];
    $Data[$i]['img']=$row['img'];
    $Data[$i]['date']=$row['date'];
}
echo json_encode($Data,JSON_UNESCAPED_UNICODE);

