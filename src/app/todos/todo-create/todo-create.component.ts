import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Apollo } from 'apollo-angular';
import { DocumentNode } from 'graphql';
import 'rxjs/add/operator/toPromise';

const CreateTodoMutationNode: DocumentNode = require('graphql-tag/loader!../../../graphql/CreateTodo.graphql');

import {
    CreateTodoMutationVariables
} from '../../../graphql/schema';

@Component({
    selector: 'app-todo-create',
    templateUrl: 'todo-create.component.html',
    styleUrls: ['todo-create.component.css']
})
export class TodoCreateComponent {
    @Input() teamName: string;
    todoCreateForm: FormGroup;
    loading: boolean;
    constructor(
        private apollo: Apollo,
        private fb: FormBuilder
    ) {
        this.init();
    }

    init() {
        this.todoCreateForm = this.fb.group({
            name: ['', Validators.required],
            author: ['', Validators.required],
            content: ['', Validators.required]
        });
    }

    resetForm() {
        this.todoCreateForm.reset();
        Object.keys(this.todoCreateForm.controls).forEach(key => {
            this.todoCreateForm.controls[key].setErrors(null)
        });
    }

    onSubmit() {
        if (this.todoCreateForm.valid) {
            this.loading = true;
            const variables: CreateTodoMutationVariables = {
                input: {
                    name: this.todoCreateForm.value.name,
                    content: this.todoCreateForm.value.content,
                    author: this.todoCreateForm.value.author,
                    timestamp: new Date().toISOString(),
                    teamName: this.teamName
                }
            };
            this.apollo.mutate({
                mutation: CreateTodoMutationNode,
                variables,
                updateQueries: {
                    TeamTodos: (prev: any, { mutationResult }: any) => {
                        if (!mutationResult.data) {
                            return prev;
                        }
                        const newTodo = Object.assign({},
                            mutationResult.data.createTodo,
                            variables.input);
                        return {
                            teamTodos: [...prev.teamTodos, newTodo]
                        };
                    }
                }
            })
                .toPromise()
                .then(res => {
                    this.loading = false;
                    this.resetForm();
                })
                .catch(err => {
                    this.loading = false;
                    console.log('error');
                    window.alert(err);
                });
        }
    }
}
