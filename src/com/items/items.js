import data from '../../data.js';
import Toolbar from '../toolbar/toolbar.js';
import FolderListDialog from '../folder-list-dlg/folder-list-dlg.js';

class Items extends HTMLElement {
  constructor() {
    super();

    try {
      customElements.define('tool-bar', Toolbar);
      customElements.define('folder-list-dialog', FolderListDialog);
    } catch (e) {
      // 可能会出现重复注册 web component 的错误
      // 直接忽略，确保程序不抛出异常，而停止执行
    }
    this.$ = this.querySelector;
    this.innerHTML = this.#html;

    this.#$count = this.$('span.count');
    this.#$items = this.$('ul.items');
    this.#$selectAll = this.$('.select-all');
    this.#$toolbar = this.$('tool-bar');

    this.#$toolbar.addEventListener('exit', () => {
      this.#$selectAll.click();
    });

    this.#$toolbar.addEventListener('move', () => {
      this.insertAdjacentHTML('beforeend', `<folder-list-dialog data-folderid="${this.#curFolder}"></folder-list-dialog>`);
      const dialog = this.querySelector('folder-list-dialog');
      dialog.addEventListener('select', async (e) => {
        const dstFolderId = e.detail.folderId;

        for(let i=0; i<this.#$itemSelectors.length; i++) {
          const item = this.#$itemSelectors[i],
                srcFolderId = item.parentNode.dataset.folderid,
                taskId = item.parentNode.dataset.id;

          if(item.checked && srcFolderId !== dstFolderId) {
            await data.changeFolder(Number(taskId), Number(dstFolderId));
          }
        }
        //this.show(tasks, this.#curFolder);
        this.#$toolbar.show(false);
      });
    });

    this.#$toolbar.addEventListener('delete', () => {
      const deleteOrNot = confirm('确定要删除选中的待办事项吗？');
      if(delOrNot) {
        this.#$toolbar.show(false);

        for(let i=0; i<this.#$itemSelectors.length; i++) {
          const item = this.#$itemSelectors[i],
                taskId = item.parentNode.dataset.id;

          //await data.deleteTask(Number(taskId));
          // items list also reflect
          }
        }
    });

    this.#$selectAll.onclick = (e) => {
      e.stopPropagation();

      if(Number(this.#$count.innerHTML) === 0) {
        e.preventDefault();
        return;
      }

      this.#showAllSelectors();
      this.#$toolbar.show(this.#$selectAll.checked, this.#$count.innerHTML);
    }

    this.#$itemSelectors.forEach( $item => {
      $item.onclick = (e) => {
        e.stopPropagation();
        console.log($item.checked);
      }
    });

    this.#$items.onclick = (e) => {
      const target = e.target;
      target.className = "active";
      this.#setItemActive(target);

      const evt = new CustomEvent('load', {
        detail:  { 'taskId': e.target.dataset.id },
        bubbles: true
      });

      this.dispatchEvent(evt);
    }
  }

  show(tasks, curFolder) {
    this.#tasks = tasks;
    this.#$count.innerHTML = tasks.length;
    this.#$items.innerHTML = '';
    this.#$itemSelectors = [];
    this.#curFolder = curFolder;

    for(let i=0; i<tasks.length; i++) {
      this.#$items.insertAdjacentHTML('beforeend', this.#genItemDom(tasks[i]));
    }

    const $items = this.#$items.querySelectorAll('li');
    if($items.length !== 0) {
      this.#setItemActive($items[0]);
      this.#$itemSelectors = this.querySelectorAll('.select-item');
    }
  }

  #curFolder = '';
  #tasks = null;
  #$count = null;
  #$items = null;
  #$currentItem = null;
  #$itemSelectors = [];
  #$selectAll = null;
  #$toolbar = null;

  #genItemDom(task) {
    const lines = task.content.split('\n');

    return ''
      + `<li data-id="${task.id}" data-folderid="${task.folder_id}">`
        + '<input type="checkbox" class="select-item hide">'
        + `<p class="preview1">${lines[0]}</p>`
        + `<p class="preview2">${typeof lines[1] === 'undefined' ? ' ' : lines[i]}</p>`
        + '<p class="update-time">8月4日 14:20</p>'
      + '</li>';
  }

  #showAllSelectors() {
    const checked = this.#$selectAll.checked;

    this.#$selectAll.className = 'select-all' + (checked ? '' : ' hide');
    this.#$itemSelectors.forEach(selector => {
      selector.className = 'select-item' + (checked ? '' : ' hide');
      selector.checked = checked;
    });
  }

  #setItemActive(item) {
    if(this.#$currentItem !== null) {
      this.#$currentItem.className = '';
    }

    item.className = 'active';

    this.#$currentItem = item;
  }

  #html = ''
    + '<div class="header">'
      + '<span>共 <span class="count">n</span> 条</span>'
      + '<input type="checkbox" class="select-all hide">'
      + '<label>排序：'
      + '<select class="orderby">'
        + '<option value="按编辑时间" selected>按编辑时间</option>'
        + '<option value="按创建时间">按创建时间</option>'
      + '</select></label>'
    + '</div>'
    + '<ul class="items">'
    + '</ul>'
    + '<tool-bar class="hide"></tool-bar>';
}

export default Items;
