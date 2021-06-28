var http = require('http');


var server = http.createServer(function(req, res){
  console.log(req.method, req.url, req.httpVersion);
  console.log(req.headers);

  res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
  res.end('<h1>Node 웹서버.</h1>');
});


server.listen(1234, function(){
  console.log('HTTP 서버 구동 완료.');
});



