// 自定义UI界面
// 添加音量控制和中文界面元素

$(document).ready(function() {
    // 修改默认UI按钮为中文
    $('#menu-item-back a').text('后退');
    $('#menu-item-forward a').text('前进');
    $('#menu-item-settings a').text('设置');
    $('#menu-item-author a').text('作者主页');
    $('#menu-item-saves a').text('存档 / 读档');
    $('#menu-item-restart a').text('重新开始');
    $('#menu-item-credits a').text('感谢名单');
    $('#menu-item-group-reward a').text('加群反馈拿奖');


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
        //UI.saves(); //我们已经使用自定义的存档界面
    });

    $('#menu-item-restart a').on('click', function() {
        UI.restart();
    });

    $('#menu-item-codex a').on('click', function() {
        // 不在这里实现
    });

    // 为感谢名单按钮添加点击事件
    $('#menu-item-credits a').on('click', function() {
        $('#credits-modal').css('display', 'flex'); // Show the new credits modal
    });

    // 关闭感谢名单弹窗
    $('#credits-modal-close').on('click', function() {
        $('#credits-modal').hide();
    });

    // 为加群反馈拿奖按钮添加点击事件
    $('#menu-item-group-reward a').on('click', function() {
        $('#group-reward-modal').css('display', 'flex');
    });

    // 关闭加群反馈拿奖弹窗
    $('#group-reward-close').on('click', function() {
        $('#group-reward-modal').hide();
    });

    function initUiBarState() {
        var sidebarStowed = localStorage.getItem('sidebarStowed') === 'true';
        var isSmallScreen = window.innerWidth < 768;
        if (isSmallScreen) {
            sidebarStowed = true;
        }
        if (sidebarStowed) {
            $('#ui-bar').addClass('stowed');
        } else {
            $('#ui-bar').removeClass('stowed');
        }
        updateStoryMargin();
        updateNavigationButtons();
    }

    initUiBarState();
    
    $(document).on('click', '#ui-bar-toggle', function() {
        $('#ui-bar').toggleClass('stowed');
        localStorage.setItem('sidebarStowed', $('#ui-bar').hasClass('stowed'));
        updateStoryMargin();
    });
    
    function updateStoryMargin() {
        if ($('#ui-bar').hasClass('stowed')) {
            $('#story').css('margin-left', '3em'); 
            $('#ui-bar-body').hide();
            $('#ui-bar').css({ 'left': '-22em', 'transition': 'left 0.3s ease' });
            $('#ui-bar-tray').css({ 'position': 'fixed', 'left': '0', 'top': '0', 'width': '3em', 'z-index': '50' });
        } else {
            $('#story').css('margin-left', '20em');
            $('#ui-bar-body').show();
            $('#ui-bar').css({ 'left': '0', 'transition': 'left 0.3s ease' });
            $('#ui-bar-tray').css({ 'position': 'relative', 'width': 'auto' });
        }
    }
    
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
                            <label><input type="checkbox" id="mute-toggle"> 静音</label>
                        </div>
                    </div>
                    <div class="settings-buttons">
                        <button id="settings-close" class="button">关闭</button>
                    </div>
                </div>
            </div>
        `);
    }

    if ($('style#custom-dialog-styles').length === 0) {
        $('head').append(`
            <style id="custom-dialog-styles">
                .settings-overlay {
                    display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background-color: rgba(0, 0, 0, 0.7); z-index: 1000;
                    justify-content: center; align-items: center;
                }
                .settings-content {
                    background-color: #1a1a1a; color: #e0e0e0; border: 2px solid #d4af37;
                    border-radius: 8px; padding: 2em; width: 80%; max-width: 500px;
                    box-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
                }
                .settings-content h2 {
                    color: #d4af37; text-align: center; margin-top: 0; margin-bottom: 1em;
                    border-bottom: 1px solid #d4af37; padding-bottom: 0.5em;
                }
                .settings-section { margin-bottom: 1.5em; }
                .settings-section h3 { color: #d4af37; margin-bottom: 0.5em; }
                .settings-section p { line-height: 1.6; margin-bottom: 1em; }
                .settings-section ul { list-style-position: inside; padding-left: 1em; }
                .settings-section ul li ul { padding-left: 1.5em; }
                .volume-control { display: flex; align-items: center; margin-bottom: 1em; }
                .volume-control label { margin-right: 1em; min-width: 5em; }
                .volume-control input[type="range"] { flex-grow: 1; margin-right: 1em; }
                .volume-control span { min-width: 3em; text-align: right; }
                .mute-control { display: flex; align-items: center; }
                .mute-control label { cursor: pointer; }
                .settings-buttons { text-align: center; margin-top: 1.5em; }
                .button {
                    background-color: #d4af37; color: #1a1a1a; border: none;
                    padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 1em;
                }
                .button:hover { background-color: #b89a30; }
                #menu-item-settings a, #menu-item-credits a, #menu-item-group-reward a { cursor: pointer; }
            </style>
        `);
    }
    
    $(document).on('click', '#ui-bar-settings, #menu-item-settings a', function() {
        $('#settings-dialog').css('display', 'flex');
        try {
            var currentVolumePercent = 100; // Default to 100%
            var isMuted = false; // Default to not muted

            // Try to get volume from SugarCube's standard settings
            if (typeof Config !== 'undefined' && typeof Config.saves !== 'undefined' && typeof Config.saves.volume !== 'undefined') {
                currentVolumePercent = Math.round(Config.saves.volume * 100);
            }
            // Try to get mute state from SugarCube's masteraudio function or Config.saves
            if (typeof masteraudio === 'function' && typeof masteraudio().mute === 'boolean') { // masteraudio() is a SugarCube function
                isMuted = masteraudio().mute;
            } else if (typeof Config !== 'undefined' && typeof Config.saves !== 'undefined' && typeof Config.saves.mute === 'boolean') {
                isMuted = Config.saves.mute;
            }

            $('#master-volume').val(currentVolumePercent);
            $('#volume-value').text(currentVolumePercent + '%');
            $('#mute-toggle').prop('checked', isMuted);

        } catch (e) {
            console.error('初始化音量控制时出错:', e);
            // Fallback if any error occurs
            $('#master-volume').val(100);
            $('#volume-value').text('100%');
            $('#mute-toggle').prop('checked', false);
        }
    });
    
    $(document).on('click', '#settings-close', function() { $('#settings-dialog').hide(); });
    
    $(document).on('input', '#master-volume', function() {
        var volumePercent = parseInt($(this).val(), 10);
        var volumeNormalized = volumePercent / 100;
        $('#volume-value').text(volumePercent + '%');
        try {
            // Update SugarCube's master volume
            if (typeof jQuery.wiki === 'function') { // Use jQuery.wiki to execute the macro
                jQuery.wiki('<<masteraudio volume ' + volumeNormalized + '>>');
            } else if (typeof SimpleAudio !== 'undefined' && typeof SimpleAudio.volume === 'function') { // Fallback
                SimpleAudio.volume(volumeNormalized);
                 // If SimpleAudio is the only way, we might need to manually update Config.saves here if not done by SimpleAudio
                if (typeof Config !== 'undefined' && typeof Config.saves !== 'undefined') {
                    // Check if SimpleAudio updated Config.saves, if not, do it carefully or log
                }
            }
             // Ensure Config.saves.volume is updated after the macro execution for next time settings are opened.
             // The <<masteraudio>> macro should handle this. If not, this might be a point of failure.
             // For safety, we can re-read or trust the macro. Let's trust the macro for now.

        }
        catch (e) { console.error('设置音量时出错:', e); }
    });
    
    $(document).on('change', '#mute-toggle', function() {
        var isMuted = $(this).prop('checked');
        try {
            // Update SugarCube's mute state
            var muteAction = isMuted ? 'mute' : 'unmute';
            if (typeof jQuery.wiki === 'function') { // Use jQuery.wiki to execute the macro
                jQuery.wiki('<<masteraudio ' + muteAction + '>>');
            } else if (typeof SimpleAudio !== 'undefined' && typeof SimpleAudio.mute === 'function') { // Fallback
                SimpleAudio.mute(isMuted);
                // Similar to volume, ensure Config.saves.mute is updated.
            }
            // The <<masteraudio>> macro should handle updating Config.saves.mute.
        }
        catch (e) { console.error('设置静音状态时出错:', e); }
    });
    
    function updateNavigationButtons() {
        if (typeof State === 'undefined' || State === null) {
            $('#menu-item-back a').addClass('disabled');
            $('#menu-item-forward a').addClass('disabled');
            return;
        }
        if (State.length > 1 && State.activeIndex > 0) { $('#menu-item-back a').removeClass('disabled'); }
        else { $('#menu-item-back a').addClass('disabled'); }
        // 有bug，不要处理先
        if (true) { $('#menu-item-forward a').removeClass('disabled'); }
        //if (State.activeIndex < State.length - 1) { $('#menu-item-forward a').removeClass('disabled'); }
        //else { $('#menu-item-forward a').addClass('disabled'); }
        $('ul#menu-core li a.disabled').css({ 'opacity': '0.5', 'cursor': 'not-allowed', 'pointer-events': 'none' });
        $('ul#menu-core li a:not(.disabled)').css({ 'opacity': '1', 'cursor': 'pointer', 'pointer-events': 'auto' });
    }
    
    $(document).on(':passagestart', function() { updateNavigationButtons(); });
    $(document).on('click', '#menu-item-back:not(.disabled) a', function() { Engine.backward(); });
    $(document).on('click', '#menu-item-forward:not(.disabled) a', function() { Engine.forward(); });

    updateNavigationButtons();
});