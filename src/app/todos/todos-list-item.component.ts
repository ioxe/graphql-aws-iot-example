import { Component, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'app-todo-list-item',
    template: `
    <div>
        <span>
            {{item.id}}
        </span>
        <span>
            {{item.name}}
        </span>
        <span>
            {{item.content}}
        </span>
    </div>
    `
})
export class TodoListItemComponent implements OnChanges {
    @Input() item;

    ngOnChanges() {
        console.log('item');
        console.log(this.item);
    }
}
