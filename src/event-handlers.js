function addTask() {
  console.log('addTask event handler');
  // $items 列表组件中添加一个新代办事项
  // $editor 组件中清空内容
  //$items.addTask();
  //$editor.new();
}

function allTasks() {
  console.log('menu-all-tasks event handler');

  // $items 列表组件中展示所有待办事项
  // $editor 组件中显示 $items 中第一个待办事项
  $items.show(data.allTasks);
  $editor.show(data.allTasks[0]);
}

function noClass() {
  console.log('menu-no-class event handler');

  // $items 列表组件中展示所有没有分类的待办事项
  // $editor 组件中显示 $items 中第一个待办事项
  $items.show(data.noClassTasks);
  $editor.show(data.noClassTasks[0]);
}

function myFolder() {
  console.log('menu-my-folder event handler');
  // 根据折叠状态，显示所有文件夹或者隐藏所有文件夹
  $folder.showMyFolder();
}

function trash() {
  console.log('menu-trash event handler');

  // $items 列表组件中展示所有删除的待办事项
  // $editor 组件中显示 $items 中第一个待办事项
  $items.show(data.removedTasks);
  $editor.show(data.removedTasks[0]);
}

function finding() {
  console.log('menu-finding event handler');

  // $items 列表组件中展示所有找到的待办事项
  // $editor 组件中显示 $items 中第一个待办事项
  $items.show(data.searchedTasks);
  $editor.show(data.searchedTasks[0]);
}

const eventHandlers = {
  'addTask':         addTask,
  'menu-all-tasks':  allTasks,
  'menu-no-class':   noClass,
  'menu-my-folders': myFolder,
  'menu-trash':      trash,
  'menu-finding':    finding
};

export default eventHandlers;
