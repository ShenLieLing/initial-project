window.addEventListener('load',function(){
  //切换
  // 点击“去注册账号”的链接
  $('#link_reg').on('click', function() {
    $('.login-box').hide()
    $('.reg-box').show()
  })

  // 点击“去登录”的链接
  $('#link_login').on('click', function() {
    $('.login-box').show()
    $('.reg-box').hide()
  })

    // 从 layui 中获取 form 对象
    var form = layui.form
    var layer = layui.layer
    //自定义正则表达式
    form.verify({
        //密码验证
        pwd:[ /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格' ],
        //用户名验证
        unm:[ /^[a-zA-Z0-9_-]{4,16}$/, '4到16位字母，数字，下划线，减号'],
        //重复密码验证
        repwd:function(value){
            //获取第一次输入的密码
            let key = $('#form_reg [name = password]').val();
            //进行对比
            if(value !== key){
                console.log(value)
                return '输入的密码不一致'
            }
        }
    });
  
    //注册事件监听
    $('#form_reg').on('submit',function(e){
    // 阻止默认的提交行为
    e.preventDefault()
    // 获取表单数据
    let data = {
        username: $('#reg_uname').val(),
        password: $('#reg_paswd').val()
    }
    $.post('/api/reguser', data,function(re){
        if(re.status !== 0){
            return layer.msg(re.message);
        }
        layer.msg('注册成功')
        //手动跳转至登录页面
        $('#link_login').click();
    })
    });

    //登录监听事件
    $('#form_login').on('submit',function(e){
        // 阻止默认的提交行为
        e.preventDefault()
        //获取表单数据
        let key = $(this).serialize();
        //发起请求
        $.ajax({
            method:'POST',
            url:'/api/login',
            data: key,
            success:function(res){
                if(res.status !== 0){
                    return layer.msg(res.message);
                }
                //如果等于0，就是成功了，需要跳转至首页
                layer.msg(res.message);
                //因为存在一个权限值，记得保存至浏览器
                localStorage.setItem('token', res.token);
                //跳转
                location.href = 'html/index.html'
            }
        });
    })
});