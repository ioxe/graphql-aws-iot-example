import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  MdButtonModule,
  MdCheckboxModule,
  MdInputModule,
  MdCardModule,
  MdProgressSpinnerModule,
  MdChipsModule
} from '@angular/material';

import { AppApolloModule } from './apollo/app-apollo.module';

import { AppRoutingModule } from './app-routing/app.routing.module';
import { AppComponent } from './app.component';
import { TodoCreateComponent } from './todos/todo-create/todo-create.component';
import { TodoHomeComponent } from './todos/todo-home/todo-home.component';
import { TodoTeamComponent } from './todos/todo-team/todo-team.component';
import { TodoListItemComponent } from './todos/todo-list-item/todo-list-item.component';
import { TodoListComponent } from './todos/todo-list/todo-list.component';


@NgModule({
  declarations: [
    AppComponent,
    TodoCreateComponent,
    TodoHomeComponent,
    TodoListComponent,
    TodoListItemComponent,
    TodoTeamComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MdButtonModule,
    MdInputModule,
    MdCardModule,
    MdProgressSpinnerModule,
    MdChipsModule,
    AppApolloModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
