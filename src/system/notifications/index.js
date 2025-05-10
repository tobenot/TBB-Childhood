/**
 * 通知系统入口文件
 * 导入并初始化通知系统
 */

// 导入通知系统模块
importScripts("notifications.js");

// 初始化通知系统
$(document).ready(function() {
  // 初始化通知系统
  Notifications.setup();
  
  // 添加全局错误处理器
  window.onerror = function(message, source, lineno, colno, error) {
    Notifications.show(`发生错误: ${message}`, 'error');
    return false; // 让默认错误处理器继续执行
  };
  
  // 在游戏启动时显示欢迎通知
  setTimeout(function() {
    if (typeof State !== 'undefined' && State.passage === State.variables.startPassage) {
      Notifications.show('欢迎来到游戏！', 'info', 3000);
    }
  }, 1000);
}); 