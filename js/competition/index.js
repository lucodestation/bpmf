"use strict";
// 赛事频道
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// 引入头部
$('.public-header').load('/components/PublicHeader.html');
// 引入底部
$('.public-footer').load('/components/PublicFooter.html');
new Vue({
    el: '#app',
    data: function () {
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
        };
    },
    // 过滤器
    filters: {
        // 观看人数
        viewersNumber: function (value) {
            // 例：
            // 20000 20001 返回 2万
            // 21000 返回 2.1万
            // 21500 返回 2.2万
            // 不大于 9999 返回原值
            if (value > 9999) {
                var temp = (value / 10000).toFixed(1);
                if (temp.slice(-1) === '0') {
                    return parseInt(temp) + '万';
                }
                else {
                    return temp + '万';
                }
            }
            return value;
        },
        // 奖金
        bonus: function (value) {
            if (value > 9999 && value % 10000 === 0) {
                return value / 10000 + '万元';
            }
            return value * 1 + '元';
        },
    },
    created: function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                // 加载赛事推荐/精彩推荐
                request({
                    url: '/api/Competitionindex/recomList',
                }).then(function (result) {
                    if (+result.code === 200) {
                        _this.competitionRecommend = result.data;
                    }
                });
                // 加载直播推荐
                request({
                    url: '/api/Live/recomLive',
                    method: 'post',
                    data: {
                        page: 1,
                        pagenum: 3,
                    },
                }).then(function (result) {
                    if (+result.code === 200) {
                        _this.liveRecommend = result.data.data;
                    }
                });
                // 加载激战中赛事
                this._loadFightingCompetition();
                // 加载火热报名中赛事
                this._loadApplyingCompetition();
                // 加载赛事类型列表
                request({
                    url: '/api/Competition/get_category_list',
                }).then(function (result) {
                    if (+result.code === 200) {
                        _this.competitionCateList = result.data;
                    }
                });
                return [2 /*return*/];
            });
        });
    },
    mounted: function () {
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
                progress: function (progress) {
                    for (var i = 0; i < this.slides.length; i++) {
                        var slide = this.slides.eq(i);
                        var slideProgress = this.slides[i].progress;
                        var modify = 1;
                        if (Math.abs(slideProgress) > 1) {
                            modify = (Math.abs(slideProgress) - 1) * 0.3 + 1;
                        }
                        var translate = slideProgress * modify * 430 + 'px';
                        var scale = 1 - Math.abs(slideProgress) / 3;
                        var zIndex = 999 - Math.abs(Math.round(10 * slideProgress));
                        slide.transform('translateX(' + translate + ') scale(' + scale + ')');
                        slide.css('zIndex', zIndex);
                        slide.css('opacity', 1);
                        if (Math.abs(slideProgress) > 1) {
                            slide.css('opacity', 0);
                        }
                    }
                },
                setTransition: function (transition) {
                    for (var i = 0; i < this.slides.length; i++) {
                        var slide = this.slides.eq(i);
                        slide.transition(transition);
                    }
                },
                // 点击轮播图
                click: function (event) {
                    console.log(event.target.dataset);
                },
            },
        });
    },
    methods: {
        // 加载激战中赛事
        _loadFightingCompetition: function (data) {
            var _this = this;
            request({
                url: '/api/Competitionindex/fightingList',
                method: 'post',
                data: data,
            }).then(function (result) {
                if (+result.code === 200) {
                    _this.fightingCompetition = result.data.data;
                }
            });
        },
        // 改变激战中赛事赛事分类
        handleChangeFightingCompetitionCate: function (id) {
            console.log(typeof id, id);
            this.fightingCompetitionCate = id;
            // 加载激战中赛事
            this._loadFightingCompetition({
                category_id: id,
            });
        },
        // 加载火热报名中赛事
        _loadApplyingCompetition: function (data) {
            var _this = this;
            request({
                url: '/api/competition/hot_apply_list',
                method: 'post',
                data: data,
            }).then(function (result) {
                if (+result.code === 200) {
                    _this.applyingCompetition = result.data;
                }
            });
        },
        // 改变火热报名中赛事赛事分类
        handleChangeApplyingCompetitionCate: function (id) {
            console.log(typeof id, id);
            this.applyingCompetitionCate = id;
            // 加载火热报名中赛事
            this._loadApplyingCompetition({
                category_id: id,
            });
        },
    },
});
