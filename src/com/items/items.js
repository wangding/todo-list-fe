class Items extends HTMLElement {
  constructor() {
    super();

    this.innerHTML = '<h2>列表区域</h2>';
  }

  show(tasks) {
    console.log(`$items listView show ${tasks}`);
  }
}

export default Items;
