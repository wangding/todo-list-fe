class Toolbar extends HTMLElement {
  constructor() {
    super();

    this.$ = this.querySelector;
    this.innerHTML = '<div class="box"></div>';
    this.body = this.$('div.box');
  }

  show(yesOrno, num, type=0) {
    if(type === 0) { // type = NORMAL
      this.body.innerHTML = this.#html + this.#htmlNormal;

      this.$('img.move').onclick = () => {
        const evt = new CustomEvent('move', { bubbles: true });
        this.dispatchEvent(evt);
      };

      this.$('img.delete').onclick = () => {
        const evt = new CustomEvent('delete', { bubbles: true });
        this.dispatchEvent(evt);
      };
    }

    if(type === 1) { // type = TRASH
      this.body.innerHTML = this.#html + this.#htmlTrash;

      this.$('img.recycle').onclick = () => {
        const evt = new CustomEvent('recycle', { bubbles: true });
        this.dispatchEvent(evt);
      };

      this.$('img.del-permanent').onclick = () => {
        const evt = new CustomEvent('del-permanent', { bubbles: true });
        this.dispatchEvent(evt);
      };
    }

    this.className = (yesOrno) ? '' : 'hide';
    this.setCount(num);

    this.$('img.exit').onclick = () => {
      this.className = 'hide';
      const evt = new CustomEvent('exit', { bubbles: true });
      this.dispatchEvent(evt);
    };
  }

  setCount(num) {
    this.$('span.count').innerHTML = num;
  }

  get isHide() {
    return this.className === 'hide';
  }

  static NORMAL = 0;
  static TRASH = 1;

  #html = ''
    + '<img class="exit icon" src="./src/com/toolbar/exit.svg">'
    + '<span>已选 <span class="count">n</span> 条待办事项</span>'
    + '<span class="tooltip exit hide">退出多选模式</span>';

  #htmlNormal = ''
    + '<img class="move icon" src="./src/com/toolbar/move.svg">'
    + '<img class="delete icon" src="./src/com/toolbar/delete.svg">'
    + '<span class="tooltip move hide">移动到文件夹</span>'
    + '<span class="tooltip delete hide">删除所选待办事项</span>';

  #htmlTrash = ''
    + '<img class="recycle icon" src="./src/com/toolbar/return.svg">'
    + '<img class="del-permanent icon" src="./src/com/toolbar/delete.svg">'
    + '<span class="tooltip recycle hide">移出回收站</span>'
    + '<span class="tooltip del-permanent hide">永久删除</span>';
}

export default Toolbar;
