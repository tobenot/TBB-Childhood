// 图片查看器功能
// 为所有图片添加点击放大功能

$(document).ready(function() {
    // 创建全屏图片容器
    if ($('#fullscreen-image-container').length === 0) {
        $('body').append('<div id="fullscreen-image-container" class="fullscreen-image"><img id="fullscreen-img" src="" alt="全屏图片"></div>');
        
        // 添加全屏图片查看器样式
        if ($('#fullscreen-image-styles').length === 0) {
            $('head').append(`
                <style id="fullscreen-image-styles">
                    .fullscreen-image {
                        display: none;
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-color: rgba(0, 0, 0, 0.9);
                        z-index: 1000;
                        justify-content: center;
                        align-items: center;
                        cursor: pointer;
                    }
                    
                    .fullscreen-image.active {
                        display: flex;
                    }
                    
                    .fullscreen-image img {
                        max-width: 90%;
                        max-height: 90%;
                        object-fit: contain;
                        border: 2px solid #d4af37;
                        box-shadow: 0 0 30px rgba(212, 175, 55, 0.7);
                    }
                </style>
            `);
        }
    }
    
    // 为所有CG、场景和角色图片添加点击事件
    $(document).on('click', 'img[src*="/cg/"], img[src*="/scenes/"], img[src*="/characters/"]', function() {
        var imgSrc = $(this).attr('src');
        $('#fullscreen-img').attr('src', imgSrc);
        $('#fullscreen-image-container').addClass('active');
    });
    
    // 点击全屏图片容器关闭它
    $(document).on('click', '#fullscreen-image-container', function() {
        $(this).removeClass('active');
    });
    
    // 添加页面过渡动画
    $(document).on(':passagestart', function(ev) {
        setTimeout(function() {
            $('.passage').addClass('passage-transition-in');
        }, 100);
    });
    
    $(document).on(':passageend', function(ev) {
        $('.passage').addClass('passage-transition-out');
    });
});