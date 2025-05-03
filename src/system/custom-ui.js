// 自定义UI界面
// 添加音量控制和中文界面元素

$(document).ready(function() {
    // 修改默认UI按钮为中文
    // 保存按钮
    $('#ui-bar-saves').text('存档');
    $('#menu-item-saves a').text('存档');
    
    // 为存档按钮添加点击事件
    $('#menu-item-saves a').on('click', function() {
        UI.saves();
    });
    
    // 重新开始按钮
    $('#ui-bar-restart').text('重新开始');
    $('#menu-item-restart a').text('重新开始');
    
    // 为重新开始按钮添加点击事件
    $('#menu-item-restart a').on('click', function() {
        UI.restart();
    });
    
    // 创建设置菜单项
    if ($('#menu-item-settings').length === 0) {
        $('#menu-core').append('<li id="menu-item-settings"><a tabindex="0">设置</a></li>');
    }
    
    // 为导航按钮添加点击事件
    $(document).on('click', '#ui-bar-back:not(.disabled)', function() {
        Engine.backward();
    });

    
    $(document).on('click', '#ui-bar-author', function() {
        // 在新窗口打开作者主页
        window.open('https://tobenot.top/', '_blank');
    });
    
    // 添加侧边栏收起/展开功能
    $(document).on('click', '#ui-bar-toggle', function() {
        $('#ui-bar').toggleClass('stowed');
        // 保存侧边栏状态到localStorage
        localStorage.setItem('sidebarStowed', $('#ui-bar').hasClass('stowed'));
        updateStoryMargin();
    });
    
    // 更新故事区域的边距和侧边栏状态
    function updateStoryMargin() {
        if ($('#ui-bar').hasClass('stowed')) {
            // 故事区域边距调整为0
            $('#story').css('margin-left', '0');
            // 隐藏侧边栏主体内容
            $('#ui-bar-body').hide();
            // 将侧边栏移出视图
            $('#ui-bar').css({
                'left': '-17em', // 保留一部分宽度用于显示切换按钮
                'transition': 'left 0.3s ease'
            });
            // 确保切换按钮仍然可见
            $('#ui-bar-tray').css({
                'position': 'fixed',
                'left': '0',
                'top': '0',
                'width': '3em',
                'z-index': '50'
            });
        } else {
            // 恢复故事区域边距
            $('#story').css('margin-left', '20em');
            // 显示侧边栏主体内容
            $('#ui-bar-body').show();
            // 将侧边栏恢复到原位
            $('#ui-bar').css({
                'left': '0',
                'transition': 'left 0.3s ease'
            });
            // 恢复切换按钮位置
            $('#ui-bar-tray').css({
                'position': 'relative',
                'width': 'auto'
            });
        }
    }

    
    // 创建设置面板
    if ($('#settings-dialog').length === 0) {
        $('body').append(`
            <div id="settings-dialog" class="settings-overlay">
                <div class="settings-content">
                    <h2>游戏设置</h2>
                    <div class="settings-section">
                        <h3>音量控制</h3>
                        <div class="volume-control">
                            <label for="master-volume">主音量：</label>
                            <input type="range" id="master-volume" min="0" max="100" value="100">
                            <span id="volume-value">100%</span>
                        </div>
                        <div class="mute-control">
                            <label>
                                <input type="checkbox" id="mute-toggle"> 静音
                            </label>
                        </div>
                    </div>
                    <div class="settings-buttons">
                        <button id="settings-close" class="button">关闭</button>
                    </div>
                </div>
            </div>
        `);
        
        // 添加设置面板样式
        $('head').append(`
            <style>
                .settings-overlay {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.7);
                    z-index: 1000;
                    justify-content: center;
                    align-items: center;
                }
                
                .settings-content {
                    background-color: #1a1a1a;
                    border: 2px solid #d4af37;
                    border-radius: 8px;
                    padding: 2em;
                    width: 80%;
                    max-width: 500px;
                    box-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
                }
                
                .settings-content h2 {
                    color: #d4af37;
                    text-align: center;
                    margin-bottom: 1em;
                    border-bottom: 1px solid #d4af37;
                    padding-bottom: 0.5em;
                }
                
                .settings-section {
                    margin-bottom: 1.5em;
                }
                
                .settings-section h3 {
                    color: #d4af37;
                    margin-bottom: 0.5em;
                }
                
                .volume-control {
                    display: flex;
                    align-items: center;
                    margin-bottom: 1em;
                }
                
                .volume-control label {
                    margin-right: 1em;
                    min-width: 5em;
                }
                
                .volume-control input[type="range"] {
                    flex-grow: 1;
                    margin-right: 1em;
                }
                
                .volume-control span {
                    min-width: 3em;
                    text-align: right;
                }
                
                .mute-control {
                    display: flex;
                    align-items: center;
                }
                
                .settings-buttons {
                    text-align: center;
                    margin-top: 1.5em;
                }
                
                #ui-bar-settings {
                    cursor: pointer;
                }
                
                #menu-item-settings a {
                    cursor: pointer;
                }
            </style>
        `);
    }
    
    // 设置按钮点击事件
    $(document).on('click', '#ui-bar-settings, #menu-item-settings a', function() {
        // 显示设置面板
        $('#settings-dialog').css('display', 'flex');
        
        // 安全地初始化音量控制
        try {
            // 使用 SimpleAudio API 获取当前主音量和静音状态
            var currentVolume = 100;
            var isMuted = false;
            if (typeof SimpleAudio !== 'undefined') {
                currentVolume = Math.round(SimpleAudio.volume * 100);
                isMuted = SimpleAudio.mute;
            }
            $('#master-volume').val(currentVolume);
            $('#volume-value').text(currentVolume + '%');
            $('#mute-toggle').prop('checked', isMuted);
        } catch (e) {
            console.error('初始化音量控制时出错:', e);
            // 使用默认值
            $('#master-volume').val(100);
            $('#volume-value').text('100%');
            $('#mute-toggle').prop('checked', false);
        }
    });
    
    // 关闭设置面板
    $(document).on('click', '#settings-close', function() {
        $('#settings-dialog').hide();
    });
    
    // 音量控制
    $(document).on('input', '#master-volume', function() {
        var volume = $(this).val();
        $('#volume-value').text(volume + '%');
        
        try {
            // 使用 SimpleAudio API 控制音量
            if (typeof SimpleAudio !== 'undefined') {
                SimpleAudio.volume(volume / 100); // 使用方法调用设置音量
            }
        } catch (e) {
            console.error('设置音量时出错:', e);
        }
    });
    
    // 静音控制
    $(document).on('change', '#mute-toggle', function() {
        var isMuted = $(this).prop('checked');
        
        try {
            // 使用 SimpleAudio API 控制静音
            if (typeof SimpleAudio !== 'undefined') {
                SimpleAudio.mute(isMuted); // 使用方法调用设置静音状态
            }
        } catch (e) {
            console.error('设置静音状态时出错:', e);
        }
    });
    
    // 更新导航按钮状态
    function updateNavigationButtons() {
        console.log(`Updating buttons: activeIndex=${State.activeIndex}, length=${State.length}`); 
        
        // 更新后退按钮状态
        if (State.length > 1 && State.activeIndex > 0) {
            $('#ui-bar-back').removeClass('disabled');
        } else {
            $('#ui-bar-back').addClass('disabled');
        }
        
        // 更新前进按钮状态
        if (State.activeIndex < State.length) {
            $('#ui-bar-forward').removeClass('disabled');
        } else {
            $('#ui-bar-forward').addClass('disabled');
        }
    
        // 确保按钮样式正确应用
        $('#ui-bar-back.disabled, #ui-bar-forward.disabled').css({
            'opacity': '0.5',
            'cursor': 'not-allowed'
        });
        
        $('#ui-bar-back:not(.disabled), #ui-bar-forward:not(.disabled)').css({
            'opacity': '1',
            'cursor': 'pointer'
        });
    }
    
    // 初始化时检查侧边栏状态
    function initUiBarState() {
        // 检查是否有保存的侧边栏状态
        var sidebarStowed = localStorage.getItem('sidebarStowed') === 'true';
        
        // 根据保存的状态设置侧边栏
        if (sidebarStowed) {
            $('#ui-bar').addClass('stowed');
        } else {
            $('#ui-bar').removeClass('stowed');
        }
        
        // 确保侧边栏状态与显示一致
        updateStoryMargin();
        // 初始化导航按钮状态
        updateNavigationButtons();
    }
    
    // 初始化UI状态
    initUiBarState();
    
    // 在故事状态变化时更新按钮状态
    $(document).on(':passagestart', function() {
        updateNavigationButtons(); // 这个监听器现在是更新按钮状态的主要方式
    });
    
    // 初始化按钮状态
    updateNavigationButtons();
});

// 在菜单栏添加前进按钮
if ($('#menu-item-forward').length === 0) {
    $('#menu-core').append('<li id="menu-item-forward"><a tabindex="0">前进</a></li>');
}
$(document).ready(function() {
    // 修改默认UI按钮为中文
    $('#menu-item-back a').text('后退');
    $('#menu-item-forward a').text('前进');
    $('#menu-item-settings a').text('设置');
    $('#menu-item-author a').text('作者主页');
    $('#menu-item-saves a').text('存档');
    $('#menu-item-restart a').text('重新开始');

    // 为导航按钮添加点击事件
    $('#menu-item-back a').on('click', function() {
        Engine.backward();
    });

    $('#menu-item-forward a').on('click', function() {
        Engine.forward();
    });

    $('#menu-item-settings a').on('click', function() {
        $('#settings-dialog').css('display', 'flex');
    });

    $('#menu-item-author a').on('click', function() {
        window.open('https://tobenot.top/', '_blank');
    });

    $('#menu-item-saves a').on('click', function() {
        UI.saves();
    });

    $('#menu-item-restart a').on('click', function() {
        UI.restart();
    });
});