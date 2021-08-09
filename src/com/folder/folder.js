class Folder extends HTMLElement {
  constructor() {
    super();

    this.innerHTML = ''
      + '<div class="new">'
        + '<img class="icon" src="./src/com/folder/add.svg">'
        + '<span>新建代办</span>'
      + '</div>'
      + '<ul class="menu">'
        + '<li data-id="menu-all-tasks" class="actived">'
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
          + '<ul class="menu"></ul>'
        + '</li>'
        + '<li data-id="menu-trash">'
          + '<img class="icon" src="./src/com/folder/trash.svg">'
          + '<span>回收站</span>'
        + '</li>'
        + '<li data-id="menu-finding">'
          + '<img class="icon" src="./src/com/folder/search.svg">'
          + '<span>搜索结果</span>'
        +'</li>'
      + '</ul>';

    this.$ = this.querySelector;

    const $addTask  = this.$('.new'),
          $addFolder = this.$('.add-folder');

    this.#getMenuItems();
    this.#$myFolder = this.$('.menu .menu');
    this.#activedMenuItem = this.#menuItems['menu-all-tasks'];

    $addTask.onclick = () => this.#eventHandlers['addTask']();
    $addFolder.onclick = this.#addFolderHandler.bind(this);

    const that = this;

    for(let menu in this.#menuItems) {
      this.#menuItems[menu].onclick = function() {
        that.#setMenuItemActived(this);

        that.#eventHandlers[this.dataset.id]();
      }
    }
  }

  showMyFolder() {
    console.log('show my folder');
  }

  setEventHandlers(handlers) {
    this.#eventHandlers = handlers;
  }

  setFolders(folders) {
    this.#folders = [...folders];

  }

  #menuItems = {}
  #activedMenuItem = null
  #eventHandlers = {
    'addTask': null,
    'menu-all-tasks': null,
    'menu-no-class': null,
    'menu-my-folders': null,
    'menu-trash': null,
    'menu-finding': null
  }
  #folders = []
  #isFolding = true  // 【我的文件夹】状态：true 折叠，false 展开
  #$myFolder = null

  #getMenuItems() {
    const items = this.querySelectorAll('.menu>li');
    items.forEach( item => {
      this.#menuItems[item.dataset.id] = item;
    });
  }

  async #addFolderHandler(e) {
    e.stopPropagation();
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
    console.log(`添加了文件夹：${folderName}`);

    const apiURL = 'http://192.168.174.133:8080/api/folders';
    let rs = await axios.post(apiURL, { 'item': folderName });
    rs = rs.data;
    console.log(rs);
  }

  #setMenuItemActived(item) {
    item.className = 'actived';

    this.#activedMenuItem.className = '';
    this.#activedMenuItem = item;
  }
}

export default Folder;
