import app from './app.js';

if(app.isLogin()) {  // 已经登录
  app.showHome();
} else { // 没有登录
  app.showLogin();
}

