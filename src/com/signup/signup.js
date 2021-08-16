class SignupBox extends HTMLElement {
  constructor() {
    super();

    this.$ = this.querySelector;
    this.innerHTML = this.#html;

    const $form = this.$('form'),
          $userName = this.$('input[name="userName"]'),
          $password = this.$('input[name="password"]'),
          $pwdRepeat = this.$('input[name="pwd-repeat"]');

    $form.onsubmit = async (e) => {
      const email = $userName.value,
            password = $password.value,
            pwdRepeat = $pwdRepeat.value;

      e.preventDefault();

      if(password !== pwdRepeat) {
        alert('确认密码和密码不相同！');
        return;
      }

      $userName.value = '';
      $password.value = '';
      $pwdRepeat.value = '';

      const evt = new CustomEvent('signup', {
        detail: { email, password },
        bubbles: true
      });
      this.dispatchEvent(evt);
    };
  }

  #html = ''
    + '<h1 class="login-title">注册新用户</h1>'
    + '<form class="login-form">'
      + '<label class="login-label">邮箱：</label>'
      + '<input class="login-input" name="userName" type="email" autofocus required><br>'
      + '<label class="login-label">密码：</label>'
      + '<input class="login-input" name="password" type="password" required><br>'
      + '<label class="login-label">确认：</label>'
      + '<input class="login-input" name="pwd-repeat" type="password" required><br>'
      + '<input class="login-submit" type="submit" value="注 册">'
    + '</form>'
}

export default SignupBox;
