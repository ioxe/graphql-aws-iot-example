import { Component } from '@angular/core';

import { Apollo } from 'apollo-angular';
import { DocumentNode } from 'graphql';
import 'rxjs/add/operator/toPromise';

const CreateTodoMutationNode: DocumentNode = require('graphql-tag/loader!../../graphql/CreateTodo.graphql');

import {
    CreateTodoMutationVariables
  } from '../../graphql/schema';

@Component({
    selector: 'app-todo-create',
    template: `
    <div>
        <input [(ngModel)]="todo.name" placeholder="name" style="width:15em">
    </div>
    <div>
        <textarea [(ngModel)]="todo.content" style="width:15em; margin-top: 1em"></textarea>
    </div>
    <button (click)="onClickAdd(todo)" style="margin-top:1em">Add Todo</button>
    `
})
export class TodoCreateComponent {
    todo: any = {};
    constructor(private apollo: Apollo) {}

    onClickAdd(todo) {
        const variables = {
            input: {
                name: todo.name,
                content: todo.content,
                timestamp: new Date().toISOString()
            }
        };
        this.apollo.mutate({
            mutation: CreateTodoMutationNode,
            variables
        })
        .subscribe(
            res => {
            console.log(res);
            this.todo = {};
            },
            err => {
                console.log('error');
                console.log(err);
            });
    }
}
