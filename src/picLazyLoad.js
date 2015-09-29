/**
 * picLazyLoad
 * http://ons.me/484.html
 * 西门
 * 1.2.0(150929)
 */

;(function(win, $){
    var _winHeight = win.screen.height;
    
    var lazyLoad = function(option){
        var me = this;
        init(this, option);
    };
    
    function init(me, option){
        me.option = extend({
            parent: document.body,      // 父层容器
            className: 'lazyload',      // 懒加载类名
            direction: 'y',             // 滚动方向
            threshold: 0,               // 提前加载
            picError: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',      // 图片加载失败替换
            callback : function(){}     // 每次滚动回调
        }, option);

        
        // 父层默认window
        if(me.option.parent == document.body){
            fnLazyLoad(me, me.option.parent);

            win.addEventListener('scroll',function(){
                fnLazyLoad(me, me.option.parent);
            },false);

        // 父层非window
        }else{
            var i = 0;
            me.$parent = document.querySelectorAll('.' + me.option.parent);
            me._parentLength = me.$parent.length;
            for(i; i < me._parentLength; i++){
                var $me = me.$parent[i];
                // 获取外层参考容器的值
                me._parentOffsetTop = $me.getBoundingClientRect().top;
                me._parentOffsetLeft = $me.getBoundingClientRect().left;
                me._parentWidth = $me.clientWidth;
                me._parentHeight = $me.clientHeight;

                // 调用懒加载方法
                fnLazyLoad(me, $me);

                $me.addEventListener('scroll',function(){
                    fnLazyLoad(me, this);
                },false);
            }
        }        
    }

    // extend
    function extend(){
        var _extend = function me(dest, source) {
            for (var name in dest) {
                if (dest.hasOwnProperty(name)) {
                    //当前属性是否为对象,如果为对象，则进行递归
                    if ((dest[name] instanceof Object) && (source[name] instanceof Object)) {
                        me(dest[name], source[name]);
                    }
                    //检测该属性是否存在
                    if (source.hasOwnProperty(name)) {
                        continue;
                    } else {
                        source[name] = dest[name];
                    }
                }
            }
        };
        var _result = {},
            arr = arguments;
        //遍历属性，至后向前
        if (!arr.length) return {};
        for (var i = arr.length - 1; i >= 0; i--) {
            _extend(arr[i], _result);
        }
        arr[0] = _result;
        return _result;
    }

    // 懒加载方法
    function fnLazyLoad(me, $parent){
        var i = 0;
        var $pic = $parent.querySelectorAll('.' + me.option.className);
        var _legnth = $pic.length;
        for(i; i < _legnth; i++){
            var $me = $pic[i];
            var _offsetTop = $me.getBoundingClientRect().top;
            var _offsetLeft = $me.getBoundingClientRect().left;
            var nodeName = $me.nodeName;
            var original = $me.getAttribute('data-original');
            
            // 父层默认window
            if(me.option.parent == document.body){
                if(_offsetTop - me.option.threshold <= _winHeight){
                    lazyLoadPic();
                }
            // 父层非window
            }else{
                // 父层滚动条竖
                if(me.option.direction == 'y'){
                    if(_offsetTop - me._parentOffsetTop - me.option.threshold <= me._parentHeight){
                        lazyLoadPic();
                    }
                // 父层滚动条横
                }else{
                    if(_offsetLeft - me._parentOffsetLeft - me.option.threshold <= me._parentWidth){
                        lazyLoadPic();
                    }
                }
            }
            // 懒加载图片
            function lazyLoadPic(){
                if(original){
                    if(nodeName == 'IMG'){
                        $me.setAttribute('src', original);
                        $me.onerror = function(){
                            this.setAttribute('src',me.option.picError);
                        };
                    }else{
                        $me.style.backgroundImage ='url('+original+')';
                    }
                    me.option.callback($me);
                    $me.removeAttribute('data-original');
                }
            }
            
        }
    }
        
    picLazyLoad = function(option){
        var options = typeof option == 'object' && option;
        return new lazyLoad(options);
    };
})(window, window.Zepto || window.jQuery);