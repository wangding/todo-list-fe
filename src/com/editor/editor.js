import data from '../../data.js';

class Editor extends HTMLElement {
  constructor() {
    super();

    this.$ = this.querySelector;
    this.innerHTML = this.#html;
  }

  async show(taskId) {
    if(this.#isModified) this.#content = this.$('textarea').value;
    this.#showUI(taskId !== 0);
    if(taskId === 0 || taskId === this.#curTaskId) return;
    if(this.#isModified) {
      await data.changeTaskContent(this.#curTaskId, this.#content);
      const evt = new CustomEvent('modify', { bubbles: true });
      this.dispatchEvent(evt);
      this.#isModified = false;
    }
    this.#curTaskId = taskId;

    const content = data.getTaskById(Number(taskId)).content;
    this.$('textarea').value = content;
    this.$('textarea').onkeydown = () => {
      if(this.$('textarea').value !== content) {
        this.#isModified = true;
      }
    };
  }

  #showUI(yesOrNo) {
    this.innerHTML = yesOrNo ? this.#html : '';
    if(yesOrNo) this.$('textarea').value = this.#content;
  }

  #isModified = false;
  #content = '';
  #curTaskId = 0;
  #html = ''
    + '<div class="toolbar">'
      + '<img class="delete icon" src="./src/com/folder/trash.svg">'
      + '<span class="tooltip delete">删除待办事项<span>'
    + '</div>'
    + '<textarea class="editor">'
    + '</textarea>';
}

export default Editor;
