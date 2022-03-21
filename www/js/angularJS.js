// angular
//     .module('App', [])
//     .controller('LoginConController', ['$scope', function ($scope) {
//         $scope.done = '';
//     }])
//     .directive('loadingBtn', ['$timeout', function ($timeout) {
//         return {
//             link: function (scope, element, attrs) {
//                 element.bind('click', function () {
//                     if (scope.loading == true || scope.done == 'done') {
//                         return;
//                     }
//                     scope.loading = true;
//                     element.addClass('loading');
//                     timeoutId = $timeout(function () {
//                         scope.loading = false;
//                         element.removeClass('loading');
//                         scope.done = 'done';
//                     }, 2000);
//                 });
//             }
//         };
//     }]);

function onLoad() {
  document.addEventListener("deviceready", onDeviceReady, false);
  if (localStorage.hasOwnProperty("email")) {
    // document.getElementById("name").innerText = localStorage.name;
  }
  get_book_bestseller_api();
  favorite_class();
}

function onDeviceReady() {
  // navigator.geolocation.getCurrentPosition(onSuccess, onError, {
  //     timeout: 30000
  // });

  document.addEventListener("pause", onPause, false);
  document.addEventListener("resume", onResume, false);
  document.addEventListener("menubutton", onMenuKeyDown, false);
  // Add similar listeners for other events

  // getPosition();
}

function SignIn() {
  var email = document.getElementById("email").value;
  var passwd = document.getElementById("passwd").value;
  $.ajax({
    datatype: "JSON",
    type: "POST",
    url: "./php/login.php",
    data: {
      userEmail: email,
      userPasswd: passwd,
    },
    crossDomain: true,
    cache: false,
    success: function (data) {
      var obj = JSON.parse(data);
      if (obj.status === "success") {
        localStorage.setItem("email", email);
        localStorage.setItem("name", obj["name"]);
        $("#popupLogin").fadeOut("slow");
        localStorage.loginType = 1;
        window.location.reload();
      } else if (obj.status === "noAccount") {
        document.getElementById("alert_signin").innerText =
          "email or password is error";
      } else if (obj.status === "fail") {
        document.getElementById("alert_signin").innerText =
          "Can't connect to DB";
      }
    },
    error: function (data) {
      document.getElementById("alert_signin").innerText =
        "抱歉，伺服器目前出錯，請稍後...";
    },
  });
}

function SignOut() {
  localStorage.clear();
  window.location.href = "index.html";
}

function Search() {
  let search_nodata = document.getElementById("search_nodata"),
    input = document.getElementById("search_user").value,
    type = 1,
    sum,
    weight,
    digit,
    check,
    i;
  if (input === "") {
    return;
  }
  if (!isNaN(input)) {
    if (input.length === 13) {
      sum = 0;
      for (i = 0; i < 12; i++) {
        digit = parseInt(input[i]);
        if (i % 2 === 1) {
          sum += 3 * digit;
        } else {
          sum += digit;
        }
      }
      check = (10 - (sum % 10)) % 10;
      if (check == input[input.length - 1]) {
        type = 0;
      } else {
        type = 1;
      }
    } else if (input.length === 10) {
      weight = 10;
      sum = 0;
      for (i = 0; i < 9; i++) {
        digit = parseInt(input[i]);
        sum += weight * digit;
        weight--;
      }
      check = 11 - (sum % 11);
      if (check === 10) {
        check = "X";
      }
      if (check == input[input.length - 1].toUpperCase()) {
        type = 0;
      } else {
        type = 1;
      }
    }
  }

  $.mobile.loading("show", {
    text: "",
    textVisible: false,
    theme: "w",
    html: "",
  });
  $.ajax({
    datatype: "JSON",
    type: "GET",
    url: "./php/books.php",
    data: {
      search_user: encodeURIComponent(
        document.getElementById("search_user").value
      ),
      type: type,
    },
    crossDomain: true,
    cache: false,
    success: function (data) {
      var JsonData = JSON.parse(data);
      var s_name, s_img, s_date, s_price, s_isbn;
      if (JsonData !== "error") {
        search_nodata.style.display = "none";
        if (type === 0) {
          if (JsonData.length !== 0) {
            s_name = JsonData["name"];
            s_img = JsonData["img"];
            s_date = JsonData["date"];
            s_price = JsonData["ten_price"];
            s_isbn = document.getElementById("search_user").value;
            document.getElementById("search_content").innerHTML =
              "<div class='item'>" +
              "<picture><img class='books-img'></picture>" +
              "<p>書名 : " +
              s_name +
              "</p>" +
              "<p>出版商 : " +
              JsonData["publisher"] +
              "</p>" +
              "<p>日期 : " +
              s_date +
              "</p>" +
              "<p>ISBN : " +
              s_isbn +
              "</p>" +
              '<span class=\'price_span price_tenlong\'><img alt="X" src="img/tenlong1.png"> ' +
              s_price +
              "</span>" +
              '<span class=\'price_span price_books\'><img alt="X" src="img/books.png"> ' +
              JsonData["bo_price"] +
              "</span>" +
              // "<span class='price_span price_taaze'><img alt=\"X\" src=\"img/taaze.jpg\">"+JsonData["ta_price"]+"</span>"+
              "</div>" +
              "<hr>" +
              "<div style='width: 90%;margin: 0 auto'>" +
              "<div id='i_contents' style='font-size: 18px;'>" +
              "</div>" +
              "</div>";
            $(".books-img").attr("src", JsonData["img"]);
            document.getElementById("i_contents").innerText =
              JsonData["contents"].split("\r\n\t");
            sessionStorage.setItem(
              s_isbn,
              s_name +
                "##" +
                s_img +
                "##" +
                s_isbn +
                "##" +
                s_date +
                "##" +
                s_price
            );
          } else {
            search_nodata.style.display = "block";
          }
        } else if (type === 1) {
          var str = "";
          for (var i = 0; i < 25; i++) {
            if (JsonData[i]["name"].length > 25) {
              s_name = JsonData[i]["name"].slice(0, 19) + "...";
            }
            s_img = JsonData[i]["img"];
            s_date = JsonData[i]["date"];
            s_price = JsonData[i]["te_price"];
            s_isbn = JsonData[i]["isbn"];
            str =
              str +
              "<div class='item'>" +
              "<div style='text-align: center'>" +
              "<picture><img alt='X' class='books_img' src=\"https://cf-assets2.tenlong.com.tw/products/images/000/135/032/webp/A595.webp?1559010681\"></picture>" +
              '<a href="#" class="heart_ ui-btn ui-shadow ui-corner-all ui-icon-heart ui-btn-icon-notext" style="background-color: wheat" onclick="favorite_heart(' +
              i +
              "," +
              s_isbn +
              ",'" +
              s_name +
              "','" +
              s_img +
              "','" +
              s_date +
              "')\"></a>" +
              "</div>" +
              // "<div style='text-align: center'><picture><img class='books_img'></picture></div>" +
              "<p>書名 : <span class='books_name'>" +
              s_name +
              "</span></p>" +
              "<p>日期 : " +
              s_date +
              "</p>" +
              "<br>" +
              '<a href="#search_more" data-transition="flow" data-position-to="window" class="ui-btn ui-corner-all ui-shadow ui-btn-inline" data-rel="popup" onclick=Search_more(' +
              i +
              "," +
              s_isbn +
              ")>more</a>" +
              "</div>" +
              "<hr>";
            sessionStorage.setItem(
              s_isbn,
              JsonData[i]["name"] +
                "##" +
                s_img +
                "##" +
                s_isbn +
                "##" +
                s_date +
                "##" +
                s_price
            );
          }
          document.getElementById("search_content").innerHTML = str;
          for (let j = 0; j < 25; j++) {
            document.getElementsByClassName("books_img")[j].src =
              JsonData[j]["img"];
          }
        } else {
          search_nodata.style.display = "block";
        }
      }
      $.mobile.loading("hide");
    },
    error: function (data) {
      $.mobile.loading("hide");
    },
  });
}

function Search_more(index, isbn) {
  $.mobile.loading("show", {
    text: "",
    textVisible: false,
    theme: "w",
    html: "",
  });
  $.ajax({
    datatype: "JSON",
    type: "GET",
    url: "./php/search_more.php",
    data: {
      m_isbn: isbn,
    },
    crossDomain: true,
    cache: false,
    success: function (data) {
      var JsonData = JSON.parse(data),
        storage = sessionStorage.getItem(isbn).split("##");
      document.getElementById("search_more_content").innerHTML =
        "<div class='item'>" +
        "<div style='text-align: center'>" +
        "<picture><img alt='X' id='m_img' src=\"https://cf-assets2.tenlong.com.tw/products/images/000/135/032/webp/A595.webp?1559010681\"></picture>" +
        "</div>" +
        "<div style='width: 90%;margin: 0 auto'>" +
        "<p>書名 : " +
        storage[0] +
        "</p>" +
        "<p>出版商 : " +
        JsonData["publisher"] +
        "</p>" +
        "<p>日期 : " +
        storage[3] +
        "</p>" +
        "<p>ISBN : " +
        isbn +
        "</p>" +
        '<span class=\'price_span price_tenlong\'><img alt="X" src="img/tenlong1.png"> ' +
        storage[4] +
        "</span>" +
        '<span class=\'price_span price_books\'><img alt="X" src="img/books.png"> ' +
        JsonData["bo_price"] +
        "</span>" +
        "</div>" +
        "</div>" +
        "<hr>" +
        "<div style='width: 90%;margin: 0 auto'>" +
        "<div id='s_contents' style='font-size: 18px;'>" +
        "</div>" +
        "</div>";
      $("#m_img").attr("src", storage[1]);
      document.getElementById("s_contents").innerText =
        JsonData["contents"].split("\r\n\t");
      $.mobile.loading("hide");
    },
    error: function (data) {
      $.mobile.loading("hide");
    },
  });
}

function get_book_bestseller_api() {
  // function Top10() {
  $.mobile.loading("show", {
    text: "",
    textVisible: false,
    theme: "w",
    html: "",
  });
  $.ajax({
    datatype: "JSON",
    type: "GET",
    url: "./php/book_bestseller.php",
    data: {},
    crossDomain: true,
    cache: false,
    success: function (data) {
      var JsonData = JSON.parse(data);
      var s_title, s_img, s_price, s_isbn;
      if (JsonData !== "error") {
        var str = "";
        for (var i = 0; i < 10; i++) {
          if (JsonData[i]["title"].length > 18) {
            s_title = JsonData[i]["title"].slice(0, 19) + "...";
          }
          s_img = JsonData[i]["img"];
          s_price = JsonData[i]["te_price"];
          s_isbn = JsonData[i]["isbn"];

          str =
            str +
            "<div class='item'>" +
            '<a class=\'top_a\' href="#top10_more" data-transition="flow" data-position-to="window" class="ui-btn ui-corner-all ui-shadow ui-btn-inline" data-rel="popup" onclick=Search_more(' +
            s_isbn +
            ")>" +
            "<img alt='X' class='top_books_img'>" +
            "</a>" +
            // "<div style='text-align: center'><picture><img class='books_img'></picture></div>" +
            "<p>( " +
            (i + 1) +
            " )<span class='books_name'>" +
            s_title +
            "</span></p>" +
            "<br>" +
            "</div>" +
            "<hr>";
          // sessionStorage.setItem(s_isbn, s_title + "##" + s_img + "##" + s_isbn + "##" + "##" + s_price);
        }
        document.getElementById("top10_content").innerHTML = str;
        for (let j = 0; j < 10; j++) {
          document.getElementsByClassName("top_books_img")[j].src =
            JsonData[j]["img"];
        }
      }
      document.getElementById("top_title").innerHTML =
        "<span style='font-size: 24px;color: wheat'>TOP 10</span><span style='font-size: 14px;color: #bca58b;'> ( " +
        JsonData["top_date"] +
        " ) </span>";
      $.mobile.loading("hide");
    },
    error: function (data) {
      $.mobile.loading("hide");
      document.getElementById("top10_content").innerHTML =
        '<p>疑!? 404!!</p><p>檢查是否有開啟網路或重新整理</p><a onclick="location.reload()">案這裡重整</a>';
    },
  });
}

// function getPosition() {
//     var options = {
//         enableHighAccuracy: true,
//         maximumAge: 3600000
//     };
//     function onSuccess(position){
//         localStorage.lon = position.coords.longitude;
//         localStorage.lat = position.coords.latitude;
//     }
//     function onError(position) {
//         alert("Position is error")
//     }
//
//     var watchID = navigator.geolocation.getCurrentPosition(onSuccess,onError,options);
// }
function favorite_heart(index, isbn, name, img, date) {
  $.mobile.loading("show", {
    text: "",
    textVisible: false,
    theme: "w",
    html: "",
  });
  if (localStorage.getItem("loginType") == 1) {
    $("#favorite_menu").popup("open");
    document.getElementsByClassName("heart_")[index].style.backgroundColor =
      "black";
    sessionStorage.setItem(
      "heart_data",
      isbn + "##" + name + "##" + img + "##" + date
    );
  } else {
    $("#favorite_alert").popup("open");
  }

  $.mobile.loading("hide");
}

function favorite_class() {
  $.mobile.loading("show", {
    text: "",
    textVisible: false,
    theme: "w",
    html: "",
  });
  $.ajax({
    datatype: "JSON",
    type: "GET",
    url: "./php/getData.php",
    data: {
      tag1: "C%2B%2B",
      tag2: "JAVA",
      tag3: "Python",
    },
    crossDomain: true,
    cache: false,
    success: function (data) {
      var JsonData = JSON.parse(data),
        str = "",
        tag = ["C++", "JAVA", "Python"];
      for (let i = 0; i < 3; i++) {
        str =
          str +
          "<form>" +
          '<div class="ui-field-contain">' +
          '<label for="title-filter-menu">' +
          tag[i] +
          ":</label>" +
          '<select id="title-filter-menu" data-native-menu="false" class="filterable-select">' +
          "<option><div><span><img alt='X' src='+" +
          JsonData[i]["img"] +
          "+'></span><p>Name : " +
          JsonData[i]["name"] +
          "</p><p>Date : " +
          JsonData[i]["date"] +
          "</p><p>ISBN : " +
          JsonData[i]["isbn"] +
          "</p></div></option>" +
          "</select>" +
          "</div>" +
          "</form>" +
          "<form>";
      }
      document.getElementById("favorite_main").innerHTML = str;

      $.mobile.loading("hide");
    },
    error: function (data) {
      $.mobile.loading("hide");
    },
  });
  document.getElementById("favorite_menu_bt").innerHTML =
    "<button onclick='SaveToDB(\"C++\")'>C++</button>" +
    "<button onclick='SaveToDB(\"JAVA\")'>JAVA</button>" +
    "<button onclick='SaveToDB(\"Python\")'>Python</button>";

  $.mobile.loading("hide");
}
function SaveToDB(tag) {
  $.mobile.loading("show", {
    text: "",
    textVisible: false,
    theme: "w",
    html: "",
  });
  var sessionstorage = sessionStorage.getItem("heart_data").split("##");
  $.ajax({
    datatype: "JSON",
    type: "GET",
    url: "./php/favorite.php",
    data: {
      tag: encodeURIComponent(tag),
      isbn: sessionstorage[0],
      name: sessionstorage[1],
      img: sessionstorage[2],
      date: sessionstorage[3],
    },
    crossDomain: true,
    cache: false,
    success: function (data) {},
    error: function (data) {
      $.mobile.loading("hide");
    },
  });
  $.mobile.loading("hide");
}
document.getElementsByClassName("ui-icon-delete").onclick = function () {
  $.mobile.loading("hide");
};

function onPause() {
  // Handle the pause event
}

function onResume() {
  // Handle the resume event
}

function onMenuKeyDown() {
  // Handle the menubutton event
}
