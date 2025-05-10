$(document).ready(function() {
  // --- 配置 ---
  // 设置您希望拥有的存档槽数量
  Config.saves.slots = 5; // 例如，5个存档槽

  // 创建自定义通知系统
  function setupNotificationSystem() {
    if ($('#game-notification-system').length === 0) {
      $('body').append(`
        <div id="game-notification-system">
          <div id="notification-container"></div>
          <div id="confirmation-dialog" class="game-dialog">
            <div class="game-dialog-content">
              <p id="confirmation-message"></p>
              <div class="dialog-buttons">
                <button id="confirm-yes" class="confirm-button">确定</button>
                <button id="confirm-no" class="confirm-button">取消</button>
              </div>
            </div>
          </div>
        </div>
      `);

      // 添加样式
      $('head').append(`
        <style id="notification-system-style">
          #game-notification-system {
            position: fixed;
            z-index: 3000;
            width: 100%;
            pointer-events: none;
          }
          
          #notification-container {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            max-width: 80%;
          }
          
          .game-notification {
            background-color: rgba(10, 10, 10, 0.95);
            color: #e0e0e0;
            border: 1px solid #d4af37;
            border-left: 4px solid #d4af37;
            border-radius: 4px;
            padding: 12px 15px;
            margin-bottom: 10px;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
            transform: translateX(120%);
            transition: transform 0.3s ease;
            position: relative;
            pointer-events: auto;
            font-size: 0.95em;
            overflow: hidden;
          }
          
          .game-notification.success {
            border-left-color: #4CAF50;
          }
          
          .game-notification.error {
            border-left-color: #F44336;
          }
          
          .game-notification.warning {
            border-left-color: #FF9800;
          }
          
          .game-notification.show {
            transform: translateX(0);
          }
          
          .game-notification:before {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            width: 100%;
            background-color: rgba(212, 175, 55, 0.5);
            animation: notification-timer 5s linear forwards;
          }
          
          @keyframes notification-timer {
            0% {
              width: 100%;
            }
            100% {
              width: 0;
            }
          }
          
          .notification-close {
            position: absolute;
            top: 8px;
            right: 8px;
            cursor: pointer;
            font-size: 14px;
            color: rgba(255, 255, 255, 0.7);
            transition: color 0.2s;
          }
          
          .notification-close:hover {
            color: #fff;
          }
          
          /* 确认对话框样式 */
          #confirmation-dialog {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 3001;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s, visibility 0.3s;
            pointer-events: auto;
          }
          
          #confirmation-dialog.show {
            opacity: 1;
            visibility: visible;
          }
          
          .game-dialog-content {
            background-color: rgba(20, 20, 20, 0.95);
            border: 2px solid #d4af37;
            border-radius: 6px;
            padding: 20px;
            width: 90%;
            max-width: 400px;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
            transform: scale(0.9);
            transition: transform 0.3s;
          }
          
          #confirmation-dialog.show .game-dialog-content {
            transform: scale(1);
          }
          
          #confirmation-message {
            margin-bottom: 20px;
            color: #e0e0e0;
            font-size: 1em;
          }
          
          .dialog-buttons {
            display: flex;
            justify-content: center;
            gap: 15px;
          }
          
          .confirm-button {
            padding: 8px 20px;
            border-radius: 4px;
            cursor: pointer;
            border: 1px solid rgba(212, 175, 55, 0.5);
            background-color: rgba(0, 0, 0, 0.6);
            color: #d4af37;
            transition: all 0.3s ease;
            min-width: 80px;
          }
          
          .confirm-button:hover {
            background-color: #d4af37;
            color: #000;
          }
          
          #confirm-no {
            background-color: rgba(50, 50, 50, 0.8);
            color: #e0e0e0;
            border-color: rgba(150, 150, 150, 0.5);
          }
          
          #confirm-no:hover {
            background-color: rgba(70, 70, 70, 0.9);
            border-color: #e0e0e0;
            color: #fff;
          }
        </style>
      `);
    }
  }

  // 显示通知的函数
  function showNotification(message, type = 'info', duration = 5000) {
    setupNotificationSystem();
    const container = $('#notification-container');
    const notificationId = 'notification-' + Math.random().toString(36).substr(2, 9);
    
    const notification = $(`
      <div id="${notificationId}" class="game-notification ${type}">
        ${message}
        <span class="notification-close">×</span>
      </div>
    `);
    
    container.append(notification);
    
    // 延迟一点显示通知，让CSS动画有效果
    setTimeout(() => {
      notification.addClass('show');
    }, 10);
    
    // 点击关闭按钮
    notification.find('.notification-close').on('click', function() {
      removeNotification(notificationId);
    });
    
    // 自动关闭
    setTimeout(() => {
      removeNotification(notificationId);
    }, duration);
    
    function removeNotification(id) {
      const notification = $(`#${id}`);
      notification.removeClass('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }
  }

  // 显示确认对话框的函数
  function showConfirmation(message, onConfirm, onCancel) {
    setupNotificationSystem();
    
    const dialog = $('#confirmation-dialog');
    const messageEl = $('#confirmation-message');
    
    messageEl.text(message);
    dialog.addClass('show');
    
    function cleanup() {
      dialog.removeClass('show');
      $('#confirm-yes').off('click');
      $('#confirm-no').off('click');
    }
    
    $('#confirm-yes').one('click', function() {
      cleanup();
      if (typeof onConfirm === 'function') {
        onConfirm();
      }
    });
    
    $('#confirm-no').one('click', function() {
      cleanup();
      if (typeof onCancel === 'function') {
        onCancel();
      }
    });
  }

  // --- 自定义保存/读取界面逻辑 ---

  // 打开/关闭自定义保存/读取界面的按钮事件
  $('#menu-item-saves a').on('click', function(e) {
    e.preventDefault(); // 阻止默认的存档界面弹出
    const saveInterface = $('#custom-save-load-interface');
    saveInterface.toggle(); // 切换显示/隐藏状态
    if (saveInterface.is(':visible')) {
      renderSaveSlots(); // 如果界面可见，则渲染存档槽
    }
  });

  // 关闭自定义保存/读取界面的按钮事件
  $('#close-custom-save-menu-button').on('click', function() {
    $('#custom-save-load-interface').hide();
  });

  // 渲染存档槽列表的函数
  function renderSaveSlots() {
    const container = $('#save-slots-list').empty(); // 清空旧的存档槽显示

    for (let i = 1; i <= Config.saves.slots; i++) {
      const slotDiv = $('<div class="save-slot"></div>');
      const slotInfo = $('<div class="slot-info"></div>');
      const saveButton = $('<button class="save-button">保存到这里</button>').attr('data-slot', i);
      const loadButton = $('<button class="load-button" disabled>从此读取</button>').attr('data-slot', i); // 默认禁用
      const deleteButton = $('<button class="delete-button" disabled>删除存档</button>').attr('data-slot', i); // 默认禁用

      if (Save.slots.has(i)) { // 检查该槽是否有存档
        const save = Save.slots.get(i);
        let title = save.title || '无标题'; // 获取存档标题，如果没有则显示'无标题'
        // 为了避免过长的描述，可以截断标题
        if (title.length > 30) { // 例如，限制标题长度为30字符
            title = title.substring(0, 27) + "...";
        }
        slotInfo.html(`<strong>存档 ${i}:</strong> ${title}<br><small>保存于: ${new Date(save.date).toLocaleString()}</small>`);
        loadButton.prop('disabled', false); // 启用读取按钮
        deleteButton.prop('disabled', false); // 启用删除按钮
      } else {
        slotInfo.html(`<strong>存档 ${i}:</strong> (空)`);
      }

      slotDiv.append(slotInfo).append(saveButton).append(loadButton).append(deleteButton);
      container.append(slotDiv);
    }
  }

  // 创建自定义存档命名对话框
  function createSaveNameDialog(slotId) {
    // 创建对话框HTML
    const dialog = $(`
      <div class="save-name-dialog">
        <div class="save-name-content">
          <h3>为存档命名</h3>
          <div class="save-name-input-group">
            <label for="save-name-input">自定义名称:</label>
            <input type="text" id="save-name-input" placeholder="输入存档名称">
          </div>
          <div class="save-name-templates">
            <label>选择预设:</label>
            <button class="template-button" data-template="自动存档 - [场景] - [时间]">场景+时间</button>
            <button class="template-button" data-template="[玩家名称] - [场景] - [日期]">玩家+场景</button>
            <button class="template-button" data-template="快速存档 - [时间]">快速存档</button>
          </div>
          <div class="save-name-buttons">
            <button id="save-name-cancel">取消</button>
            <button id="save-name-confirm">确认</button>
          </div>
        </div>
      </div>
    `);

    // 添加到body
    $('body').append(dialog);

    // 设置默认值
    const defaultName = `自动存档 - ${State.passage} - ${new Date().toLocaleTimeString()}`;
    $('#save-name-input').val(defaultName);

    // 绑定模板按钮事件
    $('.template-button').on('click', function() {
      let template = $(this).data('template');
      // 替换模板变量
      template = template.replace('[场景]', State.passage)
                        .replace('[时间]', new Date().toLocaleTimeString())
                        .replace('[日期]', new Date().toLocaleDateString())
                        .replace('[玩家名称]', State.variables.playerName || '主角');
      $('#save-name-input').val(template);
    });

    // 绑定确认按钮事件
    $('#save-name-confirm').on('click', function() {
      const saveName = $('#save-name-input').val() || defaultName;
      saveSaveGame(slotId, saveName);
      dialog.remove();
    });

    // 绑定取消按钮事件
    $('#save-name-cancel').on('click', function() {
      dialog.remove();
    });

    // 添加样式
    if (!$('style#save-name-dialog-styles').length) {
      $('head').append(`
        <style id="save-name-dialog-styles">
          .save-name-dialog {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            z-index: 2000;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .save-name-content {
            background-color: rgba(10, 10, 10, 0.95);
            border: 2px solid #d4af37;
            border-radius: 8px;
            padding: 20px;
            width: 90%;
            max-width: 500px;
            color: #e0e0e0;
          }
          .save-name-content h3 {
            color: #d4af37;
            text-align: center;
            margin-top: 0;
            margin-bottom: 20px;
            text-shadow: 0 0 5px rgba(212, 175, 55, 0.5);
            padding-bottom: 10px;
            border-bottom: 1px solid #d4af37;
          }
          .save-name-input-group {
            margin-bottom: 15px;
          }
          .save-name-input-group label {
            display: block;
            margin-bottom: 5px;
            color: #d4af37;
          }
          .save-name-input-group input {
            width: 100%;
            padding: 8px;
            border: 1px solid rgba(212, 175, 55, 0.5);
            background-color: rgba(30, 30, 30, 0.8);
            color: #e0e0e0;
            border-radius: 4px;
          }
          .save-name-templates {
            margin-bottom: 20px;
          }
          .save-name-templates label {
            display: block;
            margin-bottom: 8px;
            color: #d4af37;
          }
          .template-button {
            background-color: rgba(30, 30, 30, 0.8);
            color: #e0e0e0;
            border: 1px solid rgba(212, 175, 55, 0.5);
            padding: 6px 10px;
            margin-right: 8px;
            margin-bottom: 8px;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .template-button:hover {
            background-color: rgba(212, 175, 55, 0.3);
            border-color: #d4af37;
          }
          .save-name-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
          }
          .save-name-buttons button {
            padding: 8px 15px;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          #save-name-cancel {
            background-color: rgba(50, 50, 50, 0.8);
            color: #e0e0e0;
            border: 1px solid rgba(150, 150, 150, 0.5);
          }
          #save-name-cancel:hover {
            background-color: rgba(70, 70, 70, 0.9);
            border-color: rgba(180, 180, 180, 0.7);
          }
          #save-name-confirm {
            background-color: rgba(0, 0, 0, 0.7);
            color: #d4af37;
            border: 1px solid #d4af37;
          }
          #save-name-confirm:hover {
            background-color: #d4af37;
            color: #000000;
            box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
          }
        </style>
      `);
    }
  }

  // 保存游戏函数
  function saveSaveGame(slotId, title) {
    try {
      // 第三个参数 'metadata' 是可选的，可以用来存储额外信息
      // 例如: Save.slots.save(slotId, title, { currentPassage: State.passage });
      Save.slots.save(slotId, title);
      showNotification(`游戏已保存到存档 ${slotId}："${title}"`, 'success');
      renderSaveSlots(); // 刷新存档槽显示
    } catch (e) {
      showNotification(`保存失败: ${e.message}`, 'error');
    }
  }

  // 事件委托：处理保存按钮点击 (因为按钮是动态生成的)
  $('#save-slots-list').on('click', '.save-button', function() {
    const slotId = parseInt($(this).attr('data-slot'), 10);
    createSaveNameDialog(slotId);
  });

  // 事件委托：处理读取按钮点击
  $('#save-slots-list').on('click', '.load-button', function() {
    const slotId = parseInt($(this).attr('data-slot'), 10);
    if (!Save.slots.has(slotId)) {
      showNotification(`存档 ${slotId} 是空的，无法读取。`, 'warning');
      return;
    }
    
    showConfirmation(`确定要从存档 ${slotId} 读取吗? 当前未保存的进度将会丢失。`, function() {
      try {
        Save.slots.load(slotId);
        $('#custom-save-load-interface').hide(); // 读取成功后关闭自定义存档界面
      } catch (e) {
        showNotification(`读取失败: ${e.message}`, 'error');
      }
    });
  });

  // 事件委托：处理删除按钮点击
  $('#save-slots-list').on('click', '.delete-button', function() {
    const slotId = parseInt($(this).attr('data-slot'), 10);
    if (!Save.slots.has(slotId)) {
      showNotification(`存档 ${slotId} 已经是空的。`, 'info');
      return;
    }
    
    showConfirmation(`确定要删除存档 ${slotId} 吗? 此操作无法撤销。`, function() {
      try {
        Save.slots.delete(slotId);
        showNotification(`存档 ${slotId} 已删除。`, 'success');
        renderSaveSlots(); // 刷新存档槽显示
      } catch (e) {
        showNotification(`删除失败: ${e.message}`, 'error');
      }
    });
  });
  
  // 初始设置通知系统
  setupNotificationSystem();
}); 