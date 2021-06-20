window.addEventListener('load',function(){
    //调用layui的方法
    let form = layui.form;
    let layer = layui.layer;
    let laypage = layui.laypage; //分页调用方法

    // 模拟查询数据
    let simulation = {
        pagenum: 1, // 页码值
        pagesize: 2,// 每页显示几条数据
        cate_id: '',// 分类 id
        state:''// 发布状态
    };
    
    //获取文章的列表数据
    function getlistdata(){
        $.ajax({
            method:'GET',
            url:'/my/article/list',
            data: simulation,
            success: function(res){
                if(res.code !== 0){
                    return layer.msg(res.message)
                }
                console.log(res)
                let listhtml = template('body_listdata',res);
                $('#datalist').html(listhtml);

                //渲染完数据，调用渲染分页,返回的总条数为total
                getpagelist(res.total);
            }
        });
    };
    //调用获取文章列表数据
    getlistdata();

    // //模板引擎——美化事件过滤器
    // template.defaults.imports.DataFormat = function(value){
    //     const times = new Data(value);
    //     var y = times.getFullYear();
    //     var m = padZero(times.getMonth() + 1);
    //     var d = padZero(times.getDate());
    
    //     var hh = padZero(times.getHours());
    //     var mm = padZero(times.getMinutes());
    //     var ss = padZero(times.getSeconds());
    
    //     return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    // };

    //   // 定义补零的函数
    // function padZero(n) {
    //     return n > 9 ? n : '0' + n;
    // }
    template.defaults.imports.DataFormat = function (dtStr) {
        const dt = new Date(dtStr)
    
        const y = dt.getFullYear()
        const m = (dt.getMonth() + 1).toString().padStart(2, '0')
        const d = dt.getDate().toString().padStart(2, '0')
    
        const hh = dt.getHours().toString().padStart(2, '0')
        const mm = dt.getHours().toString().padStart(2, '0')
        const ss = dt.getSeconds().toString().padStart(2, '0')
    
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
      }
    //筛选区查询

    //获取文章分类
    function getartlist(){
        $.ajax({
            method:'GET',
            url:'/my/cate/list',
            success: function(res){
                if(res.code !== 0){
                    return layer.msg(res.message)
                }
                
                let selhtml = template('form_sel',res);
                $('[name=cate_id]').html(selhtml);
                form.render(); //因为layui的异步加载机制，无法更新，所以调用这个方法
            }
        });

    }
    // 调用选择下拉菜单的方法
    getartlist();

    //监听筛选提交事件
    $('#form-search').on('submit',function(e){
        e.preventDefault();  //阻止默认提交
        //其实就是重新赋值源数据的分类和状态，然后再去渲染数据
        simulation.pagenum = 1;
        simulation.cate_id = $('[name=cate_id]').val();
        simulation.state = $('[name=state]').val();
        //重新渲染
        getlistdata();
    });
    // 监听重置按钮的点击事件
    $('button[type="reset"]').on('click', function (e) {
    // 重置查询参数对象
    // 模拟查询数据
    simulation = {
        pagenum: 1, // 页码值
        pagesize: 2,// 每页显示几条数据
        cate_id: '',// 分类 id
        state:''// 发布状态
    };
    
        // 重新发起请求，获取列表数据
        getlistdata();
    });


    //文章快捷删除
    //动态添加的删除按钮，因此采用事件委托
    $('#datalist').on('click','.btn-listdelete',function(){
        //获取删除条目的ID
        let id = $(this).attr('data-id');
        // //获取页面删除的按钮数，当按钮数为1时，说明当前页没数据了，需要跳转上一页渲染
        // let len = $('.btn-listdelete').length;
        //弹出询问框
        layer.confirm('确定删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method: 'DELETE',
                url: '/my/article/info?id=' + id,
                success: function(res) {
                  if (res.code !== 0) {
                    return layer.msg(res.message)
                  }
                  layer.msg(res.message)
                  // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                  // 如果没有剩余的数据了,则让页码值 -1 之后,
                  // 再重新调用 渲染 方法
                //   if (len === 1) {
                //     // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                //     // 页码值最小必须是 1
                //     simulation.pagenum = simulation.pagenum === 1 ? 1 : simulation.pagenum - 1
                //   }
                    // 判断页码值是否需要自动 -1
                    if (simulation.pagenum > 1 && $('tbody tr').length === 1) {
                        simulation.pagenum--
                    }
                  getlistdata();
                }
            });
            //关闭弹窗
            layer.close(index);
          });
    });
    // 为文章标题的链接添加点击事件处理函数
    $('tbody').on('click', '.link-title', function () {
        // 获取文章的 id
        const id = $(this).attr('data-id')
        // 请求文章的数据
        $.get('/my/article/info', { id }, function (res) {
            console.log(res)
            const htmlStr = template('tmpl-artinfo', res.data)
            layer.open({
                type: 1,
                title: '预览文章',
                area: ['80%', '80%'],
                content: htmlStr
            })
        })
    });
        
    // 编辑文章按钮的点击事件处理函数
    $('tbody').on('click', '.btn-listedit', function () {
        // 获取要编辑的文章的 id
        const id = $(this).attr('data-id')
        // 跳转到文章编辑页面
        location.href = '../../html/articles/art_edit.html?id=' + id
    })

    //底部分页
    function getpagelist(total){
        laypage.render({
            elem: 'pagelist', //注意，这里的 test1 是 ID，不用加 # 号
            count: total ,//数据总数，从服务端得到
            limit: simulation.pagesize, //每页的条目数，是由这个虚拟数据参数值决定的
            curr: simulation.pagenum, //起始页面默认是1
            
            //页面结构的属性搭建
            layout:['count','limit','prev','page','next','skip'],
            limits: [2,4,6,8,10], //每页显示多少条数据的显示文本limit条目选取区域

            jump:function(obj,fit){ //分页回调函数
                //obj包含了分页的所有数据，obj.curr当前页码,obj.limit每页显示的条数

                //所以我们将分页和数据表连接起来

                //将最新的每页多少条目传值
                simulation.pagesize = obj.limit;

                //将页码传给渲染参数，实时更新
                simulation.pagenum = obj.curr;
                //此时直接调取渲染函数，会造成死循环
                //页面开始先调取分页，分页得到数据传值页码再渲染
                //因此我们要判定，当不是调取函数时，也就是点击触发时才渲染页面，因为调取时一次性的显示
                
                //因此在这里的fit，会判定由什么触发，当调取时fit=true,当点击时fit=undifunde。
                if(!fit){ //当不是调取函数时，触发渲染，否则就展示页码
                    getlistdata()
                }

            }

        });
    };

    
});