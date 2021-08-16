import Toolbar from '../toolbar/toolbar.js';

class Items extends HTMLElement {
  constructor() {
    super();

    customElements.define('tool-bar', Toolbar);
    this.$ = this.querySelector;
    this.innerHTML = this.#html;
    this.#$count = this.$('span.count');
    this.#$items = this.$('ul.items');
    this.#$allSelector = this.$('.select-all');
    this.#$toolbar = this.$('tool-bar');
    this.#$toolbar.setEventHanle(this.#toobarEventHanles);

    this.#$allSelector.onclick = (e) => {
      e.stopPropagation();

      if(Number(this.#$count.innerHTML) === 0) {
        e.preventDefault();
        return;
      }

      this.#showAllSelectors();
    }

    this.#$itemSelectors.forEach( $item => {
      $item.onclick = (e) => {
        e.stopPropagation();
        console.log($item.checked);
      }
    });

    this.#$items.onclick = (e) => {
      let target = null;
      if(e.target.nodeName === 'LI') {
        target = e.target;
      } else {
        target = e.target.parentNode;
      }

      target.className = "active";
      this.#setItemActive(target);

      // todo: call editor to load current task
    }
  }

  show(tasks) {
    this.#$count.innerHTML = tasks.length;
    this.#$items.innerHTML = '';
    this.#$itemSelectors = [];

    for(let i=0; i<tasks.length; i++) {
      this.#$items.insertAdjacentHTML('beforeend', this.#genItemDom(tasks[i]));
    }

    const $items = this.#$items.querySelectorAll('li');
    if($items.length !== 0) {
      this.#setItemActive($items[0]);
      this.#$itemSelectors = this.querySelectorAll('.select-item');
    }
  }

  #$count = null
  #$items = null
  #$currentItem = null
  #$itemSelectors = []
  #$allSelector = null
  #$toolbar = null
  #toobarEventHanles = {
    onexit: () => {
      this.#$allSelector.click();
    },

    onmove: () => {

    },

    ondelete: () => {

    }
  }

  #genItemDom(task) {
    const lines = task.content.split('\n');

    return ''
      + `<li data-id="${task.id}">`
        + '<input type="checkbox" class="select-item hide">'
        + `<p class="preview1">${lines[0]}</p>`
        + `<p class="preview2">${typeof lines[1] === 'undefined' ? ' ' : lines[i]}</p>`
        + '<p class="update-time">8月4日 14:20</p>'
      + '</li>';
  }

  #showAllSelectors() {
    const checked = this.#$allSelector.checked;

    this.#$allSelector.className = 'select-all' + (checked ? '' : ' hide');
    this.#$itemSelectors.forEach(selector => {
      selector.className = 'select-item' + (checked ? '' : ' hide');
      selector.checked = checked;
    });
    this.#$toolbar.setCount(this.#$count.innerHTML);
    this.#$toolbar.show(checked);
  }

  #setItemActive(item) {
    console.log(item);
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
    + '<tool-bar class="hide"></tool-bar>'
}

export default Items;
