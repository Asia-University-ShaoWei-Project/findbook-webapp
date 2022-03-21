<?php
require_once('simple_html_dom.php');
$books_url = array();
$dom = new simple_html_dom();
$dom1 = new simple_html_dom();

$search = urlencode($_GET['search_user']);
$type = $_GET['type'];
$price = '';
$item = array();
if ($type == 0) {
    //---------------------------------ISBN----------------------------------------------
    if (empty($m_isbn)) {
        $html = file_get_html("https://www.tenlong.com.tw/products/$search?list_name=srh", 0, $context);
        $dom->load($html);
        foreach ($dom->find('.item-info') as $article) {
            $item['name'] = $article->find('.item-title', 0)->plaintext;
            $item['img'] = $article->find('.img-wrapper a picture img', 0)->src;
            //            $item['isbn'] = substr($article->find('h3 a',0)->href, 10,13);
            $item['publisher'] = $article->find('.item-sub-info .info-content', 0)->plaintext;
            $item['date'] = $article->find('.item-sub-info .info-content', 1)->plaintext;
            $item['ten_price'] = $article->find('.item-sub-info .info-content .pricing', 1)->plaintext;
            $item['contents'] = $dom->find('.center-container .main-block .content-wrapper .content .item-desc', 2)->plaintext;
            $dom1->load(file_get_html("https://search.books.com.tw/search/query/key/" . $search . "/cat/all"), 0, $context);
            $price = $dom1->find('.container_24bg .grid_20 .mod .cntlisearch08 form ul li .price strong', 1)->plaintext;
            if ($price != '') {
                $item['bo_price'] = explode('元', $price)[0];
            } else {
                $item['bo_price'] = 'X';
            }
        }
    }
    //    else{
    //        $item['m_isbn']="不為空:".$m_isbn;
    //
    //    }

    //    $dom->load(file_get_html("https://search.books.com.tw/search/query/key/".$item1."/cat/all"),0,$context);
    //    $price=$dom->find('.container_24bg .grid_20 .mod .cntlisearch08 form ul li .price strong',1)->plaintext;
    //    if($price!=''){
    //        $item['b_price'] = $price;
    //    }else{
    //        $item['b_books'] = '無';
    //    }
    //    echo json_encode($item,JSON_UNESCAPED_UNICODE);

    //echo $item['title'];
    //    print_r($item);
} elseif ($type == 1) {
    $dom->load(file_get_html("https://www.tenlong.com.tw/search?utf8=%E2%9C%93&keyword=" . $search), 0, $context);
    $class = '.center-container .main-block .content-wrapper .content .content-inner-block .search-result-list ul li ';
    foreach ($dom->find($class . '.book-data') as $key => $article) {
        $item[$key]['isbn'] = substr($article->find('h3 a', 0)->href, 10, 13);
        $item[$key]['name'] = $article->find('h3 a', 0)->plaintext;
        $item[$key]['date'] = strchr($article->find('.item-info .basic .publish-date', 0)->plaintext, "2");
        $item[$key]['te_price'] = substr($article->find('.item-info .pricing .price', 0)->plaintext, 9);
    }
    foreach ($dom->find($class . '.cover') as $key => $article) {
        $item[$key]['img'] = $article->find('img', 0)->src;
    }
}
echo json_encode($item, JSON_UNESCAPED_UNICODE);
$html->clear();