class Folder extends HTMLElement {
  constructor() {
    super();

    this.innerHTML = ''
      + '<div class="new">'
        + '<img class="icon" src="../images/add.svg">'
        + '<span>新建代办</span>'
      + '</div>'
      + '<ul class="menu">'
        + '<li data-id="menu-all-tasks" class="actived">'
          + '<img class="icon" src="../images/all-tasks.svg">'
          + '<span>全部笔记</span>'
        + '</li>'
        + '<li data-id="menu-no-class">'
          + '<img class="icon" src="../images/folder.svg">'
          + '<span>未分类</span>'
        + '</li>'
        + '<li data-id="menu-my-folders">'
          + '<img class="icon" src="../images/folder-root.svg">'
          + '<span>我的文件夹</span>'
          + '<img class="icon expand" src="../images/arr-right.svg">'
          + '<img class="icon add-folder" src="../images/add.svg">'
        + '</li>'
        + '<li data-id="menu-trash">'
          + '<img class="icon" src="../images/trash.svg">'
          + '<span>回收站</span>'
        + '</li>'
        + '<li data-id="menu-finding">'
          + '<img class="icon" src="../images/search.svg">'
          + '<span>搜索结果</span>'
        +'</li>'
      + '</ul>';

    this.$ = this.querySelector;

    const $addTask  = this.$('.new'),
          $addFolder = this.$('.add-folder');

    this.#getMenuItems();
    this.#activedMenuItem = this.#menuItems[0];

    $addFolder.onclick = this.#addFolderHandler;
    $addTask.onclick = this.#eventHandlers.addTask;

    for(let menu in this.#menuItems) {
      this.#menuItems[menu].onclick = function(e) {
        console.log(this.dataset.id);
        // 得到点击的菜单 li 对象

        // 设置该菜单项为激活样式

        // 取消上一个菜单的激活样式

        // 调用该菜单的事件处理
        //this.#eventHandlers[];
      }
    }
  }

  #menuItems = {}
  #activedMenuItem = null
  #eventHandlers = {
    addTask: null
  }
  #folders = []

  #getMenuItems() {
    const items = this.querySelectorAll('.menu>li');
    items.forEach( item => {
      this.#menuItems[item.dataset.id] = item;
    });

    this.#activedMenuItem = this.#menuItems[menu-all-tasks];
  }

  #addFolderHandler() {
    const folderName = prompt('请输入文件夹名称：');

    if(folderName === '') {
      alert('添加文件夹失败！文件夹名称不能为空');
      return;
    }

    if(this.#folders.indexOf(folderName) !== -1) {
      alert('添加文件夹失败！文件夹的名称与已有的文件夹同名！');
      return;
    }

    this.#folders.push(folderName);

    // todo: 调用 api 向数据库里插入记录
  }

  setEventHandlers(handlers) {
    this.#eventHandlers = handlers;
  }

  setFolders(folders) {
    this.#folders = folders;
  }

  #setMenuItemActived() {

  }
}

export default Folder;
