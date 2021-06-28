var http = require('http');
var fs = require('fs');
var path = require('path');

// JSON 표기법(JavaScript Object Notation)
var mime = {
  "html": "text/html",
  "css": "text/css",
  "js": "application/javascript",
  "svg": "image/svg+xml",
  // ......
};

function getMime(url){
  // today.html -> "text/html"
  // layout.css -> "text/css"
  var extname = path.extname(url).substring(1);
  return mime[extname];
}
var home = path.join(__dirname, 'design');
var server = http.createServer(function(req, res){
  console.log(req.method, req.url, req.httpVersion);
  console.log(req.headers);
  var filename = req.url.substring(1);
  if(filename == ''){
    filename = 'today.html';
  }
  var mimeType = getMime(filename);
  // 비동기 방식
  fs.readFile(path.join(home, filename), function(err, data){
    if(err){
      res.writeHead(404, {'Content-Type': 'text/html;charset=utf-8'});
      res.end('<h1>' + filename + ' 파일을 찾을 수 없습니다.');
    }else{
      res.writeHead(200, {'Content-Type': mimeType + ';charset=utf-8'});
      res.end(data);
    }
  });

  // 동기 방식
  // try{
  //   var data = fs.readFileSync(path.join(home, filename));
  //   res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
  //   res.end(data);
  // }catch(err){
  //   res.writeHead(404, {'Content-Type': 'text/html;charset=utf-8'});
  //   res.end('<h1>' + filename + ' 파일을 찾을 수 없습니다.');
  // }

});


server.listen(1234, function(){
  console.log('HTTP 서버 구동 완료.');
});



