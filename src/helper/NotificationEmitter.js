const events = require('events');

/** This class emits notification on mutliple events of todo lists */
class NotificationEmitter {
    constructor() {
        this.notifEmitter = new events.EventEmitter();
        this.emitAddTodo = this.emitAddTodo.bind(this);
        this.emitEditTodo = this.emitEditTodo.bind(this);
        this.emitDeleteTodo = this.emitDeleteTodo.bind(this);
    }

    emitAddTodo(data) {
        return this.notifEmitter.emit('addTodo', data);
    }

    emitEditTodo(data) {
        return this.notifEmitter.emit('editTodo', data);    
    }

    emitDeleteTodo(data) {
        return this.notifEmitter.emit('deleteTodo', data);    
    }
}


module.exports = new NotificationEmitter();