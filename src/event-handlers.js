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
    const menuWithData = {
      'menu-all-tasks': data.tasks,
      'menu-no-class' : data.noClassTasks,
      'menu-trash'    : data.removedTasks,
      'menu-finding'  : data.searchedTasks
    };

    let tasks = null;
    if(e.detail.menu === 'x-folder') {
      tasks = data.getTasksByFolder(e.detail.id);
    } else {
      tasks = menuWithData[e.detail.menu];
    }

    const taskId = (tasks.length === 0) ? 0 : tasks[0].id;

    $items.show(tasks);
    $editor.show(taskId);
  });

  $items.addEventListener('load', (e) => {
    $editor.show(e.detail.taskId);
  });
}

export default handleEvent;
