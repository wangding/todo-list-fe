import LoginBox from './com/login/login.js';
import SignupBox from './com/signup/signup.js';

import Header from './com/header/header.js';
import Folder from './com/folder/folder.js';
import Items from './com/items/items.js';
import Editor from './com/editor/editor.js';

import handleEvent from './event-handlers.js';
import data from './data.js';
import { baseUrl } from './config.js';

const q = document.querySelector,
      $ = q.bind(document);

const $body = document.body;

const app = {};

async function isLogin() {
  if(data.jwt === null) return false;

  // 判断 jwt 是否过期
  const res = await axios.get(baseUrl + '/tasks', {
    headers: { 'Authorization': 'Bearer '+ data.jwt }
  });

  return (res.data.code === 0);
}

function showLogin() {
  $body.innerHTML = '<login-box></login-box>';
  $('login-box').addEventListener('login', async (e) => {
    const email = e.detail.email,
          password = e.detail.password;

    let rs = await axios.post(baseUrl + '/users/login', { email, password });
    rs = rs.data;

    if(rs.code !== 0) { // login sucess
      alert(rs.msg);
    } else { // login fail
      await data.init(rs.data, email);
      location.hash = '#/home';
    }
  });
}

function showSignup() {
  $body.innerHTML = '<signup-box></signup-box>';
  $('signup-box').addEventListener('signup', async (e) => {
    const email    = e.detail.email,
          password = e.detail.password;

    let rs = await axios.post(baseUrl + '/users/signup', { email, password });
    rs = rs.data;

    if(rs.code !== 0) { // signup fail
      alert(rs.msg);
    } else { // signup sucess
      alert('注册成功，点击"确定"按钮，进入登录页面！')
      location.hash = '#/login';
    }
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

  handleEvent();

  $folder.sendClick($folder.menu.all);
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
        data.clear();
        location.hash = '#/login';
        break;

      case '#/signup':
        showSignup();
        break;

      case '#/home':
        showHome();
        break;

      default:
        location.hash = '#/home';
        break;
    }
  };
}

app.init = async () => {
  window.data = data;

  try {
    defineWebComponents();
  } catch(e) {
    // 可能会出现重复注册 web component 的错误
    // 直接忽略，确保程序不抛出异常，而停止执行
  }

  registRouter();

  location.hash = (await isLogin()) ? '#/home' : '#/login';
};

export default app;
