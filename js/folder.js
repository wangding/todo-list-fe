class Folder extends HTMLElement {
  constructor() {
    super();

    this.innerHTML = ''
      + '<div class="new">'
        + '<img class="icon" src="../images/add.svg">'
        + '<span>新建代办</span>'
      + '</div>'
      + '<ul class="menu">'
        + '<li class="all-tasks">'
          + '<img class="icon" src="../images/all-tasks.svg">'
          + '<span>全部笔记</span>'
        + '</li>'
        + '<li class="no-class">'
          + '<img class="icon" src="../images/folder.svg">'
          + '<span>未分类</span>'
        + '</li>'
        + '<li class="my-folders">'
          + '<img class="icon" src="../images/folder-root.svg">'
          + '<span>我的文件夹</span>'
          + '<img class="icon expand" src="../images/arr-right.svg">'
          + '<img class="icon add-folder" src="../images/add.svg">'
        + '</li>'
        + '<li class="trash">'
          + '<img class="icon" src="../images/trash.svg">'
          + '<span>回收站</span>'
        + '</li>'
        + '<li class="finding">'
          + '<img class="icon" src="../images/search.svg">'
          + '<span>搜索结果</span>'
        +'</li>'
      + '</ul>';

    this.$ = this.querySelector;

    const $newTask  = this.$('.new'),
          $menu = this.$('.menu');

    $newTask.onclick = () => console.log('new task!');
    $menu.onclick = (e) => {
      console.log(this.#getMenuItem(e));
    };

  }

  #getMenuItem(e) {
    const classNames = ['all-tasks', 'no-class', 'icon expand', 'icon add-folder', 'trash', 'finding', 'folder-x'];
    for(let i=0; i<4; i++) {
      let item = e.path[i];
      if(classNames.indexOf(item.className) !== -1) return item.className;
    }
  }
}

export default Folder;
