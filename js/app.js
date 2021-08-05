import LoginBox from './login.js';
import Header from './header.js';
import Folder from './folder.js';
import Items from './items.js';
import Editor from './editor.js';

const q = document.querySelector,
      $ = q.bind(document);

function isLogin() {
  const sid = localStorage.getItem('sid');
  return !(sid === null);
}

function showLogin() {
  let $body = $('body');
  $body.innerHTML = '<login-box></login-box>';
}

function defineWebComponents() {
  customElements.define('login-box', LoginBox);
  customElements.define('todo-header', Header);
  customElements.define('todo-folder', Folder);
  customElements.define('todo-items', Items);
  customElements.define('todo-editor', Editor);
}

function genPageLayout() {
  const layout = ''
    + '<div class="header"></div>'
    + '<div class="main">'
      + '<div class="folder"></div>'
      + '<div class="list"></div>'
      + '<div class="editor"></div>'
    + '</div>';

  let $body = $('body');
  $body.innerHTML = layout;
}

function showHome() {
  genPageLayout();

  const $header = $('.header');
  $header.innerHTML = '<todo-header></todo-header>';

  const $folder = $('.folder');
  $folder.innerHTML = '<todo-folder></todo-folder>';

  const $list = $('.list');
  $list.innerHTML = '<todo-items></todo-items>';

  const $editor = $('.editor');
  $editor.innerHTML = '<todo-editor></todo-editor>';
}

let isInitalized = false;  // App 是否被初始化，默认没有初始化

function init() {
  if(!isInitalized) {  // 保证 WebComponents 只初始化一次
    defineWebComponents();
    isInitalized = true;
  }

  if(location.hash !== '') location.hash = '';

  window.onhashchange = () => {
    //console.log(location.hash);
    switch(location.hash) {
      case '#/login':
        showLogin();
        break;

      case '#/logout':
        localStorage.removeItem('sid');
        location.hash = '#/login';
        break;

      case '#/home':
        showHome();
        break;

      default:
        console.trace(`路由：${location.hash} 没有处理！`);
        break;
    }
  };

  location.hash = (isLogin()) ? '#/home' : '#/login';
}

const app = { init };

export default app;
