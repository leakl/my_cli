/**
 * 上传图片 
 * new upload({
 *    type:'multi',
 * })
 */


window.Upload = function(option) {
    this.type = option.type;
    this.el = option.el;
    this.cb = option.success || function() {};
    this.loading = option.loading || function() {};
    this.uploadUrl = option.uploadUrl || '';
    this.data = option.data || {};
    this.error = option.error || function() {};

    if (!this.el || !this.uploadUrl) {
        return false;
    } else {
        var _el = document.querySelector(this.el);
        this.elID = _el.id;
        this.init();
    }

}


window.Upload.prototype.init = function() {
    var that = this;
    document.body.addEventListener('click', function(e) {
        if (e && e.target && e.target.id == that.elID) {
            e.target.value = '';
        }
    })
    document.body.addEventListener('change', function(e) {
        if (e && e.target && e.target.id == that.elID) {
            var target = e.target;
            lrz(target.files[0])
                .then(function(rst) {
                    // 处理成功会执行
                    // console.log(rst);
                    that.loading()

                    return rst;
                })
                .then(function(rst) {
                    // 这里该上传给后端啦

                    /* ==================================================== */
                    // 原生ajax上传代码，所以看起来特别多 ╮(╯_╰)╭，但绝对能用
                    // 其他框架，例如jQuery处理formData略有不同，请自行google，baidu。
                    var xhr = new XMLHttpRequest();
                    // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                    xhr.open('POST', that.uploadUrl);

                    xhr.onload = function() {

                        if (xhr.status === 200) {
                            // 上传成功
                            var json = JSON.parse(xhr.responseText);
                            if (json.code == 40000) {
                                that.cb(json)
                            } else {
                                that.error(json.code + ',' + xhr.status)
                            }



                        } else {
                            // 处理其他情况
                            that.error('连接失败' + xhr.status)

                        }
                    };

                    xhr.onerror = function(err) {
                        console.log()
                            // 处理错误
                    };

                    xhr.upload.onprogress = function(e) {
                        // 上传进度
                        var percentComplete = ((e.loaded / e.total) || 0) * 100;
                    };

                    // 添加参数
                    rst.formData.append('fileLen', rst.fileLen);

                    for (i in that.data) {
                        rst.formData.append(i, that.data[i]);
                    }



                    // 触发上传
                    xhr.send(rst.formData);
                    /* ==================================================== */

                    return rst;
                })
                .catch(function(err) {
                    // 处理失败会执行
                    cosnole.log(3333, err)
                })
                .always(function(e) {
                    cosnole.log(3333, e)
                        // 不管是成功失败，都会执行

                });
        }


    }, false);


}

// window.Upload.prototype.post = function(base64) {
//     this.cb(base64)


// }