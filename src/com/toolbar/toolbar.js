class Toolbar extends HTMLElement {
  constructor() {
    super();

    this.$ = this.querySelector;
    this.innerHTML = this.#html;
    this.#$count = this.$('span.count');

    this.$('img.exit').onclick = () => {
      this.show(false);
      const evt = new CustomEvent('exit', { bubbles: true });
      this.dispatchEvent(evt);
    };

    this.$('img.move').onclick = () => {
      const evt = new CustomEvent('move', { bubbles: true });
      this.dispatchEvent(evt);
    };

    this.$('img.delete').onclick = () => {
      const evt = new CustomEvent('delete', { bubbles: true });
      this.dispatchEvent(evt);
    };
  }

  show(yesOrno, num) {
    this.className = (yesOrno) ? '' : 'hide';
    this.setCount(num);
  }

  setCount(num) {
    this.#$count.innerHTML = num;
  }

  get isHide() {
    return this.className === 'hide';
  }

  #$count = null;

  #html = ''
    + '<div class="box">'
      + '<img class="exit icon" src="./src/com/toolbar/exit.svg">'
      + '<span>已选 <span class="count">n</span> 条待办事项</span>'
      + '<img class="move icon" src="./src/com/toolbar/move.svg">'
      + '<img class="delete icon" src="./src/com/toolbar/delete.svg">'
      + '<span class="tooltip exit hide">退出多选模式</span>'
      + '<span class="tooltip move hide">移动到文件夹</span>'
      + '<span class="tooltip delete hide">删除所选待办事项</span>'
    + '</div>';
}

export default Toolbar;
