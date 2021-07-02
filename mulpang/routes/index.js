const e = require('express');
var express = require('express');
var router = express.Router();
var model = require('../model/mulpangDao');
var MyUtil = require('../utils/myutil');
var checklogin = require('../middleware/checklogin');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/today');
});

// 오늘 메뉴
router.get('/today', function(req, res, next) {
  if(req.query.page){
    req.query.page = parseInt(req.query.page);
  }else{
    req.query.page = 1;
    req.url += (req.query.date?'&':'?')+'page=1';
    // if(req.query.date){
    //   req.url += '&page=1';
    // }else{
    //   req.url += '?page=1';
    // }
  }

  model.couponList(req.query, function(list){
    list.page = {};
    if(req.query.page > 1){
      list.page.pre = req.url.replace('page='+req.query.page, 'page='+(req.query.page-1));
    }
    if(req.query.page < list.totalPage){
      list.page.next = req.url.replace('page='+req.query.page, 'page='+(req.query.page+1));
    }
    res.render('today', { 
      title: '오늘의 쿠폰', 
      list: list,
      css: 'today.css',
      query: req.query, 
      options: MyUtil.generateOptions
    });
  });
});

// 상세 조회 화면
router.get('/coupons/:_id', function(req, res, next) {
  model.couponDetail(req.app.get('socketio'), req.params._id, function(coupon){
    res.render('detail', { 
      title: coupon.couponName, 
      coupon, 
      toStar: MyUtil.toStar,
      css: 'detail.css', 
      js: 'detail.js' 
    });
  });
});

// 구매 화면
router.get('/purchases/:_id', checklogin, function(req, res, next) {
  // if(req.session.user){
    model.buyCouponForm(req.params._id, function(coupon){
      res.render('buy', { 
        title: coupon.couponName, 
        coupon, 
        css: 'detail.css', 
        js: 'buy.js' 
      });
    });
  // }else{
  //   req.session.backurl = req.originalUrl;
  //   res.redirect('/users/login');
  // }  
});

// 구매 하기
router.post('/purchase', checklogin, function(req, res, next) {
  // if(req.session.user){
    req.body.email = req.session.user._id;
    model.buyCoupon(req.body, function(err, result){
      if(err){
        // res.json({errors: err});
        next(err);
      }else{
        res.end('success');
      }
    });
  // }else{
  //   res.json({errors: {message: '로그인 후 구매 가능합니다.'}});
  // }
});


// 근처 메뉴
router.get('/location', function(req, res, next){
  model.couponList(null, function(list){
    res.render('location', {title: '근처 쿠폰', css: 'location.css', js: 'location.js', list});
  });
});
// 추천 메뉴
router.get('/best', function(req, res, next){
  res.render('best', {title: '추천 쿠폰', css: 'best.css', js: 'best.js'});
});
// top5 쿠폰 조회
router.get('/topCoupon', function(req, res, next){
  model.topCoupon(req.query.condition, function(list){
    res.json(list);
  });
});
// 모두 메뉴
router.get('/all', function(req, res, next){
  model.couponList(req.query, function(list){
    res.render('all', {
      title: '모든 쿠폰', 
      css: 'all.css', 
      list, 
      query: req.query, 
      options: MyUtil.generateOptions
    });
  });  
});
// 쿠폰 남은 수량 조회
router.get('/couponQuantity', function(req, res, next){
  var idList = req.query.couponIdList.split(',');
  model.couponQuantity(idList, function(list){
    res.contentType('text/event-stream');
    res.write('data:' + JSON.stringify(list) + '\n');
    res.write('retry:10000\n');
    res.end('\n');
  });
});

module.exports = router;
