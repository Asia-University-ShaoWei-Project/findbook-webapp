<?php
include('simple_html_dom.php');
$dom = new simple_html_dom();
// $books_URL=array();
$type=$_GET['type'];
$m_isbn=$_GET['m_isbn'];
$item=array();
$dom->load(file_get_html("https://search.books.com.tw/search/query/key/".$m_isbn."/cat/all"),0,$context);
$price=$dom->find('.container_24bg .grid_20 .mod .cntlisearch08 form ul li .price strong',1)->plaintext;
if($price!=''){
    $item['bo_price'] = explode('元',$price)[0];
}else{
    $item['bo_price'] = 'X';
}

$dom->load(file_get_html("https://www.tenlong.com.tw/products/$m_isbn?list_name=srh"),0,$context);
$item['contents']=$dom->find('.center-container .main-block .content-wrapper .content .item-desc',2)->plaintext;
$item['publisher']=$dom->find('.item-info .item-sub-info .info-content',0)->plaintext;
echo json_encode($item,JSON_UNESCAPED_UNICODE);



