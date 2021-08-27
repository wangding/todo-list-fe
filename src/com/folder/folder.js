import data from '../../data.js';

class Folder extends HTMLElement {
  constructor() {
    super();

    this.$ = this.querySelector;
    this.innerHTML  = this.#html;
    this.#$myFolder = this.$('.menu .menu');
    this.#createFolderNode(data.folders);

    this.#getMenuItems();
    this.#$folderMenu    = this.$('ul.folder-menu');
    this.#activeMenuItem = this.#menuItems['menu-all-tasks'];
    this.#$addTask       = this.$('.add-task');

    /* addTask onclick */
    this.#$addTask.onclick = this.#onAddTask.bind(this);

    /* menu operation: onclick */
    const that = this;
    for(const id in this.#menuItems) {
      this.#menuItems[id].onclick = function() {
        that.#setMenuItemActive(this);
        that.#showAddTask(id !== 'menu-trash' && id !== 'menu-finding');

        const menu = this.dataset.id;
        const evt = new CustomEvent('loadItems', {
          detail: { menu },
          bubbles: true
        });

        this.dispatchEvent(evt);
      }
    }

    // override upside menu onclick event handle
    this.#menuItems['menu-my-folders'].onclick = this.#showMyFolder.bind(this);

    /* folders operation: click */
    this.#$myFolder.onclick = this.#onFolderClick.bind(this);

    /* folder menu operation: add, rename, delete */
    this.$('.add-folder').onclick    = this.#onAddFolder.bind(this);
    this.$('.rename-folder').onclick = this.#onRenameFolder.bind(this);
    this.$('.delete-folder').onclick = this.#onDeleteFolder.bind(this);
  }

  turnToAllTasks() {
    this.#menuItems['menu-all-tasks'].click();
  }

  turnToFinding() {
    this.#menuItems['menu-finding'].click();
  }

  #menuItems = {};
  #activeMenuItem = null;
  #$myFolder = null;
  #$folderMenu = null;
  #$currentFolder = null;
  #$addTask = null;

  #showMyFolder() {
    const className = this.#$myFolder.className,
          $expandImg = this.$('img.expand');

    if(className === 'menu') { // 'myFolder' is not folding, need to fold (hide)
      this.#$myFolder.className = 'menu hide';
      $expandImg.src = './src/com/folder/arr-right.svg';
    } else {  // 'myFolder' is folding, need to expand
      this.#$myFolder.className = 'menu';
      $expandImg.src = './src/com/folder/arr-down.svg';
    }
  }

  #createFolderNode(folders) {
    folders.forEach(folder => {
      const dom = this.#genFolderDom(folder.name, folder.id);
      this.#$myFolder.insertAdjacentHTML('beforeend', dom);
    });
  }

  #getMenuItems() {
    const items = this.querySelectorAll('div.add-task + ul.menu > li');
    items.forEach(item => {
      this.#menuItems[item.dataset.id] = item;
    });
  }

  #setMenuItemActive(item) {
    if(item.dataset.id === 'menu-my-folders') return;

    this.#activeMenuItem.className = '';
    item.className = 'active';
    this.#activeMenuItem = item;
  }

  #genFolderDom(folderName, folderId) {
    const folderDom = ''
      + `<li data-id="${folderId}">`
        + '<img class="icon" src="./src/com/folder/folder.svg">'
        + `<span title="${folderName}">${folderName.slice(0,5)}</span>`
        + '<div class="folder-menu-handle">'
        + '</div>'
      + '</li>';

    return folderDom;
  }

  #showFolderMenu(x, y) {
    this.#$folderMenu.className = 'folder-menu menu';
    this.#$folderMenu.style.top = y + 'px';
    this.#$folderMenu.style.left = x + 'px';
  }

  #hideFolderMenu() {
    this.#$folderMenu.className = 'folder-menu menu hide';
  }

  #showAddTask(yesOrNo) {
    const $img  = this.#$addTask.querySelector('img'),
          $span = this.#$addTask.querySelector('span');

    this.#$addTask.className = yesOrNo ? 'add-task': 'add-task hide';
    $img.className = yesOrNo ? 'icon' : 'icon hide';
    $span.className = yesOrNo ? '' : 'hide';
  }

  #onAddTask() {
    const folderId = this.#activeMenuItem.dataset.id;
    const evt = new CustomEvent('addTask', {
      detail: { folderId },
      bubbles: true
    });

    this.dispatchEvent(evt);
  }

  #onFolderClick(e) {
    if(e.target.className === 'folder-menu-handle') { // show folder menu
      this.#$currentFolder = e.target.parentNode;
      e.stopPropagation();
      this.#showFolderMenu(e.clientX, e.clientY);
      return;
    }

    if(this.#$folderMenu.className === 'folder-menu menu') { // folder-menu already appear
      this.#hideFolderMenu();
    }

    const target = e.target;
    this.#setMenuItemActive(target);
    this.#showAddTask(true);
    const evt = new CustomEvent('loadItems', {
      detail: { menu: 'x-folder', id: target.dataset.id },
      bubbles: true
    });

    this.dispatchEvent(evt);
  }

  async #onAddFolder(e) {
    e.stopPropagation();
    const folderName = prompt('请输入文件夹名称：');

    try {
      const folderId = await data.addFolder(folderName);
      const folderDom = this.#genFolderDom(folderName, folderId);
      this.#$myFolder.insertAdjacentHTML('afterbegin', folderDom);
    } catch(e) {
      alert(e.message);
    }
  }

  async #onRenameFolder () {
    this.#hideFolderMenu();
    const folderName = prompt('请输入文件夹的名称：');

    try {
      const id = Number(this.#$currentFolder.dataset.id);
      await data.renameFolder(id, folderName);

      const $span = this.#$currentFolder.querySelector('span');
      $span.innerHTML = folderName;
      $span.title = folderName;
    } catch(e) {
      alert(e.message);
    }
  }

  async #onDeleteFolder () {
    this.#hideFolderMenu();

    const id = Number(this.#$currentFolder.dataset.id);
    await data.deleteFolder(id);

    this.#$currentFolder.remove();
  }

  #html = ''
      + '<div class="add-task">'
        + '<img class="icon" src="./src/com/folder/add.svg">'
        + '<span>新建待办</span>'
      + '</div>'
      + '<ul class="menu">'
        + '<li data-id="menu-all-tasks" class="active">'
          + '<img class="icon" src="./src/com/folder/all-tasks.svg">'
          + '<span>全部待办</span>'
        + '</li>'
        + '<li data-id="menu-no-class">'
          + '<img class="icon" src="./src/com/folder/folder.svg">'
          + '<span>未分类</span>'
        + '</li>'
        + '<li data-id="menu-my-folders">'
          + '<img class="icon" src="./src/com/folder/folder-root.svg">'
          + '<span>我的文件夹</span>'
          + '<img class="icon expand" src="./src/com/folder/arr-right.svg">'
          + '<img class="icon add-folder" src="./src/com/folder/add.svg">'
        + '</li>'
        + '<ul class="menu hide"></ul>'
        + '<li data-id="menu-trash">'
          + '<img class="icon" src="./src/com/folder/trash.svg">'
          + '<span>回收站</span>'
        + '</li>'
        + '<li data-id="menu-finding">'
          + '<img class="icon" src="./src/com/folder/search.svg">'
          + '<span>搜索结果</span>'
        +'</li>'
      + '</ul>'
      + '<ul class="folder-menu menu hide">'
        + '<li class="rename-folder">重命名文件夹</li>'
        + '<li class="delete-folder">删除文件夹</li>'
      + '</ul>';
}

export default Folder;
