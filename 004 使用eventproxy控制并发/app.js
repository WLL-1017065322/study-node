// # 《使用 eventproxy 控制并发》

// ## 目标

// 建立一个 lesson4 项目，在其中编写代码。

// 代码的入口是 `app.js`，当调用 `node app.js` 时，它会输出 CNode(https://cnodejs.org/ ) 
// 社区首页的所有主题的标题，链接和第一条评论，以 json 的格式。


// ## 挑战

// 以上文目标为基础，输出 `comment1` 的作者，以及他在 cnode 社区的积分值。


// ## 知识点

// 1. 体会 Node.js 的 callback hell 之美
// 2. 学习使用 eventproxy 这一利器控制并发

// var express = require("express");
var superagent = require("superagent");
var cheerio = require("cheerio");
var eventproxy = require('eventproxy');

// url 模块是 Node.js 标准库里面的
// http://nodejs.org/api/url.html
var url = require('url');

var cnodeUrl = 'https://cnodejs.org/';
superagent.get(cnodeUrl)
    .end(function(err, res){
        if(err){
            return console.error(err);
        }
        var topicUrls = [];
        var $ = cheerio.load(res.text);

        $('#topic_list .topic_title').each(function(index,element){
            var $element = $(element);
      // $element.attr('href') 本来的样子是 /topic/542acd7d5d28233425538b04
      // 我们用 url.resolve 来自动推断出完整 url，变成
      // https://cnodejs.org/topic/542acd7d5d28233425538b04 的形式
      // 具体请看 http://nodejs.org/api/url.html#url_url_resolve_from_to 的示例
            var href = url.resolve(cnodeUrl,$element.attr('href'));
            topicUrls.push(href);
        });
        // console.log(topicUrls);

        var ep = new eventproxy();
        // 命令 ep 重复监听 topicUrls.length 次（在这里也就是 40 次） `topic_html` 事件再行动
        // ep.after('topic_html',topicUrls.length,function(topics){
        ep.after('topic_html',3,function(topics){
            // topics 是个数组，包含了 40 次 ep.emit('topic_html', pair) 中的那 40 个 pair
            topics = topics.map(function(topicPair){
                var topicUrls = topicPair[0];
                var topicHtml = topicPair[1];
                var $ = cheerio.load(topicHtml);
                return({
                    title: $('.topic_full_title').text().trim(),
                    href: topicUrls,
                    comment1: $('.reply_content').eq(0).text().trim(),
                });
            });
            console.log('final:');
            console.log(topics);
        });
        topicUrls.forEach(function(topicUrl){
            superagent.get(topicUrl)
                .end(function(err,res){
                    console.log('fetch' + topicUrl + 'sucessful');
                    ep.emit('topic_html',[topicUrl,res.text]);
                })
        })
        
    });
    // .end(function (err, res) {
    //     if (err) {
    //       return console.error(err);
    //     }
    //     var topicUrls = [];
    //     var $ = cheerio.load(res.text);
    //     $('#topic_list .topic_title').each(function (idx, element) {
    //       var $element = $(element);
    //       var href = url.resolve(cnodeUrl, $element.attr('href'));
    //       topicUrls.push(href);
    //     });
    
    //     var ep = new eventproxy();
    
    //     ep.after('topic_html', topicUrls.length, function (topics) {
    //       topics = topics.map(function (topicPair) {
    //         var topicUrl = topicPair[0];
    //         var topicHtml = topicPair[1];
    //         var $ = cheerio.load(topicHtml);
    //         return ({
    //           title: $('.topic_full_title').text().trim(),
    //           href: topicUrl,
    //           comment1: $('.reply_content').eq(0).text().trim(),
    //         });
    //       });
    
    //       console.log('final:');
    //       console.log(topics);
    //     });
    
    //     topicUrls.forEach(function (topicUrl) {
    //       superagent.get(topicUrl)
    //         .end(function (err, res) {
    //           console.log('fetch ' + topicUrl + ' successful');
    //           ep.emit('topic_html', [topicUrl, res.text]);
    //         });
    //     });
    //   });
    

