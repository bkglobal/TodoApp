const { resolve, reject } = require("bluebird");
const { EventEmitter } = require("events");
const NotificationEmitter = require("../helper/NotificationEmitter");
const eventEmitter = new EventEmitter();

const TodoListType = require("../config/custom.config").TodoListTypes;

/** Using Local database as storage engine
 *  This will store and manipulate data on run time only..
 */
class Database {
  constructor() {
    this.userUniqueId = 0;
    this.todoUniqueId = 0;

    // Initialize by some test values for ease to access and testing...
    this.user = [
      {
        id: 0,
        username: "Muhammad Bilal",
        email: "khatribilal10@gmail.com",
        password: "Bilal123",
        device: "android",
        isActive: 1,
        isVerified: 0,
        verificationToken: "",
        authToken:
          "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MCwidXNlcm5hbWUiOiJNdWhhbW1hZCBCaWxhbCIsImVtYWlsIjoia2hhdHJpYmlsYWwxMEBnbWFpbC5jb20iLCJwYXNzd29yZCI6IkJpbGFsMTIzIiwiZGV2aWNlIjoiYW5kcm9pZCIsImlzQWN0aXZlIjoxLCJpc1ZlcmlmaWVkIjowLCJ2ZXJpZmljYXRpb25Ub2tlbiI6IiIsImF1dGhUb2tlbiI6IiIsImNyZWF0ZWRBdCI6IjIwMjAtMDctMjhUMTk6MTM6MTcuMzkxWiJ9.YvaUU9TyjSd9nItE2Fppr5zbqQn3BXcN8JBTg-E2KQg",
        createdAt: "2020-07-28T19:13:17.391Z",
      },
    ];
    this.todo = [
      {
        id: 0,
        title: "My First Todo Lists",
        description: "This is my first todo list",
        type: "personalList",
        deadline: "30-07-2020",
        users: 0,
        createdAt: "2020-07-28T19:15:41.474Z",
        isActive: 1,
      },
      {
        id: 1,
        title: "My Second Todo Lists",
        description: "This is my second todo list",
        type: "collaborativeList",
        deadline: "30-07-2020",
        users: [0, 10, 20],
        createdAt: "2020-07-28T19:15:41.474Z",
        isActive: 1,
      },
    ];

    this.addUser = this.addUser.bind(this);
    this.addList = this.addList.bind(this);
    this.updateList = this.updateList.bind(this);
    this.deleteList = this.deleteList.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.updateToken = this.updateToken.bind(this);
    this.findToken = this.findToken.bind(this);
    this.addColaboratorToList = this.addColaboratorToList.bind(this);
    this.isEmailAvailable = this.isEmailAvailable.bind(this);
    this.addTokenToUser = this.addTokenToUser.bind(this);
    this.isValidToken = this.isValidToken.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }

  async addUser(user) {
    return new Promise((resolve, reject) => {
      if (this.user.filter((e) => e.email === user.email)[0])
        return reject("Email already exists!");
      this.user.push({ ...{ id: this.userUniqueId++ }, ...user });
      resolve(true);
    });
  }

  async isEmailAvailable(email) {
    if (this.user.filter((e) => e.email === email)[0]) return true;
    return false;
  }

  async addTokenToUser(email, token) {
    return new Promise((resolve, reject) => {
      if (!this.isEmailAvailable(email))
        return reject("Email is not registered!");
      this.user = this.user.map((e) =>
        e.email === email ? { ...e, ...{ verificationToken: token } } : e
      );
      return resolve(true);
    });
  }

  async isValidToken(token) {
    if (!this.user.filter((e) => e.verificationToken === token)[0])
      return false;
    return true;
  }

  async changePassword(token, password) {
    return new Promise((resolve, reject) => {
      if (!this.isValidToken(token)) return reject("Invalid Token");
      this.user = this.user.map((e) =>
        e.verificationToken === token
          ? { ...e, ...{ password, verificationToken: "" } }
          : e
      );
      return resolve(true);
    });
  }

  async updateToken(user) {
    return new Promise((resolve, reject) => {
      this.user = this.user.map((e) => (e.id === user.id ? user : e));
      return resolve(true);
    });
  }

  async findToken(token) {
    return new Promise((resolve, reject) => {
      const user = this.user.filter((e) => e.authToken === token)[0];
      if (user) return resolve(user);
      return reject(false);
    });
  }

  async loginUser(user) {
    return new Promise((resolve, reject) => {
      let currUser = this.user.filter((e) => e.email === user.email)[0];
      if (currUser) {
        if (currUser.password === user.password) {
          resolve(currUser);
        } else {
          reject("Invalid Password");
        }
      } else {
        reject("Invalid Email");
      }
    });
  }

  async addList(todo, currentUser) {
    return new Promise((resolve, reject) => {
      if (this.todo.filter((e) => e.title === todo.title)[0])
        return reject("Todo already exists!");
      this.todo.push({ ...{ id: this.todoUniqueId++ }, ...todo });

      // This will send push notification to User if the list is collaborative
      if (todoForDelete.users && todoForDelete.users[0])
        NotificationEmitter.emitAddTodo({
          message: "New Todo list has been added",
          users: todo.users,
          currUser: currentUser.id,
        });
      resolve(true);
    });
  }

  async updateList(todo, currentUser) {
    return new Promise((resolve, reject) => {
      this.todo = this.todo.map((e) => (e.id === todo.id ? todo : e));
      
      // This will send push notification to User if the list is collaborative
      if (todo.users && todo.users[0])
        NotificationEmitter.emitEditTodo({
          message: "List has been updated",
          users: todo.users,
          currUser: currentUser.id,
        });
      return resolve(true);
    });
  }

  deleteList(id, currentUser) {
    const todoForDelete = this.todo.filter((e) => e.id == id);
    this.todo = this.todo.filter((e) => !(e.id == id));
    if (todoForDelete.users && todoForDelete.users[0])
      NotificationEmitter.emitDeleteTodo({
        message: "List has been removed",
        users: todoForDelete.users,
        currUser: currentUser.id,
      });
    return true;
  }

  async addColaboratorToList(id, users) {
    return new Promise((resolve, reject) => {
      let todo = this.todo.find((e) => e.id == id);
      if (todo.type === TodoListType.personalList)
        return reject("Sorry! The Todo List is Personal");
      todo.users = [...todo.users, ...users];
      this.todo = this.todo.map((e) => (e.id === id ? todo : e));
      return resolve(true);
    });
  }
}

module.exports = new Database();
