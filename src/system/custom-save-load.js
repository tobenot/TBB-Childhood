$(document).ready(function() {
  // --- 配置 ---
  // 设置您希望拥有的存档槽数量
  Config.saves.slots = 10;

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
    
    setTimeout(() => {
      notification.addClass('show');
    }, 10);
    
    notification.find('.notification-close').on('click', function() {
      removeNotification(notificationId);
    });
    
    const timer = setTimeout(() => {
      removeNotification(notificationId);
    }, duration);

    notification.data('timer', timer);
    
    function removeNotification(id) {
      const notification = $(`#${id}`);
      if (notification.length) {
        clearTimeout(notification.data('timer'));
        notification.removeClass('show');
        setTimeout(() => {
          notification.remove();
        }, 300);
      }
    }
  }

  // 显示确认对话框的函数
  function showConfirmation(message, onConfirm, onCancel) {
    setupNotificationSystem();
    
    const dialog = $('#confirmation-dialog');
    const messageEl = $('#confirmation-message');
    
    messageEl.html(message);
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

  $('#menu-item-saves a').on('click', function(e) {
    e.preventDefault(); 
    const saveInterface = $('#custom-save-load-interface');
    saveInterface.toggle(); 
    if (saveInterface.is(':visible')) {
      renderSaveSlots(); 
    }
  });

  $('#close-custom-save-menu-button').on('click', function() {
    $('#custom-save-load-interface').hide();
  });

  function renderSaveSlots() {
    const container = $('#save-slots-list').empty(); 

    for (let i = 1; i <= Config.saves.slots; i++) {
      const slotDiv = $('<div class="save-slot"></div>');
      const slotInfo = $('<div class="slot-info"></div>');
      const saveButton = $('<button class="save-button">保存到这里</button>').attr('data-slot', i);
      const loadButton = $('<button class="load-button" disabled>从此读取</button>').attr('data-slot', i); 
      const deleteButton = $('<button class="delete-button" disabled>删除存档</button>').attr('data-slot', i); 

      if (Save.slots.has(i)) { 
        const save = Save.slots.get(i);
        let title = save.title || '无标题'; 
        if (title.length > 30) { 
            title = title.substring(0, 27) + "...";
        }
        slotInfo.html(`<strong>存档 ${i}:</strong> ${title}<br><small>保存于: ${new Date(save.date).toLocaleString()}</small>`);
        loadButton.prop('disabled', false); 
        deleteButton.prop('disabled', false); 
      } else {
        slotInfo.html(`<strong>存档 ${i}:</strong> (空)`);
      }

      slotDiv.append(slotInfo).append(saveButton).append(loadButton).append(deleteButton);
      container.append(slotDiv);
    }
  }

  function createSaveNameDialog(slotId) {
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

    $('body').append(dialog);

    const defaultName = `自动存档 - ${State.passage} - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    $('#save-name-input').val(defaultName);

    $('.template-button').on('click', function() {
      let template = $(this).data('template');
      template = template.replace('[场景]', State.passage)
                        .replace('[时间]', new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
                        .replace('[日期]', new Date().toLocaleDateString())
                        .replace('[玩家名称]', State.variables.playerName || '主角');
      $('#save-name-input').val(template);
    });

    $('#save-name-confirm').on('click', function() {
      const saveName = $('#save-name-input').val().trim() || defaultName;
      saveSaveGame(slotId, saveName);
      dialog.remove();
    });

    $('#save-name-cancel').on('click', function() {
      dialog.remove();
    });

    if (!$('style#save-name-dialog-styles').length) {
      $('head').append(`
        <style id="save-name-dialog-styles">
          .save-name-dialog {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0, 0, 0, 0.8); z-index: 2000;
            display: flex; justify-content: center; align-items: center;
          }
          .save-name-content {
            background-color: rgba(10, 10, 10, 0.95); border: 2px solid #d4af37;
            border-radius: 8px; padding: 20px; width: 90%; max-width: 500px; color: #e0e0e0;
          }
          .save-name-content h3 {
            color: #d4af37; text-align: center; margin-top: 0; margin-bottom: 20px;
            text-shadow: 0 0 5px rgba(212, 175, 55, 0.5); padding-bottom: 10px;
            border-bottom: 1px solid #d4af37;
          }
          .save-name-input-group { margin-bottom: 15px; }
          .save-name-input-group label { display: block; margin-bottom: 5px; color: #d4af37; }
          .save-name-input-group input {
            width: 100%; padding: 8px; border: 1px solid rgba(212, 175, 55, 0.5);
            background-color: rgba(30, 30, 30, 0.8); color: #e0e0e0; border-radius: 4px;
            box-sizing: border-box;
          }
          .save-name-templates { margin-bottom: 20px; }
          .save-name-templates label { display: block; margin-bottom: 8px; color: #d4af37; }
          .template-button {
            background-color: rgba(30, 30, 30, 0.8); color: #e0e0e0;
            border: 1px solid rgba(212, 175, 55, 0.5); padding: 6px 10px;
            margin-right: 8px; margin-bottom: 8px; border-radius: 4px;
            cursor: pointer; transition: all 0.2s ease;
          }
          .template-button:hover {
            background-color: rgba(212, 175, 55, 0.3); border-color: #d4af37;
          }
          .save-name-buttons { display: flex; justify-content: flex-end; gap: 10px; }
          .save-name-buttons button {
            padding: 8px 15px; border-radius: 4px; cursor: pointer; transition: all 0.3s ease;
          }
          #save-name-cancel {
            background-color: rgba(50, 50, 50, 0.8); color: #e0e0e0;
            border: 1px solid rgba(150, 150, 150, 0.5);
          }
          #save-name-cancel:hover {
            background-color: rgba(70, 70, 70, 0.9); border-color: rgba(180, 180, 180, 0.7);
          }
          #save-name-confirm {
            background-color: rgba(0, 0, 0, 0.7); color: #d4af37; border: 1px solid #d4af37;
          }
          #save-name-confirm:hover {
            background-color: #d4af37; color: #000000;
            box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
          }
        </style>
      `);
    }
  }

  function saveSaveGame(slotId, title) {
    try {
      Save.slots.save(slotId, title);
      showNotification(`游戏已保存到存档 ${slotId}："${title}"`, 'success');
      renderSaveSlots(); 
    } catch (e) {
      showNotification(`保存失败: ${e.message || e}`, 'error');
      console.error("Save game error:", e);
    }
  }

  $('#save-slots-list').on('click', '.save-button', function() {
    const slotId = parseInt($(this).attr('data-slot'), 10);
    createSaveNameDialog(slotId);
  });

  $('#save-slots-list').on('click', '.load-button', function() {
    const slotId = parseInt($(this).attr('data-slot'), 10);
    if (!Save.slots.has(slotId)) {
      showNotification(`存档 ${slotId} 是空的，无法读取。`, 'warning');
      return;
    }
    
    showConfirmation(`确定要从存档 ${slotId} 读取吗?<br>当前未保存的进度将会丢失。`, function() { 
      try {
        Save.slots.load(slotId);
        $('#custom-save-load-interface').hide(); 
      } catch (e) {
        showNotification(`读取失败: ${e.message || e}`, 'error');
        console.error("Load game error:", e);
      }
    });
  });

  $('#save-slots-list').on('click', '.delete-button', function() {
    const slotId = parseInt($(this).attr('data-slot'), 10);
    if (!Save.slots.has(slotId)) {
      showNotification(`存档 ${slotId} 已经是空的。`, 'info');
      return;
    }
    
    showConfirmation(`确定要删除存档 ${slotId} 吗?<br>此操作无法撤销。`, function() {
      try {
        Save.slots.delete(slotId);
        showNotification(`存档 ${slotId} 已删除。`, 'success');
        renderSaveSlots(); 
      } catch (e) {
        showNotification(`删除失败: ${e.message || e}`, 'error');
        console.error("Delete game error:", e);
      }
    });
  });

  // --- NEW: Export and Import Functionality ---

  // Export All Saves
  $('#custom-save-load-interface').on('click', '#export-all-saves-button', function() { 
    try {
      // 获取所有的存档槽位数据
      const savesData = {};
      let hasData = false;
      
      // 检查每个槽位并将数据收集到savesData对象中
      for (let i = 1; i <= Config.saves.slots; i++) {
        if (Save.slots.has(i)) {
          hasData = true;
          const save = Save.slots.get(i);
          savesData[i] = {
            title: save.title,
            date: save.date,
            data: save.state
          };
        }
      }
      
      if (!hasData) {
        showNotification('没有可导出的存档数据。所有存档槽位都为空。', 'warning');
        return;
      }
      
      // 将数据转换为JSON字符串
      const jsonData = JSON.stringify(savesData);
      
      // 创建一个带日期的文件名
      const date = new Date();
      const dateString = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}`;
      const filename = `sugarcube_saves_${Config.saves.id || 'game'}_${dateString}.save`;
      
      // 创建Blob并下载
      const blob = new Blob([jsonData], { type: 'application/json;charset=utf-8' });
      
      if (typeof saveAs === 'function') {
        saveAs(blob, filename);
      } else {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      }
      
      showNotification('所有存档已成功导出为 ' + filename, 'success', 7000);
    } catch (e) {
      showNotification(`导出存档失败: ${e.message || e}`, 'error');
      console.error('Save export error:', e);
    }
  });

  // Trigger hidden file input when "Import Saves" button is clicked
  $('#custom-save-load-interface').on('click', '#import-saves-button', function() {
    $('#import-file-input').val(null).click();
  });

  $('#custom-save-load-interface').on('change', '#import-file-input', function(event) { 
    const file = event.target.files && event.target.files[0];
    if (!file) {
      return; 
    }

    showConfirmation(
      '导入存档将会<strong style="color: #F44336;">覆盖</strong>当前所有存档槽位，<br>且此操作<strong style="color: #F44336;">无法撤销</strong>。<br>您确定要导入吗？',
      async function() { 
        try {
          // 读取选择的文件内容
          const reader = new FileReader();
          
          reader.onload = function(e) {
            try {
              // 解析JSON数据
              const savesDataFromFile = JSON.parse(e.target.result); 
              console.log("Import: Parsed data from file:", savesDataFromFile);

              // 写入存档槽位
              let importedCount = 0;
              
              for (const slotId in savesDataFromFile) {
                if (savesDataFromFile.hasOwnProperty(slotId)) {
                  const saveData = savesDataFromFile[slotId];
                  console.log(`Import: Processing slotId ${slotId}`, saveData);
                  
                  // 检查数据是否有效
                  if (saveData && saveData.data) {
                    console.log(`Import: Slot ${slotId} has data field:`, saveData.data);
                    Save.slots.save(parseInt(slotId), saveData.title, saveData.data); 
                    importedCount++;
                  } else {
                    console.warn(`Import: Slot ${slotId} is missing 'data' field or it's falsey. SaveData:`, saveData);
                  }
                }
              }
              
              if (importedCount > 0) {
                showNotification(`成功导入了 ${importedCount} 个存档`, 'success', 7000);
                renderSaveSlots(); // 刷新存档槽位显示
              } else {
                showNotification('导入的文件中没有有效的存档数据', 'warning');
              }
            } catch (parseError) {
              showNotification(`解析存档文件失败: ${parseError.message || parseError}`, 'error');
              console.error('Parse error:', parseError);
            }
          };
          
          reader.onerror = function() {
            showNotification('读取文件时出错', 'error');
          };
          
          // 开始读取文件
          reader.readAsText(file);
          
        } catch (e) {
          showNotification(`导入存档失败: ${e.message || e}`, 'error', 7000);
          console.error('Save import error:', e);
        } finally {
          $(event.target).val(null); 
        }
      },
      function() { 
        showNotification('存档导入已取消。', 'info');
        $(event.target).val(null); 
      }
    );
  });
  
  // 初始设置通知系统
  setupNotificationSystem();

  if (typeof saveAs !== 'function') {
    console.warn("FileSaver.js not found. Using fallback download method for export. For a better experience, consider including FileSaver.js.");
  }

}); 