
if(Vue){
    Vue.config.devtools = true
}





/**
 * 分钟倒计时
 * time :  00:15:10  这样的格式
 *
 * */

function lastTime(ele, time, callback) {
    if (!ele) {
        console.log('元素不正确')
        return false
    }
    this.ele = ele;
    this.time = time;
    if (!this.time) {
        return '时间数据不正确'
    }
    var times = time.split(':')
    if (!times) {
        return '时间格式不正确'
    }
    this.h = parseInt(times[0], 10);
    this.m = parseInt(times[1], 10)
    this.s = parseInt(times[2], 10)
    this.callback = callback || function() {}
    this.run();
}

lastTime.prototype.run = function() {
    var self = this;
    var times = '';
    this.sTime = setInterval(function() {
        if (self.h <= 0 && self.m <= 0 && self.s <= 0) {
            clearInterval(self.sTime)
            self.callback()
        } else {

            if (self.s <= 0) {
                self.s = 59;

                if (self.m <= 0) {
                    self.m = 59;
                    if (self.h > 0) {
                        self.h = self.h - 1;
                    } else {
                        self.h = 0;
                        self.m = 0;
                        self.s = 0;
                        clearInterval(self.sTime)
                        self.callback()
                    }
                } else {
                    self.m = self.m - 1;
                }

            } else {
                self.s = self.s - 1;
            }
        }


        if (self.h === 0 && self.m === 0 && self.s === 0) {
            times = '已过期'
            self.callback()
        } else {
            // times  = _two(self.h) + ':' + _two(self.m)+':'+_two(self.s)
            times = _two(self.m) + '分' + _two(self.s) + '秒'
        }

        $(self.ele).html(times)
    }, 1000)

    function _two(n) {
        if (n < 10) {
            n = '0' + n
        }
        return n;

    }

}


/**
 * 获取验证码
 *   new getCode({
        el: '#get-code',
        url: 'xxx.php',
        data: {tel:'123456456'},
    })
 *
 * */


function getCode(option) {
    this.el = option.el;
    if (!this.el && !option.url) {
        return false;
    }
    this.callback = option.callback || function() {};
    this.url = option.url;
    this.data = option.data;
    console.log(this.data)
    this.init();
    this.t = null
}
//初始化
getCode.prototype.init = function() {
        this.Dom = document.querySelector(this.el)
        var code = this.Dom;
        var that = this;
        code.addEventListener('click', function() {

            that.ajax()
        }, false)
    }
    //禁用
getCode.prototype.disabled = function() {
        this.Dom.setAttribute('disabled', 'disabled')
    }
    //启用
getCode.prototype.enabled = function() {
        this.Dom.removeAttribute('disabled')
    }
    //请求数据 
getCode.prototype.last = function() {
    this.disabled();

    var n = 59,
        that = this;
    clearInterval(that.t)
    var msg = '60s重试'
    var dom = this.Dom;
    dom.innerHTML = msg;
    that.t = setInterval(function() {
        if (n > 0) {
            n = parseInt(n) - 1;
            dom.innerHTML = n + 's重试'
        } else {
            clearInterval(that.t)
            n = 59;
            dom.innerHTML = '获取验证码'
            that.enabled();
        }
    }, 1000)

}
getCode.prototype.ajax = function() {
    var that = this;
    var _classList = that.Dom.classList;
    _classList.add('ui-btn-loading');
    if (typeof that.data == 'function') {
        that.data = that.data();
    }
    $.ajax({
        url: that.url,
        data: that.data,
        dataType: 'json',
        type: 'GET',
        success: function(res) {

            _classList.remove('ui-btn-loading')
            if (res.code === 40000) {
                that.last();
                that.callback(res);
            }

            layer.open({
                skin: 'msg',
                content: JSON.stringify(res),
                time: 3
            })
        },
        timeout: 10000,
        error: function(err) {
            _classList.remove('ui-btn-loading')
            console.log(err)
            layer.open({
                skin: 'msg',
                content: '请求出错' + err.status,
                time: 3
            })
        }

    })

}