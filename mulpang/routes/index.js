var express = require('express');
var router = express.Router();
var model = require('../model/mulpangDao');
var MyUtil = require('../utils/myutil');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/today');
});

// 오늘 메뉴
router.get('/today', function(req, res, next) {
  model.couponList(function(list){
    res.render('today', { title: '오늘의 쿠폰', list: list });
  });
});

// 상세 조회 화면
router.get('/coupons/:_id', function(req, res, next) {
  model.couponDetail(req.params._id, function(coupon){
    res.render('detail', { title: coupon.couponName, coupon, toStar: MyUtil.toStar });
  });
});

router.get('/*.html', function(req, res, next) {
  var url = req.url.substring(1, req.url.indexOf('.html'));
  res.render(url, { title: '오늘은 뭘파니?' });
});

module.exports = router;
