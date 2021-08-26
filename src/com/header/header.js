import data from '../../data.js';

class Header extends HTMLElement {
  constructor() {
    super();

    this.$ = this.querySelector;
    this.innerHTML = this.#html;

    const $txtKeyWord = this.$('input'),
          $btnSearch  = this.$('button');

    $btnSearch.onclick = () => {
      const keyWord = $txtKeyWord.value;

      if(keyWord === '') return;

      $txtKeyWord.value = '';
      const evt = new CustomEvent('search', {
        detail: { keyWord },
        bubbles: true
      });

      this.dispatchEvent(evt);
    };
  }

  #html = ''
    + '<div class="logo">'
      + '<img src="./src/com/header/cloud.svg">'
      + '<span class="app-title">云待办事项</span>'
    + '</div>'
    + '<div class="search">'
      + '<input type="text" placeholder="搜索全部待办事项">'
      + '<button>搜索</button>'
    + '</div>'
    + '<div class="user">'
      + `<span class="username">${data.email}</span>`
      + '<span class="split">|</span>'
      + '<a class="exit" href="#/logout">退出</a>'
    + '</div>';
}

export default Header;
