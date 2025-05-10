/**
 * 通知系统模块
 * 提供游戏内通知和确认对话框功能
 */

// 初始化通知系统
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
  }
}

/**
 * 显示通知
 * @param {string} message - 通知消息内容
 * @param {string} type - 通知类型 (info, success, error, warning)
 * @param {number} duration - 显示时间(毫秒)
 */
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

/**
 * 显示确认对话框
 * @param {string} message - 确认消息内容
 * @param {Function} onConfirm - 确认回调函数
 * @param {Function} onCancel - 取消回调函数
 */
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

// 导出模块方法
window.Notifications = {
  setup: setupNotificationSystem,
  show: showNotification,
  confirm: showConfirmation
}; 