import { baseUrl } from './config.js'

class Data {
  constructor() {}

  async init(jwt, email) {
    localStorage.setItem('jwt', jwt);
    localStorage.setItem('email', email);

    let res = await axios.get(baseUrl + '/tasks', {
      headers: { 'Authorization': 'Bearer '+ data.jwt }
    });

    res = this.#arryToKeyValue(res.data.data);
    localStorage.setItem('tasks', JSON.stringify(res));

    res = await axios.get(baseUrl + '/folders', {
      headers: { 'Authorization': 'Bearer '+ data.jwt }
    });

    res = this.#arryToKeyValue(res.data.data);
    localStorage.setItem('folders', JSON.stringify(res));
  }

  get jwt() {
    return localStorage.getItem('jwt');
  }

  get email() {
    return localStorage.getItem('email');
  }

  get tasks() {
    const tasks = this.#rowTasks(),
          res   = [];
    for(const id in tasks) {
      if(tasks[id].deletedTime === null) res.push(tasks[id]);
    }
    return res;
  }

  get noClassTasks() {
    const tasks = this.tasks,
          noClassTasks = [];

    for(const task of tasks) {
      if(task.folder_id === null) noClassTasks.push(task);
    }
    return noClassTasks;
  }

  get removedTasks() {
    const tasks = this.#rowTasks(),
          res   = [];
    for(const id in tasks) {
      if(tasks[id].deletedTime !== null) res.push(tasks[id]);
    }
    return res;
  }

  searchTasks(content) {
    const tasks = this.tasks,
          res   = [];
    for(const task of tasks) {
      if(task.content.includes(content)) res.push(task);
    }
    localStorage.setItem('searched', JSON.stringify(res));
    return res;
  }

  get searchedTasks() {
    const res = JSON.parse(localStorage.getItem('searched'));
    return res;
  }

  get folders() {
    return this.#keyValueToArr(JSON.parse(localStorage.getItem('folders')));
  }

  getTasksByFolder(id) {
    const tasks = this.tasks,
          res = [];
    for(const task of tasks) {
      if(task.folder_id === Number(id)) res.push(task);
    }
    return res;
  }

  getTaskById(taskId) {
    return this.#rowTasks()[taskId];
  }

  async addFolder(name) {
    if(name === '' || typeof name === 'undefined') return;
    if(this.#folderExist(name)) return;

    let res = await axios.post(baseUrl + '/folders', { item: name }, {
      headers: { 'Authorization': 'Bearer '+ data.jwt }
    });

    let folders = this.folders;
    folders.unshift({
      id: res.data.data,
      name: name
    });

    localStorage.setItem('folders', JSON.stringify(folders));

    return res.data.data;  // 插入 folder 记录的 Id
  }

  async renameFolder(id, name) {
    if(name === '' || typeof name === 'undefined') return;
    if(this.#folderExist(name)) return;

    await axios.put(baseUrl + `/folders/${id}`, { item: name }, {
      headers: { 'Authorization': 'Bearer '+ data.jwt }
    });

    let folders = this.folders;
    for(let i=0; i<folders.length; i++) {
      if(folders[i].id === id) {
        folders[i].name = name;
        break;
      }
    }

    localStorage.setItem('folders', JSON.stringify(folders));
  }

  async deleteFolder(id) {
    await axios.delete(baseUrl + `/folders/${id}`, {
      headers: { 'Authorization': 'Bearer '+ data.jwt }
    });

    const folders = JSON.parse(localStorage.getItem('folders'));
    delete folders[id];
    localStorage.setItem('folders', JSON.stringify(folders));

    const tasks = this.#rowTasks();
    for(const id in tasks) {
      console.log(tasks[id]);
      if(tasks[id].folder_id === id) {
        await this.changeFolder(tasks[id].id, 0);
        await this.deleteTask(tasks[id].id);
      }
    }
  }

  async deleteTask(id) {
    await axios.delete(baseUrl + `/tasks/${id}`, {
      headers: { 'Authorization': 'Bearer '+ data.jwt }
    });

    let tasks = this.#rowTasks();
    tasks[id].deletedTime = (new Date()).toISOString();

    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  async addTask(content, folderId) {
    if(typeof folderId === 'undefined') folderId = null;

    const res = await axios.post(baseUrl + `/tasks/`, {
      content, folderId
    }, {
      headers: { 'Authorization': 'Bearer '+ data.jwt }
    });

    const id = res.data.data,
          tasks = this.#rowTasks();
    tasks[id] = {
      id: id,
      content: content,
      folder_id: (typeof folderId === 'undefined') ? null : folderId,
      createdTime: (new Date()).toISOString(),
      updatedTime: (new Date()).toISOString(),
      deletedTime: null
    };
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  async updateTaskById(taskId, content) {
    await axios.put(baseUrl + `/tasks/${taskId}`, { content }, {
      headers: { 'Authorization': 'Bearer '+ data.jwt }
    });

    let tasks = this.#rowTasks();
    tasks[taskId].content = content;
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  async changeFolder(taskId, folderId) {
    await axios.put(baseUrl + `/tasks/${taskId}`, { folderId }, {
      headers: { 'Authorization': 'Bearer '+ data.jwt }
    });

    let tasks = this.#rowTasks();
    tasks[taskId].folder_id = (folderId === 0) ? null : folderId;
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  clear() {
    localStorage.clear();
  }

  #arryToKeyValue(arr) {
    const res = {};
    for(let i=0; i<arr.length; i++) {
      res[arr[i].id] = arr[i];
    }
    return res;
  }

  #keyValueToArr(obj) {
    const arr = [];
    for(let id in obj) {
      arr.push(obj[id]);
    }
    return arr;
  }

  #rowTasks() {
    return JSON.parse(localStorage.getItem('tasks'));
  }

  #folderExist(name) {
    const folders = this.folders;
    for(const folder of folders) {
      if(folder.name === name) return true;
    }
    return false;
  }
}

export default new Data();
