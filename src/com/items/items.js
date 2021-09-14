import { dateFormat } from '../../lib.js';
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
    this.#$orderby = this.$('.orderby');

    this.#$toolbar.addEventListener('exit', () => {
      this.#resetSelectorState();
    });

    this.#$toolbar.addEventListener('move', () => {
      this.insertAdjacentHTML('beforeend', `<folder-list-dialog data-folderid="${this.#curFolder}"></folder-list-dialog>`);
      const dialog = this.$('folder-list-dialog');
      dialog.addEventListener('select', async (e) => {
        // operate data
        const dstFolderId = e.detail.folderId;
        for(let i=0; i<this.#$itemSelectors.length; i++) {
          const item = this.#$itemSelectors[i],
                srcFolderId = item.parentNode.dataset.folderid,
                taskId = item.parentNode.dataset.id;

          if(item.checked && srcFolderId !== dstFolderId) {
            await data.changeTaskFolder(Number(taskId), Number(dstFolderId));
          }
        }

        this.#$toolbar.show(false);
        this.#resetSelectorState();
        this.reloadView();
      });
    });

    this.#$toolbar.addEventListener('delete', async () => {
      const delOrNot = confirm('确定要删除选中的待办事项吗？');
      if(delOrNot) {
        this.#$toolbar.show(false);

        for(const item of this.#$itemSelectors) {
          if(item.checked) {
            const taskId = item.parentNode.dataset.id;
            await data.deleteTask(Number(taskId));
          }
        }

        this.#resetSelectorState();
        this.reloadView();
        }
    });

    this.#$toolbar.addEventListener('recycle', async () => {
      this.#$toolbar.show(false);

      for(const item of this.#$itemSelectors) {
        if(item.checked) {
          const taskId = item.parentNode.dataset.id;
          await data.recycleTask(Number(taskId));
        }
      }

      this.#resetSelectorState();
      this.reloadView();
    });

    this.#$toolbar.addEventListener('del-permanent', async () => {
      const delOrNot = confirm('确定要删除选中的待办事项吗？');
      if(delOrNot) {
        this.#$toolbar.show(false);

        for(const item of this.#$itemSelectors) {
          if(item.checked) {
            const taskId = item.parentNode.dataset.id;
            await data.deleteTask(Number(taskId), true);
          }
        }

        this.#resetSelectorState();
        this.reloadView();
        }
    });

    this.#$selectAll.onclick = (e) => {
      e.stopPropagation();

      if(Number(this.#$count.innerHTML) === 0) {
        e.preventDefault();
        return;
      }

      this.#showAllSelectors();
      const type = Number(this.#curFolder.split(':')[0] === 'menu-trash');
      console.log(type);
      this.#$toolbar.show(this.#$selectAll.checked, this.#$count.innerHTML, type);
    }

    this.#$items.onclick = (e) => {
      const target = e.target;
      if(target.nodeName === 'INPUT') {
        this.#checkboxOnClick(target);
        return;
      }

      target.className = "active";
      this.#setItemActive(target);

      const evt = new CustomEvent('load', {
        detail:  { 'taskId': e.target.dataset.id },
        bubbles: true
      });

      this.dispatchEvent(evt);
    }

    this.#$orderby.onchange = () => {
      this.show(this.#tasks);
    }
  }

  show(tasks, curFolder) {
    tasks.sort((t1, t2) => {
      const v1 = (new Date(t1[this.#$orderby.value])).getTime(),
            v2 = (new Date(t2[this.#$orderby.value])).getTime();

      return v2-v1;
    });

    this.#tasks = tasks;
    this.#$count.innerHTML = tasks.length;
    this.#$items.innerHTML = '';
    this.#$itemSelectors = [];
    this.#curFolder = curFolder;

    if(!this.#$toolbar.isHide) {
      this.#$toolbar.show(false);
      this.#resetSelectorState();
    }

    for(let i=0; i<tasks.length; i++) {
      this.#$items.insertAdjacentHTML('beforeend', this.#genItemDom(tasks[i]));
    }

    const $items = this.#$items.querySelectorAll('li');
    if($items.length !== 0) {
      $items[0].click();
      this.#setItemActive($items[0]);
      this.#$itemSelectors = this.querySelectorAll('.select-item');
    } else {
      const evt = new CustomEvent('load', {
        detail:  { 'taskId': 0 },
        bubbles: true
      });

      this.dispatchEvent(evt);
    }
  }

  reloadView() {
    const msg  = this.#curFolder.split(':'),
          menu = msg[0],
          id   = msg[1];
    let tasks = data.getTasksByMenu(menu, id);
    const currentItemId = this.#$currentItem.dataset.id;
    this.show(tasks, `${menu}:${id}`);
    this.#setItemActive(this.#$items.querySelector(`li[data-id="${currentItemId}"]`));
  }

  test() {
    const $items = this.#$items.querySelectorAll('li');
    console.log($items);
  }

  #curFolder = '';
  #tasks = null;
  #$count = null;
  #$items = null;
  #$currentItem = null;
  #$itemSelectors = [];
  #$selectAll = null;
  #$toolbar = null;
  #$orderby = null;

  #genItemDom(task) {
    const lines = task.content.split('\n');

    return ''
      + `<li data-id="${task.id}" data-folderid="${task.folder_id}">`
        + '<input type="checkbox" class="select-item hide">'
        + `<p class="preview1">${lines[0]}</p>`
        + `<p class="preview2">${typeof lines[1] === 'undefined' ? ' ' : lines[i]}</p>`
        + `<p class="date-time">${dateFormat(task[this.#$orderby.value])}</p>`
      + '</li>';
  }

  #checkboxOnClick(target) {
    target.className = target.checked ? 'select-item' : 'select-item hide';
    const num = this.#getCheckedNum();
    const type = Number(this.#curFolder.split(':')[0] === 'menu-trash');
    if(num > 0) {
      if(this.#$toolbar.isHide) {
        this.#$toolbar.show(true, num, type);
      } else {
        this.#$toolbar.setCount(num);
      }

      if(num === this.#$itemSelectors.length) {
        this.#$selectAll.checked = true;
        this.#$selectAll.className = 'select-all';
      } else {
        this.#$selectAll.checked = false;
        this.#$selectAll.className = 'select-all hide';
      }
    } else { // num === 0
      this.#$toolbar.show(false);
      this.#$selectAll.checked = false;
      this.#$selectAll.className = 'select-all hide';
    }
  }

  #getCheckedNum() {
    let num = 0;
    for(const selector of this.#$itemSelectors) {
      if(selector.checked) num++;
    }
    return num;
  }

  #resetSelectorState() {
    if(this.#$selectAll.checked) {
      this.#$selectAll.click();
    } else {
      for(const selector of this.#$itemSelectors) {
        if(selector.checked) selector.click();
      }
    }
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
        + '<option value="updatedTime" selected>按编辑时间</option>'
        + '<option value="createdTime">按创建时间</option>'
      + '</select></label>'
    + '</div>'
    + '<ul class="items">'
    + '</ul>'
    + '<tool-bar class="hide"></tool-bar>';
}

export default Items;
