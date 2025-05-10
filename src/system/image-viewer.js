// 图片查看器功能
// 为所有图片添加点击放大功能

$(document).ready(function() {
    // 创建全屏图片容器
    if ($('#fullscreen-image-container').length === 0) {
        $('body').append('<div id="fullscreen-image-container" class="fullscreen-image"><img id="fullscreen-img" src="" alt="全屏图片"><div class="close-button">×</div></div>');

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
                        background-color: rgba(0, 0, 0, 0.95);
                        z-index: 20000;
                        justify-content: center;
                        align-items: center;
                        cursor: pointer;
                        animation: fade-in 0.3s ease-in-out;
                    }

                    @keyframes fade-in {
                        from { opacity: 0; }
                        to { opacity: 1; }
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
                        transform: scale(0.95);
                        transition: transform 0.3s ease;
                        animation: img-zoom-in 0.4s forwards;
                    }

                    @keyframes img-zoom-in {
                        from { transform: scale(0.8); }
                        to { transform: scale(1); }
                    }

                    .fullscreen-image.active img:hover {
                        transform: scale(1.02);
                    }
                    
                    .close-button {
                        position: absolute;
                        top: 20px;
                        right: 30px;
                        color: #d4af37;
                        font-size: 40px;
                        font-weight: bold;
                        transition: all 0.2s ease;
                        text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
                    }
                    
                    .close-button:hover {
                        color: #ffd700;
                        transform: scale(1.1);
                        text-shadow: 0 0 15px rgba(212, 175, 55, 0.8);
                    }
                </style>
            `);
        }
    }

    // 为所有CG、场景、角色图片以及图鉴内图片添加点击事件
    $(document).on('click', 'img[src*="/cg/"], img[src*="/scenes/"], img[src*="/characters/"], .codex-image', function(e) {
        var imgSrc = $(this).attr('src');
        $('#fullscreen-img').attr('src', imgSrc);
        $('#fullscreen-image-container').addClass('active');
    });

    // 点击全屏图片容器关闭它
    $(document).on('click', '#fullscreen-image-container, .close-button', function(e) {
        // Make sure we're not clicking on the image itself
        if (e.target === this || $(e.target).hasClass('close-button')) {
            $('#fullscreen-image-container').removeClass('active');
        }
    });

    // 添加页面过渡动画
    $(document).on(':passagestart', function(ev) {
        $('#passage').removeClass('passage-transition-out').addClass('passage-transition-in');
    });

    $(document).on(':passageend', function(ev) {
         $('#passage').removeClass('passage-transition-in').addClass('passage-transition-out');
    });
});