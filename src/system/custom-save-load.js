$(document).ready(function() {
  // --- 配置 ---
  // 设置您希望拥有的存档槽数量
  Config.saves.slots = 5; // 例如，5个存档槽

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

  // 事件委托：处理保存按钮点击 (因为按钮是动态生成的)
  $('#save-slots-list').on('click', '.save-button', function() {
    const slotId = parseInt($(this).attr('data-slot'), 10);
    const defaultTitle = `自动存档 - ${State.passage} - ${new Date().toLocaleTimeString()}`;
    const title = prompt(`为存档 ${slotId} 输入一个标题 (或留空使用默认标题):`, defaultTitle);

    if (title === null) { // 用户点击了取消
      return;
    }

    try {
      // 第三个参数 'metadata' 是可选的，可以用来存储额外信息
      // 例如: Save.slots.save(slotId, title || defaultTitle, { currentPassage: State.passage });
      Save.slots.save(slotId, title || defaultTitle);
      alert(`游戏已保存到存档 ${slotId}："${title || defaultTitle}"`);
      renderSaveSlots(); // 刷新存档槽显示
    } catch (e) {
      alert(`保存失败: ${e.message}`);
    }
  });

  // 事件委托：处理读取按钮点击
  $('#save-slots-list').on('click', '.load-button', function() {
    const slotId = parseInt($(this).attr('data-slot'), 10);
    if (!Save.slots.has(slotId)) {
        alert(`存档 ${slotId} 是空的，无法读取。`);
        return;
    }
    if (confirm(`确定要从存档 ${slotId} 读取吗? 当前未保存的进度将会丢失。`)) {
      try {
        Save.slots.load(slotId);
        $('#custom-save-load-interface').hide(); // 读取成功后关闭自定义存档界面
      } catch (e) {
        alert(`读取失败: ${e.message}`);
      }
    }
  });

  // 事件委托：处理删除按钮点击
  $('#save-slots-list').on('click', '.delete-button', function() {
    const slotId = parseInt($(this).attr('data-slot'), 10);
     if (!Save.slots.has(slotId)) {
        alert(`存档 ${slotId} 已经是空的。`);
        return;
    }
    if (confirm(`确定要删除存档 ${slotId} 吗? 此操作无法撤销。`)) {
      try {
        Save.slots.delete(slotId);
        alert(`存档 ${slotId} 已删除。`);
        renderSaveSlots(); // 刷新存档槽显示
      } catch (e) {
        alert(`删除失败: ${e.message}`);
      }
    }
  });
}); 