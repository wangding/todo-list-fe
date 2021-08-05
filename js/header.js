class Header extends HTMLElement {
  constructor() {
    super();

    this.innerHTML = ''
      + '<div class="logo">'
        + '<img src="../images/cloud.svg">'
        + '<span class="app-title">云待办事项</span>'
      + '</div>'
      + '<div class="search">'
        + '<input type="text" placeholder="搜索全部待办事项"><button>搜索</button>'
      + '</div>'
      + '<div class="user">'
        + '<span class="username">王顶 |&nbsp; </span>'
        + '<a class="exit" href="#/logout">退出</a>'
      + '</div>';
  }
}

export default Header;
