function handleEvent() {
  $header.addEventListener('search', (e) => {
    const keyWord = e.detail.keyWord;
    const res = data.searchTasks(keyWord);

    if(res.length === 0) {
      alert('没有找到匹配的待办事项！');
      return;
    }

    console.log(res);
    $folder.turnToFinding();
  });

  $folder.addEventListener('addTask', (e) => {
    console.log(e.detail.folderId);

    // items 添加一个空白待办事项
    // editor 添加一个空白待办事项
  });

  $folder.addEventListener('loadItems', (e) => {
    const { menu, id } = e.detail;
    let tasks = data.getTasksByMenu(menu, id);
    const taskId = (tasks.length === 0) ? 0 : tasks[0].id;

    $items.show(tasks, `${e.detail.menu}:${e.detail.id}`);
    $editor.show(taskId);
  });

  $items.addEventListener('load', (e) => {
    $editor.show(e.detail.taskId);
  });
}

export default handleEvent;
