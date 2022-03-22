<?php
header("Access-Control-Allow-Origin:*");
$link = mysqli_connect(
    "localhost",
    "user",
    "password",
    "db_name"
);
if (!$link) {
    echo "Error: unable to connect to MySQL." . PHP_EOL;
    echo "Debugging error:" . mysqli_connect_errno() . PHP_EOL;
    echo "Debugging error:" . mysqli_connect_error()() . PHP_EOL;
    exit;
}
$link->set_charset("utf-8");