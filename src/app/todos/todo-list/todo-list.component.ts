import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-todo-list',
    templateUrl: 'todo-list.component.html'
})
export class TodoListComponent {
    _todoItems;
    @Input()
    set todoItems(value: Array<any>) {
        let items = [...value];
         this._todoItems = items.sort(function (a, b) {
            a = new Date(a.timestamp);
            b = new Date(b.timestamp);
            return a > b ? -1 : a < b ? 1 : 0;
        });
    }
}
