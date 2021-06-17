window.addEventListener('load',function(){
    //调用layui的方法
    let form = layui.form;
    let layer = layui.layer;
    //自动义正则表达式
    form.verify({
        //密码长度校验
        pass:[/^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格'],
        //新旧密码重复验证
        repetpwd: function(value){
            if(value === $('[name=oldPwd]').val()) {
                return '新密码与原密码重复！'
            }
        },
        //新密码重复输入验证
        truepwd: function(value){
            if(value !== $('[name=newPwd]').val()){
                return '两次新密码的不一致！'
            }
        }
    });
    //正则表达式注意事项，第一：记好对比的两者，第二：弹出不能用框架带的

    //表单监听提交
    $('#form_pwd').on('submit',function(e){
        e.preventDefault();  //阻止默认提交
        $.ajax({
            method:'POST',
            url:'/my/updatepwd',
            //注意此时需要输入框的name等于接口要求的Name,同名
            data: $(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layer.msg(res.message)
                }
                layer.msg('修改密码成功')
                $('#form_pwd')[0].reset();
            }
        });
    });
});