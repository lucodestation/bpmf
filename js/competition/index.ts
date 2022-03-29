// 赛事频道

// 引入头部
$('.public-header').load('/components/PublicHeader.html')
// 引入底部
$('.public-footer').load('/components/PublicFooter.html')

new Vue({
  el: '#app',
  data() {
    return {
      // 赛事推荐/精彩推荐
      competitionRecommend: {},
      // 直播推荐
      liveRecommend: {},
      // 赛事类型列表
      competitionCateList: [],

      // 激战中赛事
      fightingCompetition: [],
      // 激战中赛事分类 id
      fightingCompetitionCate: '',

      // 火热报名中赛事
      applyingCompetition: [],
      // 火热报名中赛事分类 id
      applyingCompetitionCate: '',
    }
  },
  // 过滤器
  filters: {
    // 观看人数
    viewersNumber(value) {
      // 例：
      // 20000 20001 返回 2万
      // 21000 返回 2.1万
      // 21500 返回 2.2万
      // 不大于 9999 返回原值
      if (value > 9999) {
        const temp = (value / 10000).toFixed(1)
        if (temp.slice(-1) === '0') {
          return parseInt(temp) + '万'
        } else {
          return temp + '万'
        }
      }
      return value
    },
    // 奖金
    bonus(value) {
      if (value > 9999 && value % 10000 === 0) {
        return value / 10000 + '万元'
      }
      return value * 1 + '元'
    },
  },
  async created() {
    // 加载赛事推荐/精彩推荐
    request({
      url: '/api/Competitionindex/recomList',
    }).then((result) => {
      if (+result.code === 200) {
        this.competitionRecommend = result.data
      }
    })

    // 加载直播推荐
    request({
      url: '/api/Live/recomLive',
      method: 'post', // 警告：这里如果用 GET 方式请求数据，pagenum 参数不生效
      data: {
        page: 1,
        pagenum: 3,
      },
    }).then((result) => {
      if (+result.code === 200) {
        this.liveRecommend = result.data.data
      }
    })

    // 加载激战中赛事
    this._loadFightingCompetition()
    // 加载火热报名中赛事
    this._loadApplyingCompetition()

    // 加载赛事类型列表
    request({
      url: '/api/Competition/get_category_list',
    }).then((result) => {
      if (+result.code === 200) {
        this.competitionCateList = result.data
      }
    })
  },
  mounted() {
    // 轮播图
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
        progress(progress) {
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
        setTransition(transition) {
          for (var i = 0; i < this.slides.length; i++) {
            var slide = this.slides.eq(i)
            slide.transition(transition)
          }
        },
        // 点击轮播图
        click: function (event) {
          console.log(event.target.dataset)
        },
      },
    })
  },
  methods: {
    // 加载激战中赛事
    _loadFightingCompetition(data) {
      request({
        url: '/api/Competitionindex/fightingList',
        method: 'post',
        data,
      }).then((result) => {
        if (+result.code === 200) {
          this.fightingCompetition = result.data.data
        }
      })
    },
    // 改变激战中赛事赛事分类
    handleChangeFightingCompetitionCate(id) {
      console.log(typeof id, id)
      this.fightingCompetitionCate = id
      // 加载激战中赛事
      this._loadFightingCompetition({
        category_id: id,
      })
    },
    // 加载火热报名中赛事
    _loadApplyingCompetition(data) {
      request({
        url: '/api/competition/hot_apply_list',
        method: 'post',
        data,
      }).then((result) => {
        if (+result.code === 200) {
          this.applyingCompetition = result.data
        }
      })
    },
    // 改变火热报名中赛事赛事分类
    handleChangeApplyingCompetitionCate(id) {
      console.log(typeof id, id)
      this.applyingCompetitionCate = id
      // 加载火热报名中赛事
      this._loadApplyingCompetition({
        category_id: id,
      })
    },
  },
})
