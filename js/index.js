window.addEventListener('load',function(){
    geitinform(); //渲染头像
    
    //退出
    let layer = layui.layer
    $('#btn_out').on('click',function(e){
        // 阻止默认事件
        e.preventDefault();
        layer.confirm('确认退出么?', {icon: 3, title:'提示'}, function(index){
            //需要清除本地的用户识别码
            localStorage.removeItem('token');
            //跳转到登录页面
            location.href = '../login.html'
            //这是自带的关闭页
            layer.close(index);
          });
    });

    // 激活文章列表的左侧菜单
    function activeArtList() {
    $('.layui-this').removeClass('layui-this')
    $('#art_list').addClass('layui-this')
  }

});

//获取用户信息
function geitinform(){
    let layer = layui.layer
    $.ajax({
        method:'GET',
        url:'/my/userinfo',
        //因为请求的权限接口，需要携带用户的token值，从浏览器本地存储拿 
        success: function(res){
            if(res.status !== 0){
                return layer.msg('获取信息失败!')
            }
            //获取信息成功，渲染页面的头像,调用渲染函数
            //传输的是用户数据部分，而不是整体
            renderuser(res.data);
        }
        //返回成功时调用success，失败是error，但是无论成功与否，都会调用complete
        //因此组织用户未登录就强行进入主页，进行强制退出
        //因为页面获取一开始就执行，但是无论谁执行，都必须检查是否登录
        //所以写在统统接口
    });
};

function renderuser(data){
    //根据返回的数据，接收用户名，以昵称为第一要准，其次是登录名
    let name = data.nickname || data.username
    //将名字渲染到页面上去
    $('#welcome').html('欢迎' + name);
    //判定用户是否有头像图片，不为空渲染图片
    if(data.user_pic !== null){
        $('.text-avatar').hide();
        $('.layui-nav-img').attr('src',data.user_pic).show();;
    }
    else{
        //如果没有图片，渲染文字头像
        $('.layui-nav-img').hide();
        let key = name[0].toUpperCase();
        $('.text-avatar').html(key).show();
        
    }
};