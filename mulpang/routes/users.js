var express = require('express');
var router = express.Router();
var path = require('path');
var multer = require('multer');
var model = require('../model/mulpangDao');
var checklogin = require('../middleware/checklogin');
var MyUtil = require('../utils/myutil');

// 회원 가입 화면
router.get('/new', function(req, res, next) {
  res.render('join', {title: '회원 가입', js: 'join.js'});
});

var tmp = path.join(__dirname, '..', 'public', 'tmp');
// 프로필 이미지 업로드
router.post('/profileUpload', multer({dest: tmp/*, limits: {fileSize: 1024*1024*10}*/}).single('profile'), function(req, res, next) {
  console.log(req.file);
  res.end(req.file.filename);   // 임시 파일명 응답
});
// 회원 가입 요청
router.post('/new', function(req, res, next) {
  model.registMember(req.body, function(err, result){
    if(err){
      // res.json({errors: err});
      next(err);
    }else{
      res.end('success');
    }
  });  
});
// 간편 로그인
router.post('/simpleLogin', function(req, res, next) {
  model.login(req.body, function(err, user){
    if(err){
      // res.json({errors: err});
      next(err);
    }else{
      req.session.user = user;
      res.json(user);
    }
  });  
});
// 로그아웃
router.get('/logout', function(req, res, next) {
  req.session.destroy(); 
  res.redirect('/');
});
// 로그인 화면
router.get('/login', function(req, res, next) {
  res.render('login', {title: '로그인'});
});
// 로그인
router.post('/login', function(req, res, next) {
  model.login(req.body, function(err, user){
    if(err){
      res.render('login', {title: '로그인', errors: err});
    }else{
      req.session.user = user;
      res.redirect(req.session.backurl || '/');
    }
  });
});
// 마이 페이지
router.get('/', checklogin, function(req, res, next) {
  var userid = req.session.user._id;
  model.getMember(userid, function(result){
    res.render('mypage', {
      title: '마이페이지', 
      css: 'mypage.css', 
      js: 'mypage.js', 
      purchases: result, 
      toStar: MyUtil.toStar
    });
  });
});
// 회원 정보 수정
router.put('/', checklogin, function(req, res, next) {
  var userid = req.session.user._id;
  model.updateMember(userid, req.body, function(err){
    if(err){
      // res.json({errors: err});
      next(err);
    }else{
      res.end('success');
    }
  });  
});
// 구매 후기 등록
router.post('/epilogue', checklogin, function(req, res, next) {
  var userid = req.session.user._id;
  model.insertEpilogue(userid, req.body, function(err){
    if(err){
      // res.json({errors: err});
      next(err);
    }else{
      res.end('success');
    }
  });
});


module.exports = router;
