<?php
require_once("db_conn.php");
date_default_timezone_set('Asia/Taipei');
header("Content-Type:text/html; charset=utf-8");
header("Access-Control-Allow-Origin: *");
if (isset($_POST)) {
    $userEmail = $_POST['userEmail'];
    $userPasswd = sha1($_POST['userPasswd']);
    $sql = "SELECT * FROM `user` WHERE `password` = '$userPasswd' AND `email` = '$userEmail'";
    $result = mysqli_query($link, $sql);
    $row = mysqli_fetch_assoc($result);
    $val = $result->num_rows;
    if ($val == 1) {
        $outData = array("status" => "success", "name" => $row["name"]);
    } else {
        $outData = array("status" => "noAccount", "id" => $userPasswd);
    }
} else {
    $outData = array("status" => "fail");
}
echo json_encode($outData, JSON_UNESCAPED_UNICODE);