"use strict";
new Swiper('.mySwiper', {
    pagination: {
        el: '.swiper-pagination',
    },
    autoplay: true,
});
function ok(id) {
    syalert.syhide(id);
}
$(function () {
    $('.public-header').load('/components/PublicHeader.html');
    $('.public-footer').load('/components/PublicFooter.html');
});
