window.addEventListener('load',function(){
    //调用layui的方法
    let form = layui.form;
    let layer = layui.layer;

    layui.form.verify({
        title: [/^.{1,30}$/, '文章标题的长度为 1-30 个字符串！']
    });
    
    //获取文章分类下拉框
    function getreleaselist() {
        $.ajax({
            method: 'GET',
            url: '/my/cate/list',
            success: function (res) {
            if (res.code !== 0) {
                return layer.msg(res.message)
            }

            let relhtml = template('form_releaselist', res);
            $('[name=cate_id]').html(relhtml);

            // 为编辑器中的 select 设置 lay-ignore 属性
            $('.my-editor select').attr('lay-ignore', '')

            form.render(); //因为layui的异步加载机制，无法更新，所以调用这个方法

            // 隐藏编辑器中的下拉菜单
            $('.my-editor select').css('display', 'none')
            }
        });
    }
    // 调用选择下拉菜单的方法
    getreleaselist();

        // 工具栏的配置项 暂时用不到
        const toolbarOptions = [
            ['bold', 'italic', 'underline', 'strike', 'image'], // toggled buttons
            ['blockquote', 'code-block'],
        
            [{ header: 1 }, { header: 2 }], // custom button values
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
            [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
            [{ direction: 'rtl' }], // text direction
        
            [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
        
            [{ color: [] }, { background: [] }], // dropdown with defaults from theme
            [{ font: [] }],
            [{ align: [] }],
        
            ['clean'] // remove formatting button
          ]

          // 创建富文本编辑器
          var quill = new Quill('#editor', {
            // 指定主题
            theme: 'snow',
            // 指定模块
            modules: {
              toolbar: toolbarOptions
            }
          })


    // 富文本编辑区，建议文档步骤填充
    // 初始化富文本编辑器
    // initEditor();



    // 文章封面编辑区，文档
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 300,
        preview: '.img-preview',
        viewMode: 2
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 4. 选择图片按钮的展示和触发
    $('#btn_imagech').on('click',function(e){
        //隐晦的点击选择文件按钮
        $('#file_imgch').click();
    });

    //此时应该监听上传文件的变化事件
    $('#file_imgch').on('change',function(e){
        //通过E的信息集成,拿到上传文件
        let file = e.target.files
        //判断用户是否选择了文件
        if(file.length === 0){
            return layer.msg('请选择文件!')
        }
        //转化为URL地址
        let newImgURL = URL.createObjectURL(file[0]);
        //`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    });

    // 设定文件状态预设值
    let states = null;
    //若点击存为草稿就更改状态
    $('#btn_release').on('click', function () {
        states = '已发布'
      })
    $('#btn_draft').on('click', function () {
        states = '草稿'
    })


    //监听提交事件
    $('#writing').on('submit',function(e){
        e.preventDefault();  //阻止默认提交
        //追加图片地址
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                //提交数据要求是formdata格式
                //基于 form 表单，快速创建一个 FormData 对象,因为是原生JS,所以转化为DOM节点
                const formd = new FormData($('#writing')[0]);
                formd.append('content', quill.root.innerHTML)
                formd.append('cover_img',blob)
                //追加状态值
                formd.append('state',states);
                //此时formdata数据格式的数据全部存在于formmd
                //发起请求
                pubaticle(formd);
            });
    });

    //发表文章请求
    function pubaticle(datas){
        $.ajax({
            method:'POST',
            url:'/my/article/add',
            data: datas,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,

            success: function(res){
                if (res.code !== 0) {
                    return layer.msg(res.message)
                }
            layer.msg(res.message)
            // 发布文章成功后，跳转到文章列表页面
            location.href = '../../html/articles/art_list.html'
            // 让文章列表被高亮展示
            window.parent.activeArtList()
            }
        })
    }



});