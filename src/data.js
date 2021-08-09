class Data {
  constructor() {}

  init(sid, email) {
    localStorage.setItem('sid', sid);
    localStorage.setItem('email', email);

    // call api get tasks data and folders data
  }

  get sid() {
    return localStorage.getItem('sid');
  }

  get email() {
    return localStorage.getItem('email');
  }

  get allTasks() {
    return ['111', '222'];
  }

  get noClassTasks() {
    return ['111', '222'];
  }

  get removedTasks() {
    return ['333', '444'];
  }

  get searchedTasks() {
    return ['555', '666'];
  }

  removeSid() {
    localStorage.removeItem('sid');
    localStorage.removeItem('email');
  }
}

export default new Data();
