import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentNode } from 'graphql';
import { Apollo } from 'apollo-angular';


import {
    TeamTodosQuery
} from '../../../graphql/schema';

const TeamTodosQueryNode: DocumentNode = require('graphql-tag/loader!../../../graphql/TeamTodos.graphql');
const TeamTodoAdded: DocumentNode = require('graphql-tag/loader!../../../graphql/TeamTodoAdded.graphql');


@Component({
    selector: 'app-todo-team',
    templateUrl: 'todo-team.component.html',
    styleUrls: ['todo-team.component.css']
})
export class TodoTeamComponent implements OnInit, OnDestroy {
    inited: boolean;
    teamTodosQuerySub;
    teamTodosSubscriptionSub;
    teamName: string;
    todoItems = [];
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private apollo: Apollo,
        private ref: ChangeDetectorRef
    ) {
    }

    ngOnInit() {
        this.teamName = this.route.snapshot.params.teamName.toLowerCase();
        const todosQueryVariables = {
            teamName: this.teamName
        };
        this.teamTodosQuerySub = this.apollo.watchQuery<TeamTodosQuery>({
            query: TeamTodosQueryNode,
            variables: todosQueryVariables
        })
            .subscribe(res => {
                this.todoItems = res.data.teamTodos;
                this.ref.detectChanges();
                this.inited = true;
            });
        this.initTodoAddedSubscription();
    }

    goBack() {
        this.router.navigate(['']);
    }

    initTodoAddedSubscription() {
        const self = this;
        // subscribeToMore helper in apollo-angular has an open issue hence using apollo client for subscribe method
        this.teamTodosSubscriptionSub = this.apollo.getClient().subscribe({
            query: TeamTodoAdded,
            variables: {
                teamName: this.teamName
            }
        }).subscribe({
            next(data) {
                let currentTeamTodos: any;
                try {
                    currentTeamTodos = self.apollo.getClient().readQuery({
                        query: TeamTodosQueryNode,
                        variables: {
                            teamName: self.teamName,
                        }
                    });
                } catch (e) {
                    currentTeamTodos = {
                        teamTodos: []
                    };
                }
                const newTodo = data.teamTodoAdded;
                const teamTodoExists = currentTeamTodos.teamTodos.find(obj => obj.id === newTodo.id);
                if (!teamTodoExists) {
                    const updatedTodos = {
                        teamTodos: [...currentTeamTodos.teamTodos, newTodo]
                    };
                    self.apollo.getClient().writeQuery({
                        query: TeamTodosQueryNode,
                        variables: {
                            teamName: self.teamName,
                        },
                        data: updatedTodos
                    });
                }
            }
        });
    }

    ngOnDestroy() {
        if (this.teamTodosQuerySub) {
            this.teamTodosQuerySub.unsubscribe();
        }
        if (this.teamTodosSubscriptionSub) {
            console.log('unsubscribing from subscription')
            this.teamTodosSubscriptionSub.unsubscribe();
        }
    }
}
