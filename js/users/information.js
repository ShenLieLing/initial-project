window.addEventListener('load',function(){
    // 验证的表达式
    let form = layui.form
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
    //获取用户信息并赋值给表单
function geitinformdata(){
    //一定要调出框架的用法，不然快速赋值会报错
    let form = layui.form

    $.ajax({
        method:'GET',
        url:'/my/userinfo',
        //因为请求的权限接口，需要携带用户的token值，从浏览器本地存储拿 
        success: function(res){
            if(res.status !== 0){
                return layer.msg('获取信息失败!')
            }
            //给表单加上lay-filter="formUserInfo"，然后快速赋值
            form.val('formUserInfo',res.data)

        }
    });
};

//赋值给表单
geitinformdata();


//表单重置
$('#btnReset').on('click',function(e){
    // 阻止默认事件
    e.preventDefault();
    //重置的本质就是重新渲染原有的东西
    geitinformdata();
});


//提交修改
//监听表单的提交时间
$('.layui-form').on('submit',function(e){
    // 阻止默认事件
    //一定要阻止表单的默认提交行为
    e.preventDefault();
    $.ajax({
        method:'POST',
        url:'/my/userinfo',
        //权限申请，自动添加头部
        data: $(this).serialize(),
        success:function(res){
            if(res.status !== 0){
                return layer.msg('提交失败')
            }
            //如果成功了，就要重新渲染页面头像
            window.parent.geitinform();
        }
    });
});

});

