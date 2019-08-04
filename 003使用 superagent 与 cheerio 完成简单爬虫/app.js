// # 《使用 superagent 与 cheerio 完成简单爬虫》

// 目标
// 建立一个 lesson3 项目，在其中编写代码。

// 当在浏览器中访问 `http://localhost:3000/` 时，输出 CNode(https://cnodejs.org/ ) 社区首页的所有帖子标题和链接，以 json 的形式。

// 引入依赖
var express = require("express");
var superagent = require("superagent");
var cheerio = require("cheerio");

var app = express();

app.get('/', function(req, res, next) {
    superagent.get('https://cnodejs.org/')
    // 常规的错误处理
        .end(function(err,sres){
            if(err){
                return next(err);
            }
      // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
      // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
      // 剩下就都是 jquery 的内容了
            var $ = cheerio.load(sres.text);
            var items = [];
            $('#topic_list .topic_title').each(function(index,element){
                var $element = $(element);
                items.push({
                    title: $element.attr('title'),
                    href: $element.attr('href')
                });
            });
        res.send(items);
        });
});
cd
app.listen(3000,function(){
    console.log('app is listening at port 3000');
})
