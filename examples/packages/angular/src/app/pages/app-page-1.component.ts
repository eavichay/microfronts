import { Component, OnDestroy, OnInit, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { IAppContext } from '../../../../../../dist/interfaces';
import { select, dispatch, NgRedux } from '@angular-redux/store';
import { Observable, Subscription } from 'rxjs';

const store = window.AppContext.get('applicationState');

@Component({
  selector: 'app-page-1-component',
  template: /*html*/`
<div>
  <div>
      <div>
        {{total}} Items, {{resolved}} completed
      </div>
      <div>
        <button (click)="deleteLastItem()">DELETE LAST ITEM</button>
      </div>
    </div>
</div>
  `
})
export class AppPage1Component implements OnDestroy, OnInit {

  @select((state) => state.todos) todos$: Observable<any>;
  todosSub: Subscription;

  todos = [];
  total = 0;
  resolved = 0;

  constructor(private ngRedux: NgRedux<any>, private zone: NgZone) {
  }

  deleteLastItem() {
    const lastTodo = this.todos.slice(-1)[0];
    if (lastTodo) {
      this.ngRedux.dispatch({
        type: 'todos.remove',
        id: lastTodo.id
      });
    }
  }

  ngOnInit() {
    this.todosSub = this.todos$.subscribe((data: any) => {
      this.zone.run(() => {
        this.todos = data.todos;
        this.total = data.total;
        this.resolved = data.todos.filter(todoItem => todoItem.done).length
      });
    });
  }

  ngOnDestroy() {
    this.todosSub.unsubscribe();
  }
}
