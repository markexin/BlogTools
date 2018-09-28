const Client = require('ssh2').Client;

var conn = new Client();

conn.on('ready', function() {
  console.log('Client :: ready');
  // 这里要执行 linux 命令 拉取代码然后执行其他的操作
  conn.exec('********', function(err, stream) {
    if (err) throw err;
    stream.on('close', function(code, signal) {
      console.log('Stream-close-code: ' + code + ', signal: ' + signal);
      conn.end();
    }).on('data', function(data) {
      console.log('STDOUT: ' + data);
    })
  });
}).connect({
  host: '', // 这里是服务器的host
  username: '', // 服务器的账号
  password: '' // 服务器的密码
});
