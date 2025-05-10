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
                    .fullscreen-image { /* MODIFIED */
                        display: none;
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-color: rgba(0, 0, 0, 0.9);
                        z-index: 20000; /* INCREASED z-index */
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

    // 为所有CG、场景、角色图片以及图鉴内图片添加点击事件 (MODIFIED SELECTOR)
    $(document).on('click', 'img[src*="/cg/"], img[src*="/scenes/"], img[src*="/characters/"], .codex-image', function(e) {
        var imgSrc = $(this).attr('src');
        $('#fullscreen-img').attr('src', imgSrc);
        $('#fullscreen-image-container').addClass('active');
    });

    // 点击全屏图片容器关闭它
    $(document).on('click', '#fullscreen-image-container', function(e) {
        // Make sure we're not clicking on the image itself if we want to allow image interaction later (e.g. drag)
        if (e.target === this) {
            $(this).removeClass('active');
        }
    });

    // 添加页面过渡动画 (Your existing code)
    $(document).on(':passagestart', function(ev) {
        // It's generally better to apply transition classes to a higher-level container
        // or #passage, not every .passage if multiple can exist.
        // Assuming #passage is the main content area for transitions in SugarCube.
        $('#passage').removeClass('passage-transition-out').addClass('passage-transition-in');
    });

    $(document).on(':passageend', function(ev) {
         $('#passage').removeClass('passage-transition-in').addClass('passage-transition-out');
    });
});