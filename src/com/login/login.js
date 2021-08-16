class LoginBox extends HTMLElement {
  constructor() {
    super();

    this.$ = this.querySelector;
    this.innerHTML = this.#html;

    const $loginForm = this.$('form'),
          $userName = this.$('input[name="userName"]'),
          $password = this.$('input[name="password"]');

    $loginForm.onsubmit = (e) => {
      const email = $userName.value,
            password = $password.value;

      $userName.value = '';
      $password.value = '';

      e.preventDefault();

      const evt = new CustomEvent('login', {
        detail: { email, password },
        bubbles: true
      });

      this.dispatchEvent(evt);
    };
  }

  #html = ''
    + '<h1 class="login-title">登录</h1>'
    + '<form class="login-form">'
      + '<label class="login-label">邮箱：</label>'
      + '<input class="login-input" name="userName" type="email" autofocus required><br>'
      + '<label class="login-label">密码：</label>'
      + '<input class="login-input" name="password" type="password" required><br>'
      + '<input class="login-submit" type="submit" value="登 录"> <a href="#/signup">注册新用户</a>'
    + '</form>'
}

export default LoginBox;
