class Editor extends HTMLElement {
  constructor() {
    super();

    this.innerHTML = '<h2>编辑区域</h2>';
  }

  show(task) {
    console.log(`editor view show ${task}`);
  }
}

export default Editor;
