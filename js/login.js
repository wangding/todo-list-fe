class LoginBox extends HTMLElement {
  constructor() {
    super();

    this.innerHTML = ''
      + '<div class="app-login">'
        + '<h1>登录</h1>'
        + '<form>'
          + '<label>邮箱：</label>'
          + '<input name="userName" type="text" autofocus><br>'
          + '<label>密码：</label>'
          + '<input name="password" type="password"><br>'
          + '<input type="button" value="登 录">'
        + '</form>'
      + '</div>';

    this.$ = this.querySelector;

    const $btnLogin = this.$('input[type="button"]'),
          $userName = this.$('input[name="userName"]'),
          $password = this.$('input[name="password"]');

    $btnLogin.onclick = async function() {
      let email = $userName.value,
          password = $password.value;

      if(email === '' || password === '') return;

      const apiURL = 'http://192.168.174.133:8080/api/users/login';
      let rs = await axios.post(apiURL, { email, password });
      rs = rs.data;

      if(rs.code !== 0) { // 登录失败
        alert(rs.msg);
      } else { // 登录成功
        localStorage.setItem('sid', rs.data);
        $userName.value = '';
        $password.value = '';

        location.hash = '#/home';
      }
    };
  }
}

export default LoginBox;
