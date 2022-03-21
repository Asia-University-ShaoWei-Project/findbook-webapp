<?php
require_once('simple_html_dom.php');
$dom = new simple_html_dom();
$item = array();
$context = stream_context_create($opts);
$tenlong_book_bestseller_url = "https://www.tenlong.com.tw/zh_tw/bestselling";
$html = file_get_html($tenlong_book_bestseller_url);
$dom->load($html, 0, $context);
$dom->find('.main-block .content-wrapper .content .book-list .list-wrapper ul li');
$item['top_date'] = substr(strrchr($dom->find('.center-container .main-block .content-wrapper .content h2', 0)->plaintext, '('), 1, 7);
for ($i = 0; $i < 10; $i++) {
    $item[$i]['isbn'] = substr($dom->find('.cover', $i)->href, 10, 13);
    $item[$i]['img'] = $dom->find('a img', $i)->src;
    $item[$i]['te_price'] = substr(strrchr($dom->find('.pricing', $i)->plaintext, "$"), 1);
    $item[$i]['title'] = $dom->find('h3 a', $i)->plaintext;
}
echo json_encode($item, JSON_UNESCAPED_UNICODE);
$html->clear();
unset($html);