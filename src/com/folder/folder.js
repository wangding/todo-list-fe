class Folder extends HTMLElement {
  constructor() {
    super();

    this.$ = this.querySelector;
    this.innerHTML = this.#html;

    const that = this,
          $addTask  = this.$('.new'),
          $addFolder = this.$('.add-folder');

    this.#getMenuItems();
    this.#$myFolder       = this.$('.menu .menu');
    this.#$folderMenu     = this.$('ul.folder-menu');
    this.#activeMenuItem = this.#menuItems['menu-all-tasks'];

    $addTask.onclick = () => this.#eventHandlers['addTask']();
    $addFolder.onclick = this.#onAddFolder.bind(this);

    this.#$myFolder.onclick = (e) => {
      if(e.target.className === 'folder-menu-handle') {
        this.#$currentFolder = e.target.parentNode;
        e.stopPropagation();
        this.#showFolderMenu(e.clientX, e.clientY);
        return;
      }

      if(this.#$folderMenu.className === 'folder-menu menu') { // folder-menu appear
        this.#hideFolderMenu();
      }

      const target =  e.target;
      this.#setMenuItemActive(target);
      this.#eventHandlers['x-folder'](target.dataset.id);
    };

    for(let menu in this.#menuItems) {
      this.#menuItems[menu].onclick = function() {
        that.#setMenuItemActive(this);
        that.#eventHandlers[this.dataset.id]();
      }
    }

    this.$('.rename-folder').onclick = () => this.#onRenameFolder();
    this.$('.delete-folder').onclick = () => this.#onDeleteFolder();
  }

  showMyFolder() {
    const className = this.#$myFolder.className,
          $expandImg = this.$('img.expand');

    if(className === 'menu') { // 我的文件夹没有折叠，需要隐藏起来
      this.#$myFolder.className = 'menu hide';
      $expandImg.src = './src/com/folder/arr-right.svg';
    } else {  // 我的文件夹折叠了，需要展开
      this.#$myFolder.className = 'menu';
      $expandImg.src = './src/com/folder/arr-down.svg';
    }
  }

  setEventHandlers(handlers) {
    this.#eventHandlers = handlers;
  }

  setFolders(folders) {
    this.#folders = folders;

    this.#folders.forEach(item => {
      let folderDom = this.#genFolderDom(item.name, item.id);
      this.#$myFolder.insertAdjacentHTML('beforeend', folderDom);
    });
  }

  #menuItems = {};
  #activeMenuItem = null;
  #eventHandlers = {
    'addTask': null,
    'menu-all-tasks': null,
    'menu-no-class': null,
    'menu-my-folders': null,
    'menu-trash': null,
    'menu-finding': null,
    'x-folder': null,
    'addFolder': null,
    'deleteFolder': null,
    'renameFolder': null
  };
  #folders = [];
  #$myFolder = null;
  #$folderMenu = null;
  #$currentFolder = null;

  #getMenuItems() {
    const items = this.querySelectorAll('div.new + ul.menu > li');
    items.forEach( item => {
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
    let folderDom = ''
        + `<li data-id="${folderId}">`
          + '<img class="icon" src="./src/com/folder/folder.svg">'
          + `<span title="${folderName}">${folderName.slice(0,5)}</span>`
          + '<div class="folder-menu-handle">'
          + '</div>'
        + '</li>';

    return folderDom;
  }

  #exist(folderName) { // 判断 folderName 是否已经存在
    for(let i=0; i<this.#folders.length; i++) {
      if(this.#folders[i].name === folderName) return true;
    }

    return false;
  }

  #showFolderMenu(x, y) {
    this.#$folderMenu.className = 'folder-menu menu';
    this.#$folderMenu.style.top = y + 'px';
    this.#$folderMenu.style.left = x + 'px';
  }

  #hideFolderMenu() {
    this.#$folderMenu.className = 'folder-menu menu hide';
  }

  #isValidName(folderName) {
    if(folderName === null) return false;

    if(folderName === '') {
      alert('添加文件夹失败！文件夹名称不能为空');
      return false;
    }

    if(this.#exist(folderName)) {
      alert('添加文件夹失败！文件夹的名称与已有的文件夹同名！');
      return false;
    }

    return true;
  }

  async #onAddFolder(e) {
    e.stopPropagation();
    const folderName = prompt('请输入文件夹名称：');

    if(!this.#isValidName(folderName)) return;

    let folderId = await this.#eventHandlers['addFolder'](folderName);
    let folderDom = this.#genFolderDom(folderName, folderId);
    this.#$myFolder.insertAdjacentHTML('afterbegin', folderDom);
  }

  #onRenameFolder () {
    this.#hideFolderMenu();
    const folderName = prompt('请输入文件夹的名称：');

    if(!this.#isValidName(folderName)) return;

    const $span = this.#$currentFolder.querySelector('span');
    $span.innerHTML = folderName;
    $span.title = folderName;

    const id = Number(this.#$currentFolder.dataset.id);
    for(let i=0; i<this.#folders.length; i++) {
      if(this.#folders[i].id === id) {
        this.#folders[i].name = folderName;
        break;
      }
    }

    this.#eventHandlers['renameFolder'](id, folderName);
  }

  #onDeleteFolder () {
    this.#hideFolderMenu();
    this.#$currentFolder.remove();

    const id = Number(this.#$currentFolder.dataset.id);
    for(let i=0; i<this.#folders.length; i++) {
      if(this.#folders[i].id === id) {
        this.#folders.splice(i, 1);
        break;
      }
    }

    this.#eventHandlers['deleteFolder'](id);
  }

  #html = ''
      + '<div class="new">'
        + '<img class="icon" src="./src/com/folder/add.svg">'
        + '<span>新建代办</span>'
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
