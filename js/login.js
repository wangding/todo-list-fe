class LoginBox extends HTMLElement {
  constructor() {
    super();

    this.innerHTML = ''
      + '<div class="app-login">'
        + '<h1>登录</h1>'
        + '<form>'
          + '<label>邮箱：</label>'
          + '<input name="userName" type="email" autofocus required><br>'
          + '<label>密码：</label>'
          + '<input name="password" type="password" required><br>'
          + '<input type="submit" value="登 录"> <a href="#/signup">注册新用户</a>'
        + '</form>'
      + '</div>';

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
        localStorage.setItem('sid', rs.data);
        localStorage.setItem('email', email);

        $userName.value = '';
        $password.value = '';

        location.hash = '#/home';
      }
    };
  }
}

export default LoginBox;
