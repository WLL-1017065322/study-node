// 访问 `http://localhost:3000/` 时，输出包括主题的作者，


var express = require('express');
var cheerio = require('cheerio');
var superagent = require('superagent');

var app = express();

app.get('/',function(req,res,next){
    superagent.get('https://cnodejs.org/')
        .end(function(err,sres){
            if(err){
                return next(err)
            }
            var $ = cheerio.load(sres.text);
            var items = [];
            $('#topic_list .cell').each(function(index,element){
                var _title = $(element +'.topic_title_wrapper .topic_title');
                var _href = $(element +'.topic_title_wrapper .topic_title');
                var _autor = $(element +'.user_avatar .pull-left img');
                items.push({
                    title: _title.attr('title'),
                    href: _href.attr('href'),
                    author: _autor.attr('title')
                });
            });
        res.send(items);
        });
});

app.listen(3000,function(){
    console.log('app is listening at port 3000')
})