import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-todo-list-item',
    templateUrl: 'todo-list-item.component.html'
})
export class TodoListItemComponent {
    @Input() item;
}
