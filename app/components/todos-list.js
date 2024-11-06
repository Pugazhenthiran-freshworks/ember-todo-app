import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class TodosListComponent extends Component {
  @service store;
  @tracked newTodoTitle = '';
  @tracked todos = [];

  constructor() {
    super(...arguments);
    this.setTodos();
  }

  @action
  async setTodos() {
    this.todos = await this.store.findAll('todo');
  }

  @action
  onChangeInput(e) {
    this.newTodoTitle = e.target.value;
  }

  @action
  onKeyPress(e) {
    if (e.key === 'Enter') {
      this.addTodo();
    }
  }

  @action
  async addTodo() {
    if (this.newTodoTitle.trim()) {
      let newTodo = this.store.createRecord('todo', {
        title: this.newTodoTitle,
        status: 'pending',
      });
      await newTodo.save();
      // this.todos = [
      //   ...this.todos,
      //   {
      //     id: Date.now().toString(),
      //     title: this.newTodoTitle,
      //     status: 'pending',
      //   },
      // ];
      this.newTodoTitle = '';
    }
  }

  @action
  async updateStatus(todoId, status) {
    let todo = this.store.peekRecord('todo', todoId);
    todo.status = status;
    await todo.save();
    // this.todos = this.todos.map((todo) => {
    //   return todo.id === todoId ? { ...todo, status } : todo;
    // });
  }

  @action
  async onEditTaskTitle(todoId, e) {
    let todo = this.store.peekRecord('todo', todoId);
    todo.title = e.target.value;
    await todo.save();
    // this.todos = this.todos.map((todo) => {
    //   return todo.id === todoId ? { ...todo, title: e.target.value } : todo;
    // });
  }

  @action
  async deleteTodo(deleteTodoId) {
    let todo = this.store.peekRecord('todo', deleteTodoId);
    await todo.destroyRecord();
    // this.todos = this.todos.filter(({ id }) => id !== deleteTodoId);
  }

  getTodos(filterStatus) {
    return this.todos.filter(({ status }) => status === filterStatus);
  }

  get pendingTodos() {
    return this.getTodos('pending');
  }
  get inProgressTodos() {
    return this.getTodos('inProgress');
  }
  get completedTodos() {
    return this.getTodos('completed');
  }
}
