import { baseUrl } from './config.js'

class Data {
  constructor() {}

  async init(jwt, email) {
    localStorage.setItem('jwt', jwt);
    localStorage.setItem('email', email);

    let res = await axios.get(baseUrl + '/tasks', {
      headers: { 'Authorization': 'Bearer '+ data.jwt }
    });

    res = res.data;
    localStorage.setItem('allTasks', JSON.stringify(res.data));

    res = await axios.get(baseUrl + '/tasks/noclass', {
      headers: { 'Authorization': 'Bearer '+ data.jwt }
    });

    res = res.data;
    localStorage.setItem('noClassTasks', JSON.stringify(res.data));

    res = await axios.get(baseUrl + '/folders', {
      headers: { 'Authorization': 'Bearer '+ data.jwt }
    });

    res = res.data;
    localStorage.setItem('folders', JSON.stringify(res.data));
  }

  get jwt() {
    return localStorage.getItem('jwt');
  }

  get email() {
    return localStorage.getItem('email');
  }

  get allTasks() {
    return JSON.parse(localStorage.getItem('allTasks'));
  }

  get noClassTasks() {
    return JSON.parse(localStorage.getItem('noClassTasks'));
  }

  get removedTasks() {
    return ['333', '444'];
  }

  get searchedTasks() {
    return ['555', '666'];
  }

  get folders() {
    return JSON.parse(localStorage.getItem('folders'));
  }

  getTasksByFolder(id) {
    const tasks = [];
    for(let i=0; i<this.allTasks.length; i++) {
      let item = this.allTasks[i];
      if(item.folder_id === Number(id)) tasks.push(item);
    }
    return tasks;
  }

  async addFolder(name) {
    let res = await axios.post(baseUrl + '/folders', { item: name }, {
      headers: { 'Authorization': 'Bearer '+ data.jwt }
    });

    let folders = this.folders;
    folders.unshift({
      id: res.data.data,
      name: name,
      user_id: folders[0].user_id
    });

    localStorage.setItem('folders', JSON.stringify(folders));

    return res.data.data;  // 插入 folder 记录的 Id
  }

  async renameFolder(id, name) {
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

    let folders = this.folders;
    for(let i=0; i<folders.length; i++) {
      if(folders[i].id === id) {
        folders.splice(i, 1);
        break;
      }
    }

    localStorage.setItem('folders', JSON.stringify(folders));
  }

  async changeFolder(taskId, folderId) {
    console.log(taskId);
    console.log(folderId);

    await axios.put(baseUrl + `/folders/${taskId}`, { folderId }, {
      headers: { 'Authorization': 'Bearer '+ data.jwt }
    });

    let tasks = this.allTasks;
    for(let i=0; i<tasks.length; i++) {
      if(tasks[i].id === taskId) {
        tasks[i].folder_id = folderId;
        break;
      }
    }

    localStorage.setItem('allTasks', JSON.stringify(tasks));
  }

  clear() {
    localStorage.clear();
  }
}

export default new Data();
