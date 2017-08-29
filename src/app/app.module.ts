import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { TodoCreateComponent } from './todos/todo-create.component';
import { TodoListItemComponent } from './todos/todos-list-item.component';
import { TodoListComponent } from './todos/todos-list.component';

import { AppApolloModule } from './apollo/app-apollo.module';


@NgModule({
  declarations: [
    AppComponent,
    TodoCreateComponent,
    TodoListComponent,
    TodoListItemComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppApolloModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
