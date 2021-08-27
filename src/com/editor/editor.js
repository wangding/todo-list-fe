import data from '../../data.js';

class Editor extends HTMLElement {
  constructor() {
    super();

    this.$ = this.querySelector;
    this.innerHTML = this.#html;
    this.#$toolbar = this.$('.toolbar');
    this.#$editor = this.$('textarea.editor');
  }

  show(taskId) {
    this.#showUI(taskId !== 0);
    if(taskId === 0) return;

    /*
    if(this.#curTaskId === 0) { // 第一次载入内容
      this.#$editor.value = data.getTaskById(Number(taskId));
    } else {
      if(this.#curTaskId !== taskId) { // 第二次载入内容了，而且和之前载入的内容不同
        if(this.#$editor.value !== data.getTaskById(this.#curTaskId)) {
          // 之前的内容确实有了变更才需要保存
          data.changeTaskContent(this.#curTaskId, this.#$editor.value);
        }
        // load new content
        this.#$editor.value = data.getTaskById(taskId);
      }
    }
    */
    this.#$editor.value = data.getTaskById(Number(taskId)).content;
    this.#curTaskId = taskId;
  }

  #showUI(yesOrNo) {
    this.#$toolbar.className = yesOrNo ? 'toolbar' : 'toolbar hide';
    this.#$editor.className = yesOrNo ? 'editor' : 'editor hide';
  }

  #$editor = null;
  #curTaskId = 0;
  #$toolbar = null;
  #html = ''
    + '<div class="toolbar">'
      + '<img class="delete icon" src="./src/com/folder/trash.svg">'
      + '<span class="tooltip delete">删除待办事项<span>'
    + '</div>'
    + '<textarea class="editor">'
    + '</textarea>';
}

export default Editor;
