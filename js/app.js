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
  customElements.define('login-box', LoginBox);

  let $body = $('body');
  $body.innerHTML = '<login-box></login-box>';
}

function defineWebComponents() {
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
  defineWebComponents();
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

const app = {
  isLogin,
  showLogin,
  showHome
}

export default app;
