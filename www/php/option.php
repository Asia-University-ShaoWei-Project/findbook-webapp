<?php
$header = `User-Agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36\r\n`;
$opts = array(
  'http' => array(
    'method' => "GET",
    'header' => $header
  )
);