require("webduino-js");
require("webduino-blockly");
var request = require("request");
var cheerio = require("cheerio");
var nodemailer = require('nodemailer');
var jp = function() {
    request({
        url: "http://rate.bot.com.tw/Pages/Static/UIP003.zh-TW.htm",
        method: "GET"
    }, function(error, response, body) {
        if (error || !body) {
            return;
        }else{

            // 爬完網頁後要做的事情
            console.log(body);
        }
    });
};