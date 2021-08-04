class Folder extends HTMLElement {
  constructor() {
    super();

    this.innerHTML = ''
      + '<div class="new">'
        + '<span>+ 新建代办</span>'
      + '</div>'
      + '<ul class="menu">'
        + '<li>全部笔记</li>'
        + '<li>未分类</li>'
        + '<li>我的文件夹</li>'
        + '<li>回收站</li>'
      + '</ul>';

  }
}

export default Folder;
