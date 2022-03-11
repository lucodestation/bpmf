//首页tab切换
$(function () {
  $(".index-tab-hd").on("click", "li", function () {
    // 设index为当前点击
    var index = $(this).index();
    // 点击添加样式利用siblings清除其他兄弟节点样式
    $(this).addClass("on").siblings().removeClass("on");
    // 同理显示与隐藏
    $(this).parents(".index-sec2-tab").find(".index-tab-bd .bd-box").eq(index).show().siblings().hide();
  });
});
//头部点击下拉
$(function () {
  $(".header-sub").click(function () {
    $(".sub-down").slideToggle();
  });

});

//登录tab切换
$(function () {
  $(".index-login-hd  .login-li").off("click").on("click", function () {
    var index = $(this).index();
    $(this).addClass("on").siblings().removeClass("on");
    $(".login-box").eq(index).addClass("active").siblings().removeClass("active");
  });
});

//个人中心托管金额tab切换
$(function () {
  $(".common-tab  .tab-li").off("click").on("click", function () {
    var index = $(this).index();
    $(this).addClass("active").siblings().removeClass("active");
    $(".common-content").eq(index).addClass("active").siblings().removeClass("active");
  });
});

//赛事详情
$(function () {
  $(".match-switch  .switch-li").off("click").on("click", function () {
    var index = $(this).index();
    $(this).addClass("on").siblings().removeClass("on");
    $(".match-switch-box").eq(index).addClass("active").siblings().removeClass("active");
  });
});

//登录密码显示隐藏
$(function () {
  //查看密码
  $(".eye-open").click(function () {
    if ($(this).attr("data-show") == 1) {//明文
      $(this).attr("data-show", "2");
      $(this).addClass('eye-close');
      $(this).removeClass('eye-open');
      $(this).parent(".login-item").children(".mima_dd").hide();
      $(this).parent(".login-item").children(".mima_wz").show();
      $(this).parent(".login-item").children(".mima_wz").val($(this).parent(".login-item").children(".mima_dd").val());
      return;
    }
    if ($(this).attr("data-show") == 2) {//密文
      $(this).attr("data-show", "1");
      $(this).addClass('eye-open');
      $(this).removeClass('eye-close');
      $(this).parent(".login-item").children(".mima_dd").show();
      $(this).parent(".login-item").children(".mima_wz").hide();
      $(this).parent(".login-item").children(".mima_dd").val($(this).parent(".login-item").children(".mima_wz").val());
      return;
    }
  });
});
//保证金弹窗关闭
// $(function(){
//     $(".bond-close").click(function(){
//         $(".bond-pop").hide();
//     });
//
// });
//
// (function ($) {

//   $.fn.parallelRoll = function (options) {

//     var opts = $.extend({}, $.fn.parallelRoll.defaults, options);

//     var _this = this;

//     var l = _this.find(opts.tagName).length;

//     var autoRollTimer;

//     var flag = true; // 防止用户快速多次点击上下按钮

//     var arr = new Array();

//     /**

//      * 如果当  (可视个数+滚动个数 >滚动元素个数)  时  为不出现空白停顿   将滚动元素再赋值一次

//      * 同时赋值以后的滚动元素个数是之前的两倍  2 * l.

//      * */

//     if (opts.amount + opts.visual > l) {

//       _this[0].innerHTML += _this[0].innerHTML;

//       l = 2 * l;

//     } else {

//       l = l;

//     }

//     var w = $(opts.tagName).outerWidth(true); //计算元素的宽度  包括补白+边框

//     _this.css({ width: (l * w) + 'px' }); // 设置滚动层盒子的宽度

//     return this.each(function () {

//       _this.closest('.' + opts.boxName).hover(function () {

//         clearInterval(autoRollTimer);

//       }, function () {

//         switch (opts.direction) {

//           case 'left':

//             autoRollTimer = setInterval(function () {

//               left();

//             }, opts.time);

//             break;

//           case 'right':

//             autoRollTimer = setInterval(function () {

//               right();

//             }, opts.time);

//             break;

//           default:

//             alert('参数错误！');

//             break;

//         }

//       }).trigger('mouseleave');

//       $('.' + opts.prev).on('click', function () {

//         flag ? left() : "";

//       });

//       $('.' + opts.next).on('click', function () {

//         flag ? right() : "";

//       });

//     });

//     function left () {

//       flag = false;

//       _this.animate({ marginLeft: -(w * opts.amount) }, 1000, function () {

//         _this.find(opts.tagName).slice(0, opts.amount).appendTo(_this);

//         _this.css({ marginLeft: 0 });

//         flag = true;

//       });

//     };

//     function right () {

//       flag = false;

//       arr = _this.find(opts.tagName).slice(-opts.amount);

//       for (var i = 0; i < opts.amount; i++) {

//         $(arr[i]).css({ marginLeft: -w * (i + 1) }).prependTo(_this);

//       }

//       _this.animate({ marginLeft: w * opts.amount }, 1000, function () {

//         _this.find(opts.tagName).removeAttr('style');

//         _this.css({ marginLeft: 0 });

//         flag = true;

//       });

//     };

//   };

//   //插件默认选项

//   $.fn.parallelRoll.defaults = {

//     boxName: 'box',

//     tagName: 'dd',

//     time: 3000,  //

//     direction: 'left', // 滚动方向

//     visual: 3, //可视数

//     prev: 'prev',

//     next: 'next',

//     amount: 1   // 滚动数  默认是1

//   };

// })(jQuery);



// $(document).ready(function () {

//   $("#roll").parallelRoll({

//     amount: 1

//   });

// });



