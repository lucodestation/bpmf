; (function ($) {
  $.fn.calendar = function (options) {
    return this.each(function () {
      if (!$.data(this, 'calendar')) {
        $.data(this, 'calendar', new Calendar(this, options));
      }
    });
  };
  var defaults = {
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth(),
    currentDay: new Date().getDate(),
    date: new Date(),
  };

  function Calendar (element, options) {
    this.element = element;
    this.options = $.extend({
      defaultDate: '',//接收一个默认时间参数
      eventData: '',//接收事件参数,优先直接得到数据，如果没有传入eventData，则使用url
      headerHeight: '60px',//表格头部高度
      dialogMethod: 'all',//查看事件详情的方式，默认为点击日期框查看全部
      themes: '',//设置颜色主体
      params: {},//获取数据时需要上传的参数
      url: '',//获取数据的地址
      method: 'post',//获取数据的方式
    }, defaults, options);
    this._defaults = defaults;
    this.init();
  }

  Calendar.prototype = {
    init: function () {
      var self = this;
      var div = document.createElement("div");
      div.className = 'ca_date top_center';
      div.id = 'ca_date';
      div.innerHTML = '<div class="ca_header flex flex-center flex-item-center f-18">' +
        // '<div class="ca_nian"> '+
        //     // '<a id="ca_nian_jia" class="ca_jia">+</a>'+
        //
        //     // '<a id="ca_nian_jian" class="ca_jian">-</a>'+
        // '</div> '+
        // '<div class="ca_yue"> '+
        '<a id="ca_yue_jian" class="ca_jian"><img src="/images/icon-l.png"></a> ' +
        // '<div>'+
        '<span id="ca_year" class="ca_nian">2017</span>' +
        '<span>年</span>' +
        // '</div> '+
        //                     '<div>'+
        '<span id="ca_month" class="ca_yue">12</span>' +
        '<span>月</span>' +
        // '</div> '+
        '<a id="ca_yue_jia" class="ca_jia"><img src="/images/icon-r.png"></a> ' +
        // '</div> '+
        '</div> ' +
        '<div class="ca_table"> ' +
        '<div class="ca_thead"> ' +
        '<div class="ca_clearfix">' +
        '<span>日</span> <span>一</span> <span>二</span> <span>三</span> <span>四</span> <span>五</span> <span>六</span> ' +
        '</div>' +
        '</div>' +
        '<div class="ca_tbody"> ' +
        '<div class="ca_clearfix"> ' +
        '<span></span><span></span> <span></span> <span></span> <span></span> <span></span> <span></span> ' +
        '</div>' +
        '<div class="ca_clearfix">' +
        '<span></span><span></span> <span></span> <span></span> <span></span> <span></span> <span></span> ' +
        '</div> ' +
        '<div class="ca_clearfix">' +
        '<span></span> <span></span><span></span> <span></span> <span></span> <span></span> <span></span> ' +
        '</div> ' +
        '<div class="ca_clearfix"> ' +
        '<span></span> <span></span> <span></span><span></span> <span></span> <span></span> <span></span>' +
        '</div> ' +
        '<div class="ca_clearfix"> ' +
        '<span></span> <span></span> <span></span><span></span> <span></span> <span></span> <span></span>' +
        '</div> ' +
        '<div class="ca_clearfix">' +
        '<span></span> <span></span> <span></span> <span></span> <span></span> <span></span><span></span>' +
        '</div>' +
        '</div>' +
        '</div>';
      $(this.element).append(div);
      //对默认时间作处理
      if (this.options.defaultDate) {
        var d = this.options.defaultDate;
        this.options.currentYear = new Date(d).getFullYear();
        this.options.currentMonth = new Date(d).getMonth();
        this.options.currentDay = new Date(d).getDate();
      }
      $('#ca_year').html(this.options.currentYear);
      $('#ca_month').html(this.options.currentMonth + 1);
      this.setCss();
      window.onresize = function () {
        self.setCss();
      };
      this.bindEvent();
      this.bindTap();

    },
    //设置样式
    setCss: function () {
      var self = this;
      var width = $('.ca_tbody span').width();
      var margin = $('.ca_tbody span').width() * 0.049;
      $('.ca_thead span').css({ 'height': self.options.headerHeight, 'line-height': self.options.headerHeight });
      $('.ca_tbody>div>span').css({ 'height': '45px' });
      $('.ca_tbody>div>span>a').css({ 'height': '30px', 'line-height': '30px' });
      $('.ca_tbody span').each(function (index, element) {
        if (element.innerHTML == '') {
          this.style.background = 'rgba(0,0,0,0)';
        } else {
          if (this.className.indexOf('notEmpty') < 0) {
            this.className += ' ' + 'notEmpty ';
          }
        }
      });
    },
    //给日期绑定事件
    bindEvent: function (y, m) {
      var self = this;
      var year, month, day;
      if (y != undefined && m != undefined) {
        year = y;
        month = parseInt(m);
      } else {
        year = this.options.currentYear;
        month = this.options.currentMonth;
      }
      day = this.options.currentDay;
      this.getCalendar(year, month);
      //当用户传入了事件数据时,对事件做处理
      if (this.options.eventData) {
        if (this.options.eventData.length > 0) {
          self.displayEvent(year, month, this.options.eventData);
        }
      } else if (this.options.url != '') {
        $.ajax({
          url: self.options.url,
          method: self.options.method,
          type: self.options.method,
          dataType: 'json',
          data: $.extend({ year: year, month: month }, self.options.params),
          success: function (res) {
            var eventData;
            res.length ? eventData = res : '';
            res.data.length ? eventData = res.data : '';
            res.data.Rows.length ? eventData = res.data.Rows : '';
            if (eventData) {
              self.displayEvent(year, month, eventData);
            }
          }
        })
      }
    },
    displayEvent: function (year, month, data) {
      for (var i = 0, len = data.length; i < len; i++) {
        var dateStr = data[i].date || data[i].startDate || ''
        if (!dateStr) {
          throw new Error('传入数据有误')
        }
        var date = new Date(dateStr);//因项目需求，接受两种情况下的事件时间：开始时间和当天时间
        var day = date.getDate();
        if (year == date.getFullYear() && month == date.getMonth()) {//当年份和月份能匹配上时在日历板上添加数据
          //此处预计做成两种查看事件的方式,时间关系只写一个
          var eventDiv = '<div class="ca_event">' + data[i].name + '</div>';
          $('.ca_day_' + day).find('.ca_event_div').append(eventDiv);
        }
      }
    },
    bindTap: function () {
      var self = this;
      var nian = document.getElementById('ca_year');
      var yue = document.getElementById('ca_month');
      $('.ca_tbody').on('click', 'span', function () {
        if (this.innerText == '') {
          return;
        }
        try {
          tapelement.classList.remove('choose');
        } catch (e) {
        }
        this.classList.add('choose');
        //self.showOrg(this.innerText);
        tapelement = this;
      });
      $('.ca_header').on('click', '.ca_jia,.ca_jian', function () {
        switch (this.id) {
          case 'ca_nian_jia':
            nian.innerText++;
            self.bindEvent(nian.innerText, parseInt(yue.innerText) - 1);
            break;
          case 'ca_nian_jian':
            nian.innerText--;
            self.bindEvent(nian.innerText, parseInt(yue.innerText) - 1);
            break;
          case 'ca_yue_jia':
            if (yue.innerText == 12) {
              nian.innerText++;
              yue.innerText = 1;
            } else {
              yue.innerText++;
            }
            self.bindEvent(nian.innerText, parseInt(yue.innerText) - 1);
            break;
          case 'ca_yue_jian':
            if (yue.innerText == 1) {
              nian.innerText--;
              yue.innerText = 12;
            } else {
              yue.innerText--;
            }
            self.bindEvent(nian.innerText, parseInt(yue.innerText) - 1);
            break;
          default:
            break;
        }
      });
    },
    getCalendar: function (year, month) {
      var self = this;
      month = month + 1;
      var daysNum = this.getDaynum(year, month);
      var week = new Date(year + '/' + month + '/1').getDay();
      var current_day = 0;
      $('.ca_tbody>div>span').each(function (index, element) {
        if (index >= week && current_day < daysNum) {//从week开始排
          current_day++;
          element.innerHTML = '<a>' + current_day + '</a><div class="ca_event_div"></div>';//给每个框里加入日期
          element.className = 'ca_day_' + current_day;//设置class以便加入事件
          if (year == self.options.currentYear && month == self.options.currentMonth && current_day == self.options.currentDay) {
            element.classList.add('choose');
          } else {
            element.className = 'ca_day_' + current_day;
          }
          var curr = new Date();
          if (year == curr.getFullYear() && month - 1 == curr.getMonth() && current_day == curr.getDate()) {
            element.classList.add('light');
          }
        } else {
          element.className = '';
          element.innerText = '';
        }
      });
    },
    getDaynum: function (year, month) {
      var tianShu;
      if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
        tianShu = 31;
      } else if (month != 2) {
        tianShu = 30;
      } else {
        if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
          tianShu = 29;
        } else {
          tianShu = 28;
        }
      }
      return tianShu;
    },
  };

})(jQuery);
