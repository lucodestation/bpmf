console.log('xxxxxxx')

// 引入头部
$('.public-header').load('/components/PublicHeader.html')
// 引入底部
$('.public-footer').load('/components/PublicFooter.html')

new Swiper('#certify .swiper-container', {
  watchSlidesProgress: true,
  slidesPerView: 'auto',
  centeredSlides: true,
  loop: true,
  loopedSlides: 3,
  autoplay: true,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  on: {
    progress: function (progress) {
      for (let i = 0; i < this.slides.length; i++) {
        var slide = this.slides.eq(i)
        var slideProgress = this.slides[i].progress
        let modify = 1
        if (Math.abs(slideProgress) > 1) {
          modify = (Math.abs(slideProgress) - 1) * 0.3 + 1
        }
        let translate = slideProgress * modify * 430 + 'px'
        let scale = 1 - Math.abs(slideProgress) / 3
        let zIndex = 999 - Math.abs(Math.round(10 * slideProgress))
        slide.transform('translateX(' + translate + ') scale(' + scale + ')')
        slide.css('zIndex', zIndex)
        slide.css('opacity', 1)
        if (Math.abs(slideProgress) > 1) {
          slide.css('opacity', 0)
        }
      }
    },
    setTransition: function (transition) {
      for (var i = 0; i < this.slides.length; i++) {
        var slide = this.slides.eq(i)
        slide.transition(transition)
      }
    },
  },
})
