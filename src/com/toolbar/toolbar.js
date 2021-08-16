class Toolbar extends HTMLElement {
  constructor() {
    super();

    this.$ = this.querySelector;
    this.innerHTML = this.#html;
    this.#$count = this.$('span.count');

    this.$('img.exit').onclick = () => {
      this.#eventHandles['onexit']();
    };

    this.$('img.move').onclick = () => {
      this.#eventHandles['onmove']();
    };

    this.$('img.delete').onclick = () => {
      this.#eventHandles['ondelete']();
    };
  }

  show(yesOrno) {
    // yesOrno: true  显示 toolbar
    //          false 隐藏 toolbar

    this.className = (yesOrno) ? '' : 'hide';
  }

  setCount(num) {
    this.#$count.innerHTML = num;
  }

  setEventHanle(handles) {
    this.#eventHandles = handles;
  }

  #$count = null
  #eventHandles = {
    onexit: null,
    onmove: null,
    ondelete: null
  }

  #html = ''
    + '<div class="box">'
      + '<img class="exit icon" src="./src/com/toolbar/exit.svg">'
      + '<span>已选 <span class="count">n</span> 条待办事项</span>'
      + '<img class="move icon" src="./src/com/toolbar/move.svg">'
      + '<img class="delete icon" src="./src/com/toolbar/delete.svg">'
      + '<span class="tooltip exit hide">退出多选模式</span>'
      + '<span class="tooltip move hide">移动到文件夹</span>'
      + '<span class="tooltip delete hide">删除所选待办事项</span>'
    + '</div>'
}

export default Toolbar;
