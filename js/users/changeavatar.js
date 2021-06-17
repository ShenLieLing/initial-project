window.addEventListener('load',function(){
        //调用layui的方法
        let form = layui.form;
        let layer = layui.layer;
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
     }

    // 1.3 创建裁剪区域
    $image.cropper(options)

       // 为上传按钮绑定点击事件
    $('#btnChooseImage').on('click', function() {
        $('#file_img').click()
    })

     //给文件选择框注册变化事件，及时添加到显示区域
     $('#file_img').on('change',function(e){
        //获取上传的文件
        let key = e.target.files[0];
        //判断无选择图片的情况
        if(key.length === 0){
            return layer.msg('请选择上传图片!')
        }
        //根据选择的文件，创建一个对应的 URL 地址
        let newImgURL = URL.createObjectURL(key)
        //先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`
        $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', newImgURL)  // 重新设置图片路径
        .cropper(options)        // 重新初始化裁剪区域
     });


     //提交上传监听事件
     $('#true_imgchange').on('click',function(e){
        // e.preventDefault();  //阻止默认提交
        //获取base64 格式的图片
        var dataURL = $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 100,
        height: 100
        })
        .toDataURL('image/png')// 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        //调用接口
        $.ajax({
            //此处注意书写
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res){
                if (res.status !== 0){
                    return layer.msg('更换头像失败！')
                };
                layer.msg('更新用户头像成功');
                //更新成功后渲染用户头像
                window.parent.geitinform();
            }
        });
     });

});