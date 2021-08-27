import data from '../../data.js';

class FolderListDialog extends HTMLElement {
  constructor() {
    super();

    this.$ = this.querySelector;
    this.innerHTML = this.#html;
    this.#$folderList = this.$('.dialog-box .folder-list');
    this.#fill(this.dataset.folderid);

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

  #fill(folderid) {
    const folders = data.folders;
    const folder = folderid.split(':'),
          fClass = folder[0],
          folderId = Number(folder[1]);

    if(fClass === 'x-folder') {
      const dom = this.#genMoveOutNode();
      this.#$folderList.insertAdjacentHTML('beforeend', dom);

      for(let i=0; i<folders.length; i++) {
        if(folders[i].id === folderId) {
          folders.splice(i, 1);
          break;
        }
      }
    }

    for(const folder of folders) {
      const dom = this.#genFolderNode(folder);
      this.#$folderList.insertAdjacentHTML('beforeend', dom);
    }
  }

  #genMoveOutNode() {
    return ''
      + `<li data-id="0">`
        + '<img class="icon" src="./src/com/folder-list-dlg/return.svg">'
        + `<span>移出文件夹</span>`
      + '</li>';
  }

  #genFolderNode(folder) {
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
