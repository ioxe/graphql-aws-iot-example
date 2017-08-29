import { Component, OnInit } from '@angular/core';
import { DocumentNode } from 'graphql';
import { Apollo } from 'apollo-angular';

import {
  TodosQuery,
  TodosQueryVariables
} from '../graphql/schema';

const TodosQueryNode: DocumentNode = require('graphql-tag/loader!../graphql/Todos.graphql');


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  todosSub;
  todoItems = [];
  constructor(private apollo: Apollo) {}

  ngOnInit() {
    const todosQueryVariables: TodosQueryVariables = {
      firstTodos: 16
    };
    this.apollo.query<TodosQuery>({
      query: TodosQueryNode,
      variables: todosQueryVariables
    })
    .subscribe(res => {
      console.log(res);
      this.todoItems = res.data.todos;
      console.log(this.todoItems);
    });
  }
}
