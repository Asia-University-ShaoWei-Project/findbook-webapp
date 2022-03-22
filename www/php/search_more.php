<?php
require_once('simple_html_dom.php');
require_once('option.php');
$type = $_GET['type'];
$ISBNs = $_GET['ISBNs'];

$items = array();
$url = array(
    'books' => 'https://search.books.com.tw/search/query/key/',
    'tenlong' => 'https://www.tenlong.com.tw/products/'
);
findBooks($url['books'], $ISBNs, $items, $opts);
$dom = new simple_html_dom();
$context = stream_context_create($opts);
$dom->load(file_get_html($url['tenlong'] . $m_isbn . "?list_name=srh"), 0, $context);
$item['contents'] = $dom->find('.center-container .main-block .content-wrapper .content .item-desc', 2)->plaintext;
$item['publisher'] = $dom->find('.item-info .item-sub-info .info-content', 0)->plaintext;
echo json_encode($item, JSON_UNESCAPED_UNICODE);

function findBooks(string &$url, &$ISBNs, array &$items, $opts)
{
    $context = stream_context_create($opts);
    $dom = new simple_html_dom();
    $dom->load(file_get_html($url['books'] . $ISBNs . "/cat/all"), 0, $context);
    $price = $dom->find('.container_24bg .grid_20 .mod .cntlisearch08 form ul li .price strong', 1)->plaintext;
    if ($price != '') {
        $items['bo_price'] = explode('元', $price)[0];
    } else {
        $items['bo_price'] = 'X';
    }
}