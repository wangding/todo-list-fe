import LoginBox from './login.js';
import Header from './header.js';
import Folder from './folder.js';
import Items from './items.js';
import Editor from './editor.js';
import SignupBox from './signup.js';

const q = document.querySelector,
      $ = q.bind(document);

const $body = $('body');

function isLogin() {
  const sid = localStorage.getItem('sid');
  return !(sid === null);
}

function showLogin() {
  $body.innerHTML = '<login-box></login-box>';
}

function showSignup() {
  $body.innerHTML = '<signup-box></signup-box>';
}

function defineWebComponents() {
  customElements.define('signup-box', SignupBox);
  customElements.define('login-box', LoginBox);
  customElements.define('todo-header', Header);
  customElements.define('todo-folder', Folder);
  customElements.define('todo-items', Items);
  customElements.define('todo-editor', Editor);
}

function showHome() {
  $body.innerHTML = '';
  $body.insertAdjacentHTML('beforeend','<todo-header></todo-header>');
  $body.insertAdjacentHTML('beforeend', '<main></main>');

  const $main = $body.querySelector('main');

  $main.insertAdjacentHTML('beforeend', '<todo-folder></todo-folder>');
  $main.insertAdjacentHTML('beforeend', '<todo-items></todo-items>');
  $main.insertAdjacentHTML('beforeend', '<todo-editor></todo-editor>');
}

function registRouter() {
  location.hash = '';      // 初始化 hash 为空，确保后续的路由能正常工作

  window.onhashchange = () => {
    switch(location.hash) {
      case '#/login':
        showLogin();
        break;

      case '#/logout':
        localStorage.removeItem('sid');
        location.hash = '#/login';
        break;

      case '#/signup':
        showSignup();
        break;

      case '#/home':
        showHome();
        break;

      default:
        console.trace(`路由：${location.hash} 没有处理！`);
        break;
    }
  };
}

let isInitalized = false;  // App 是否被初始化，默认没有初始化

function init() {
  if(!isInitalized) {  // 确保 WebComponents 只定义一次
    defineWebComponents();
    isInitalized = true;
  }

  registRouter();

  location.hash = (isLogin()) ? '#/home' : '#/login';
}

const app = { init };

export default app;
