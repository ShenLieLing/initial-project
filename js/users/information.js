window.addEventListener('load',function(){
    // 验证的表达式
    var form = layui.form
    var layer = layui.layer
  
    form.verify({
        // 昵称的正则表达式
      nickname: function(value) {
        if (value.length > 6) {
          return '昵称长度必须在 1 ~ 6 个字符之间！'
        }
      },
      nikename:[/^[a-zA-Z0-9_-]{4,16}$/,'4到16位字母，数字，下划线，减号']
      //邮箱有框架自带的验证方法
    });






});

//获取用户信息
