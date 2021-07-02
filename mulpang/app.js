var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var nocache = require('nocache');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/**
 * express의 미들웨어 만드는 방법
 * 1. (err), req, res, next 인자로 받는 함수
 * 2. 기능 구현
 * 3. 다음 둘중 하나의 작업으로 끝나야 한다.
 *  - res로 클라이언트에 응답 전송(res.render(), res.end(), res.json() ...)
 *  - 등록된 다음 미들웨어를 호출(next())
 */
app.use('/middleware', function(req, res, next){
  console.log('body', req.body);
  console.log('cookies', req.cookies);
  console.log('session', req.session);
  next();
});


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(nocache());

// "/couponQuantity"로 시작하지 않는 url
app.use(/^((?!\/couponQuantity).)*$/, session({
  cookie: {maxAge: 1000*60*60*2},
  secret: 'some seed text',
  rolling: true,  // 매 요청마다 세션 갱신
  resave: false,  // 세션이 수정되지 않으면 서버에 다시 저장하지 않음
  saveUninitialized: false  // 세션에 아무 값도 없을 경우 클라이언트에 전송 안함
}), function(req, res, next){
  // ejs 렌더링에 사용할 로그인 정보 지정
  res.locals.user = req.session.user;
  next();
});

app.use('/middleware', function(req, res, next){
  console.log('body', req.body);
  console.log('cookies', req.cookies);
  console.log('session', req.session);
  next();
});

app.use(logger('dev'));

// var checklogin = require('./middleware/checklogin');
// app.use(checklogin);

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404, req.url + ' Not Found!'));
});

// custom error handler
app.use(function(err, req, res, next){
  if(req.xhr){
    res.json({errors: err});
  }else{
    next(err);
  }
});

// error handler
app.use(function(err, req, res, next) {
  console.error(err.stack);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
