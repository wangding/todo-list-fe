import data from '../../data.js';

class FolderListDialog extends HTMLElement {
  constructor() {
    super();

    console.log('--------------', this.dataset.folderid);
    this.$ = this.querySelector;
    this.innerHTML = this.#html;
    this.#$folderList = this.$('.dialog-box .folder-list');
    this.#fill();

    this.$('img.exit').onclick = () => {
      this.remove();
    };

    this.#$folderList.onclick = (e) => {
      this.remove();

      const evt = new CustomEvent('select', {
        detail:  { 'folderId': e.target.dataset.id },
        bubbles: true
      });

      this.dispatchEvent(evt);
    }
  }

  #$folderList = null;

  #fill() {
    const folders = data.folders;
    for(let i=0; i<folders.length; i++) {
      let dom = this.#genListNode(folders[i]);
      this.#$folderList.insertAdjacentHTML('beforeend', dom);
    }
  }

  #genListNode(folder) {
    return ''
      + `<li data-id="${folder.id}">`
        + '<img class="icon" src="./src/com/folder/folder.svg">'
        + `<span title="${folder.name}">${folder.name}</span>`
      + '</li>';
  }

  #html = ''
    + '<div class="dialog-box">'
      + '<div class="title">'
        + '<span>移动到文件夹</span>'
        + '<img class="exit icon" src="./src/com/folder-list-dlg/exit.svg">'
      + '</div>'
      + '<ul class="folder-list"></ul>'
    + '</div>';
}

export default FolderListDialog;
