import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TodoHomeComponent } from '../todos/todo-home/todo-home.component';
import { TodoTeamComponent } from '../todos/todo-team/todo-team.component';

const appRoutes: Routes = [
    {
      path: '',
      component: TodoHomeComponent
    },
    { path: 'team',   redirectTo: '', pathMatch: 'full' },
    {
      path: 'team/:teamName',
      component: TodoTeamComponent
    }
  ];

  @NgModule({
    imports: [
      RouterModule.forRoot(
        appRoutes
      )
    ],
    exports: [
      RouterModule
    ]
  })
  export class AppRoutingModule {}
