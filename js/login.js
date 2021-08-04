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
      let userName = $userName.value,
          password = $password.value;

      if(userName === '' || password === '') return;

      console.log(userName, password);
      //let rs = await app.axios.post(apiURL, { userName, password });
      //rs = rs.data;

      if(rs.code !== 0) {
        alert(rs.msg);
        return;
      }

      sessionStorage.setItem('sid', rs.data);
      $userName.value = '';
      $password.value = '';
    };
  }
}

export default LoginBox;
