const Koa = require('koa2');
const app = new Koa();
const serve = require("koa-static");
const router = require('koa-router')(); 
const bodyparser = require('koa-bodyparser');
const path = require('path');
const multer = require('koa-multer');
const fs = require('fs');
const { exec } = require('child_process');


//文件上传
//配置
const storage = multer.diskStorage({
  //文件保存路径
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  //修改文件名称
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})


//加载配置
const upload = multer({ storage: storage });

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    return currentdate;
}


app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))


router.post('/api/upload', upload.single('upload'), async (ctx) => {


  ctx.body = { msg: "文件上传成功！" }


});



router.post('/api/update', async (ctx) => {

  let text = ctx.request.body.text;
  let type = ctx.request.body.type;
  let title = ctx.request.body.title;
  let cover = ctx.request.body.cover;
  let date = Date.parse(new Date());
  let fileAddress = path.resolve(__dirname + '/../blog_hexo/source/_posts/');

  let str = 
`---
title: ${ title }
date: ${ getNowFormatDate() }
tags: ${ type }
category: ${ type }
cover: ${cover}
---
${ text }`;

  let fileStr = `${ fileAddress }/${ date }.md`;
  if (type === '宝贝') {
    fileStr = `${ fileAddress }/宝贝_${ date }.md`;
  }
  fs.appendFile(fileStr, str, (err) => {
    if (err) throw err;

    let fsStr = '';

    exec(`cd /home/blog_tools/uploads/ && ls -lR | grep "^-"| wc -l`, function(error, out, stderr) {

      if (+out > 0) {

        fsStr = `mv /home/blog_tools/uploads/* /home/blog_hexo/source/images/ && cd ${ path.resolve(__dirname + '/../blog_hexo/') } && hexo clean && hexo g && pm2 restart server`;

      }else {

        fsStr = `cd ${ path.resolve(__dirname + '/../blog_hexo/') } && hexo clean && hexo g && pm2 restart server`;

      }

      exec(fsStr, (error, stdout, stderr) => {

        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }

        console.log(`stdout: ${stdout}`);

      });

    });
  });

  ctx.body = { msg: fileAddress, text: text, type: type }


}) 


app.use(router.routes());


app.use(serve(__dirname+ "/dist",{ extensions: ['html']}));
app.use(serve(__dirname+'/uploads'));


app.listen(3500, (res) => { console.log('*** 启动成功！端口号： 3500 ***') });