class LoginBox extends HTMLElement {
  constructor() {
    super();

    this.innerHTML = ''
      + '<h1 class="login-title">登录</h1>'
      + '<form class="login-form">'
        + '<label class="login-label">邮箱：</label>'
        + '<input class="login-input" name="userName" type="email" autofocus required><br>'
        + '<label class="login-label">密码：</label>'
        + '<input class="login-input" name="password" type="password" required><br>'
        + '<input class="login-submit" type="submit" value="登 录"> <a href="#/signup">注册新用户</a>'
      + '</form>';

    this.$ = this.querySelector;

    const $form = this.$('form'),
          $userName = this.$('input[name="userName"]'),
          $password = this.$('input[name="password"]');

    $form.onsubmit = async function(e) {
      const email = $userName.value,
            password = $password.value;

      e.preventDefault();

      const apiURL = 'http://192.168.174.133:8080/api/users/login';
      let rs = await axios.post(apiURL, { email, password });
      rs = rs.data;

      if(rs.code !== 0) { // 登录失败
        alert(rs.msg);
      } else { // 登录成功
        $userName.value = '';
        $password.value = '';

        const evt = new CustomEvent('loginOK', { 'detail': {
          'sid': rs.data,
          'email': email
        }, bubbles: true });

        this.dispatchEvent(evt);
      }
    };
  }
}

export default LoginBox;
