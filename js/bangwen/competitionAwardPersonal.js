"use strict";
// 发布比赛个人赛赛事奖励
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
// 引入头部
$('.public-header').load('/components/PublicHeader.html');
// 引入底部
$('.public-footer').load('/components/PublicFooter.html');
var encrypt = new JSEncrypt();
//公钥.
var publiukey = '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCSjs8JJr/Nyb+nOG77agUDf7uTc+kswdVEXbU8v5EL98brAw7fu4dQc1vkh1KSXqiC9EC7YmJzkkFoXUzTH2pvvDlqUuCwtdmXOsq/b1JWKyEXzQlPIiwdHnAUjGbmHOEMAY3jKEy2dY2I6J+giJqo8B2HNoR+zv3KaEmPSHtooQIDAQAB-----END PUBLIC KEY-----';
new Vue({
    el: '#app',
    data: function () {
        return {
            competitionId: '',
            formData: {
                competition_id: '',
                award_type: 1,
                champion_num: '',
                champion_money: '',
                runner_up_num: '',
                runner_up_money: '',
                third_winner_num: '',
                third_winner_money: '',
                memo: '',
                total_money: 0,
                trusteeship: '',
                pay_way: '', // trusteeship=1的时候传此参数，1=我的钱包，2=支付宝，3=微信
            },
            // 冠军奖金
            championAward: 0,
            // 亚军奖金
            runnerUpAward: 0,
            // 季军奖金
            thirdWinnerAward: 0,
        };
    },
    created: function () {
        var searchParams = Qs.parse(location.search.substr(1));
        this.competitionId = searchParams.competition_id * 1;
        this.formData.competition_id = searchParams.competition_id * 1;
    },
    computed: {
        champion: function () {
            return { num: this.formData.champion_num, money: this.formData.champion_money };
        },
        runnerUp: function () {
            return { num: this.formData.runner_up_num, money: this.formData.runner_up_money };
        },
        thirdWinner: function () {
            return { num: this.formData.third_winner_num, money: this.formData.third_winner_money };
        },
    },
    watch: {
        champion: function (newValue) {
            if (newValue.num > 0 && newValue.money > 0 && parseInt(newValue.num) === newValue.num && parseInt(newValue.money) === newValue.money) {
                // 都是正整数
                this.championAward = newValue.num * newValue.money;
            }
            else {
                this.championAward = 0;
            }
            this.formData.total_money = this.championAward + this.runnerUpAward + this.thirdWinnerAward;
        },
        runnerUp: function (newValue) {
            if (newValue.num > 0 && newValue.money > 0 && parseInt(newValue.num) === newValue.num && parseInt(newValue.money) === newValue.money) {
                // 都是正整数
                this.runnerUpAward = newValue.num * newValue.money;
            }
            else {
                this.runnerUpAward = 0;
            }
            this.formData.total_money = this.championAward + this.runnerUpAward + this.thirdWinnerAward;
        },
        thirdWinner: function (newValue) {
            if (newValue.num > 0 && newValue.money > 0 && parseInt(newValue.num) === newValue.num && parseInt(newValue.money) === newValue.money) {
                // 都是正整数
                this.thirdWinnerAward = newValue.num * newValue.money;
            }
            else {
                this.thirdWinnerAward = 0;
            }
            this.formData.total_money = this.championAward + this.runnerUpAward + this.thirdWinnerAward;
        },
    },
    methods: {
        // 测试
        handleTest: function () {
            console.log('测试');
        },
        // 验证要提交的数据
        _validateFormData: function () {
            var arr = [];
            arr.push({ label: '请输入冠军数量', validate: !this.formData.champion_num }, { label: '数量必须是大于 0 的整数', validate: this.formData.champion_num < 0 || parseInt(this.formData.champion_num) < this.formData.champion_num }, { label: '请输入冠军奖励金额', validate: !this.formData.champion_money }, { label: '奖励金额必须是大于 0 的整数', validate: this.formData.champion_money < 0 || parseInt(this.formData.champion_money) < this.formData.champion_money }, { label: '请输入亚军数量', validate: !this.formData.runner_up_num }, { label: '数量必须是大于 0 的整数', validate: this.formData.runner_up_num < 0 || parseInt(this.formData.runner_up_num) < this.formData.runner_up_num }, { label: '请输入亚军奖励金额', validate: !this.formData.runner_up_money }, { label: '奖励金额必须是大于 0 的整数', validate: this.formData.runner_up_money < 0 || parseInt(this.formData.runner_up_money) < this.formData.runner_up_money }, { label: '请输入季军数量', validate: !this.formData.third_winner_num }, { label: '数量必须是大于 0 的整数', validate: this.formData.third_winner_num < 0 || parseInt(this.formData.third_winner_num) < this.formData.third_winner_num }, { label: '请输入季军奖励金额', validate: !this.formData.third_winner_money }, { label: '奖励金额必须是大于 0 的整数', validate: this.formData.third_winner_money < 0 || parseInt(this.formData.third_winner_money) < this.formData.third_winner_money }, { label: '请选择奖金托管方式', validate: !this.formData.trusteeship });
            if (this.formData.trusteeship === 1) {
                arr.push({ label: '请选择支付方式', validate: !this.formData.pay_way });
            }
            var errorArr = arr.filter(function (item) { return item.validate; });
            if (errorArr.length) {
                layer.msg(errorArr[0].label);
            }
            else {
                return true;
            }
        },
        // 下一步
        handleNextStep: function () {
            var _this = this;
            // 校验数据
            if (!this._validateFormData())
                return;
            console.table(__assign({}, this.formData));
            // 加载中
            var loadingIndex = layer.load(1, {
                shade: [0.5, '#000'], // 0.1透明度的白色背景
            });
            request({
                url: '/api/competition/push_award',
                method: 'post',
                data: this.formData,
            })
                .then(function (result) {
                layer.close(loadingIndex);
                console.log(result);
                if (result.code === 200) {
                    // 发布成功
                    console.log('发布成功');
                    // 跳转到个人赛发布赛事成功页面
                    location.href = "/bangwen/releaseCompetitionSuccess.html?competition_id=".concat(_this.competitionId);
                }
                else if (result.code === 201) {
                    // 发布次数不足，跳转购买会员页面
                    console.log('发布次数不足，跳转购买会员页面');
                    layer.msg(result.msg);
                }
                else if (result.code === 202) {
                    // 错误信息
                    console.log('错误信息');
                    layer.msg(result.msg);
                }
                else if (result.code === 203) {
                    // 未绑定手机号
                    console.log('未绑定手机号');
                    layer.msg(result.msg);
                }
                else if (result.code === 205) {
                    // 余额不足
                    console.log('余额不足');
                    layer.msg(result.msg);
                }
                else if (result.code === 206) {
                    // 未交保证金
                    console.log('未交保证金');
                    layer.msg(result.msg);
                    syalert.syopen('bondCont');
                }
                else if (result.code === 207) {
                    // 未实名认证
                    console.log('未实名认证');
                    layer.msg(result.msg);
                }
                else if (result.code === 208) {
                    // 未设置支付密码
                    console.log('未设置支付密码');
                    layer.msg(result.msg);
                }
            })
                .catch(function (error) {
                console.log(error);
                layer.close(loadingIndex);
            });
        },
    },
});
