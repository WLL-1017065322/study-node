// ## 目标
// 建立一个 lesson2 项目，在其中编写代码。
// 当在浏览器中访问 `http://localhost:3000/?q=alsotang` 时，输出 `alsotang` 的 md5 值，即 `bdd5e57b5c0040f9dc23d430846e68a3`。

// ## 挑战
// 访问 `http://localhost:3000/?q=alsotang` 时，输出 `alsotang` 的 sha1 值，即 `e3c766d71667567e18f77869c65cd62f6a1b9ab9`。

// 1. 学习 req.query 的用法
// 2. 学习建立 package.json 来管理 Node.js 项目。

// 引入依赖
var express = require('express');
var utility = require('utility');

// 建立express实例
var app = express();

app.get('/',function(req,res){
  // 从 req.query 中取出我们的 q 参数。
  // 如果是 post 传来的 body 数据，则是在 req.body 里面，不过 express 默认不处理 body 中的信息，需要引入 https://github.com/expressjs/body-parser 这个中间件才会处理，这个后面会讲到。
  // 如果分不清什么是 query，什么是 body 的话，那就需要补一下 http 的知识了    
    var q = req.query.q;
  // 调用 utility.md5 方法，得到 md5 之后的值
  // 之所以使用 utility 这个库来生成 md5 值，其实只是习惯问题。每个人都有自己习惯的技术堆栈，
  // 我刚入职阿里的时候跟着苏千和朴灵混，所以也混到了不少他们的技术堆栈，仅此而已。
  // utility 的 github 地址：https://github.com/node-modules/utility
  // 里面定义了很多常用且比较杂的辅助方法，可以去看看
    var md5Value = utility.md5(q);

    res.send(md5Value)
});

app.listen(3000,function(req,res){
    console.log('app is running at port 3000');
});

// 访问 `http://localhost:3000/?q=alsotang`，完成。

// 如果直接访问 `http://localhost:3000/` 会抛错

// ![](https://raw.githubusercontent.com/alsotang/node-lessons/master/lesson2/3.png)

// 可以看到，这个错误是从 `crypto.js` 中抛出的。

// 这是因为，当我们不传入 `q` 参数时，`req.query.q` 取到的值是 `undefined`，`utility.md5` 直接使用了这个空值，导致下层的 `crypto` 抛错。