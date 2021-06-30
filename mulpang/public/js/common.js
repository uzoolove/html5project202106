var common = {
  cart: {},
  login: {}
};

$(function(){
	common.cart.showCart();
});

// 관심쿠폰을 보여준다.
common.cart.showCart = function(){
  // var cartElement = '<li data-couponid="' + couponId + '"><a href="/coupons/' + couponId + '"><img src="' + coupon.img + '" alt="' + coupon.name + '"></a><button class="cart_close">관심쿠폰 삭제</button></li>';
  
};

// 관심쿠폰 삭제 이벤트
common.cart.setRemoveCartEvent = function(){
	$('#cart .cart_close').click(function(){
		var cart = JSON.parse(localStorage.getItem('cart'));
		var couponId = $(this).parent().data('couponid');
		delete cart[couponId];
		cart.length--;
		localStorage.setItem('cart', JSON.stringify(cart));
		common.cart.showCart();
	});
};

// 관심쿠폰의 남은 수량을 받아서 10개 미만일 경우 알림 메세지를 보여준다.
common.cart.es = null;
common.cart.requestQuantity = function(){
  if(common.cart.es) common.cart.es.close();
  var cart = localStorage.getItem('cart');
  if(cart){
    cart = JSON.parse(cart);
    if(cart.length == 0) return;
    
    var couponIdList = [];
    for(var couponId in cart){
      if(couponId != 'length'){
        couponIdList.push(couponId);
      }
    };
    
    // SSE 요청 시작
    common.cart.es = new EventSource('/couponQuantity?couponIdList=' + couponIdList);
    common.cart.es.onmessage = function(me){
      var data = JSON.parse(me.data);
      data.forEach(function(coupon){
        var cartCoupon = cart[coupon._id];
        var count = coupon.quantity - coupon.buyQuantity;
        if(count < cartCoupon.noti && count > 0){
          var msg = cartCoupon.name + ' 수량이 ' + count + '개 밖에 남지 않았습니다.';
          common.cart.showNoti({
            tag: coupon._id,
            icon: cartCoupon.img,
            body: msg
          });
          cartCoupon.noti = count;
          localStorage.setItem('cart', JSON.stringify(cart));
        }
      });
    };
  }
};

// 바탕화면 알림 서비스를 보여준다.
common.cart.showNoti = function(noti){	
	
};



$(function(){
	common.login.setLoginEvent();
});

// 로그인 이벤트 등록
common.login.setLoginEvent = function(){
  
};
