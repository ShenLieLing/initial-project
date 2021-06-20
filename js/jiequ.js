// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象

  $.ajaxPrefilter(function(options) {
    // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
    // options.url = 'http://www.liulongbin.top:3007' + options.url
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url

    //如果url地址存在MY，就是存在权限接口，就要添加一个发送头，携带本地的用户识别码
    if(options.url.indexOf('/my/') !== -1){ //不等于-1，说明存在MY字段
      options.headers = {Authorization: localStorage.getItem('token') || ''}
    }

    //未进行认证，禁止登录首页，通过调用complete
    options.complete = function(res){
      // console.log(res)
      // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
      if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //清空本地识别码
        //需要清除本地的用户识别码
          localStorage.removeItem('token');
        //跳转到登录页面
          location.href = '../login.html'
      }
    }
  })
