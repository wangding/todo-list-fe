import LoginBox from './com/login/login.js';
import SignupBox from './com/signup/signup.js';

import Header from './com/header/header.js';
import Folder from './com/folder/folder.js';
import Items from './com/items/items.js';
import Editor from './com/editor/editor.js';

import eventHandlers from './event-handlers.js';
import data from './data.js';

const q = document.querySelector,
      $ = q.bind(document);

const $body = $('body');

const app = {};

async function isLogin() {
  if(data.jwt === null) return false;

  // 判断 jwt 是否过期
  const apiUrl = 'http://192.168.174.133:8080/api/tasks';
  const res = await axios.get(apiUrl, {
    headers: { 'Authorization': 'Bearer '+ data.jwt }
  });

  return (res.data.code === 0);
}

function showLogin() {
  $body.innerHTML = '<login-box></login-box>';
  $('login-box').addEventListener('loginOK', async (e) => {
    await data.init(e.detail.jwt, e.detail.email);
    location.hash = '#/home';
  });
}

function showSignup() {
  $body.innerHTML = '<signup-box></signup-box>';
  $('signup-box').addEventListener('signupOK', () => {
    alert('注册成功，点击"确定"按钮，进入登录页面！')
    location.hash = '#/login';
  });
}

function showHome() {
  $body.innerHTML = '';
  $body.insertAdjacentHTML('beforeend','<todo-header></todo-header>');
  $body.insertAdjacentHTML('beforeend', '<main></main>');

  const $main = $body.querySelector('main');

  $main.insertAdjacentHTML('beforeend', '<todo-folder></todo-folder>');
  $main.insertAdjacentHTML('beforeend', '<todo-items></todo-items>');
  $main.insertAdjacentHTML('beforeend', '<todo-editor></todo-editor>');

  window.$header = $('todo-header');
  window.$folder = $('todo-folder');
  window.$items  = $('todo-items');
  window.$editor = $('todo-editor');

  $header.setEmail(data.email);

  $folder.setEventHandlers(eventHandlers);
  $folder.setFolders(data.folders);
  $items.show(data.allTasks);
}

function defineWebComponents() {
  customElements.define('signup-box', SignupBox);
  customElements.define('login-box', LoginBox);
  customElements.define('todo-header', Header);
  customElements.define('todo-folder', Folder);
  customElements.define('todo-items', Items);
  customElements.define('todo-editor', Editor);
}

function registRouter() {
  location.hash = '';      // 初始化 hash 为空，确保后续的路由能正常工作

  window.onhashchange = () => {
    switch(location.hash) {
      case '#/login':
        showLogin();
        break;

      case '#/logout':
        data.remove();
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

app.init = async () => {
  window.data = data;

  if(!isInitalized) {  // 确保 WebComponents 只定义一次
    defineWebComponents();
    isInitalized = true;
  }

  registRouter();

  location.hash = (await isLogin()) ? '#/home' : '#/login';
};

export default app;
