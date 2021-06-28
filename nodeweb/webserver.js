var http = require('http');
var fs = require('fs');
var path = require('path');

var home = path.join(__dirname, 'html');

var server = http.createServer(function(req, res){
  console.log(req.method, req.url, req.httpVersion);
  console.log(req.headers);

  var filename = req.url.substring(1);

  try{
    var data = fs.readFileSync(path.join(home, filename));
    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
    res.end(data);
  }catch(err){
    res.writeHead(404, {'Content-Type': 'text/html;charset=utf-8'});
    res.end('<h1>' + filename + ' 파일을 찾을 수 없습니다.');
  }

});


server.listen(1234, function(){
  console.log('HTTP 서버 구동 완료.');
});



