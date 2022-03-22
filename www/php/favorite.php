<?php
require_once("db_conn.php");
date_default_timezone_set('Asia/Taipei');
header("Content-Type:text/html; charset=utf-8");
header("Access-Control-Allow-Origin: *");
$Data = array();

$tag = $_GET['tag'];
$isbn = $_GET['isbn'];
$name = $_GET['name'];
$img = $_GET['img'];
$date = $_GET['date'];
$sql = "INSERT INTO `$tag`(`isbn`, `name`, `img`, `date`) VALUES ('$isbn','$name','$img','$date')";
mysqli_set_charset($link, "utf8");

mysqli_query($link, $sql);