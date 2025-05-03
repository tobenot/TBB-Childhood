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
    
    // 设置按钮
    if ($('#ui-bar-settings').length === 0) {
        // 创建设置按钮
        $('#ui-bar-toggle').before('<div id="ui-bar-settings" class="ui-bar-item" aria-label="设置" title="设置">设置</div>');
        
        // 创建设置菜单项
        $('#menu-core').append('<li id="menu-item-settings"><a tabindex="0">设置</a></li>');
    }
    
    // 添加作者按钮
    if ($('#ui-bar-author').length === 0) {
        // 创建作者按钮
        $('#ui-bar-toggle').before('<div id="ui-bar-author" class="ui-bar-item" aria-label="作者" title="作者主页">作者</div>');
        
        // 为作者按钮添加点击事件
        $(document).on('click', '#ui-bar-author', function() {
            // 在新窗口打开作者主页 - 这里使用GitHub页面作为示例，可以替换为实际作者主页
            window.open('https://tobenot.top/', '_blank');
        });
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

});