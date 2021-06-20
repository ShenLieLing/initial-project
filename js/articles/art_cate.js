window.addEventListener('load',function(){
    //调用layui的方法
    let form = layui.form;
    let layer = layui.layer;
    //获取文章数据
    function getdatakist(){
        $.ajax({
            method:'GET',
            url:'/my/cate/list',
            success: function(res){
                if(res.code !== 0){
                    return '列表获取失败'
                }
                //传到模板里
                let listhtml = template('cate_list',res);
                $('#list_body').html(listhtml);
            }
        });
    };
    //调用接口
    getdatakist();

    //类别添加弹出层
    let addindex = null;
    $('#btn_addlist').on('click',function(){
        //点击后弹出增加框，采用layer open()
        addindex = layer.open({
            type: 1,
            area:['500px','230px'],
            title:'添加文章类别',
            // 添加的架构用页面模板
            content: $('#addlist').html()
          })
          //拿到的index是一个重要的凭据，它是诸如layer.close(index)等方法的必传参数。  

    });

    //因为弹出层是动态的，所以这里用事件委托
    $('body').on('submit','#form-add',function(e){
        e.preventDefault();  //阻止默认提交
        //发起添加请求
        $.ajax({
            method:'POST',
            url:'/my/cate/add',
            data: $(this).serialize(),
            success: function(res){
            // if(res.code !== 0){
            //     return layer.msg(res.message)
            // }
            //添加完成后就关闭弹出窗口，渲染页面
            layer.msg(res.message)
            layer.close(addindex);
            getdatakist();
            }
        });
    });


    //文章列表编辑
    //同样因为是动态添加，所以采用的是事件委托
    let editindex =null
    $('#list_body').on('click','.btn-edit',function(){
        //点击后弹出编辑修改
        editindex = layer.open({
            type: 1,
            area:['500px','230px'],
            title:'修改文章类别',
            // 添加的架构用页面模板
            content: $('#editlist').html()
          })
          //拿到的index是一个重要的凭据，它是诸如layer.close(index)等方法的必传参数。  

          //将当前ID条目的数据传给列表
          //因为编辑按钮身上，带有自动义的ID属性,取到了条目的ID
          let id = $(this).attr('data-id');
          //根据 Id 获取文章分类数据
          $.ajax({
              method:'GET',
              url:'/my/cate/info',
              data: {
                id: id
              },
              success:function(res){
                  //将获取的数据快速填充到表单
                  form.val('edit_data',res.data)
                  //设置了隐藏表单接收ID
              }              
          });
    });

    //监听更新数据
    // 通过代理的形式，为修改分类的表单绑定 submit 事件
    $('body').on('submit', '#form-edit', function(e) {
        console.log($(this).serialize())
    e.preventDefault()
    $.ajax({
      method: 'PUT',
      url: '/my/cate/info',
      //此处name要和传参的命名一样，ID有隐藏框接收反馈
      data: $(this).serialize(),
      success: function(res) {
        if (res.code !== 0) {
          return layer.msg(res.message)
        }
        layer.msg(res.message)
        layer.close(editindex) //关闭编辑弹窗
        getdatakist(); //渲染页面
      }
    })
    })


    //监听删除该条数据
    $('#list_body').on('click','.btn-delete',function(){
    //获取删除行的ID
    let id  = $(this).attr('data-id')
    //根据 Id 删除文章分类
    layer.confirm('是否删除?', {icon: 3, title:'提示'}, function(index){
        $.ajax({
            method:'DELETE',
            url:'/my/cate/del?id=' + id,
            success: function(res){
                if(res.code !== 0){
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                getdatakist();
            }
        }); 
        layer.close(index);
      });
    });


});