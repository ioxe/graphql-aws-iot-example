import { Component, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'app-todo-list',
    template: `
    <div *ngFor="let item of todoItems" style="margin-top:2em">
        <app-todo-list-item [item]="item"></app-todo-list-item>
    </div>
    `
})
export class TodoListComponent implements OnChanges {
    @Input() todoItems;

    ngOnChanges() {
        console.log(this.todoItems);
    }
}
