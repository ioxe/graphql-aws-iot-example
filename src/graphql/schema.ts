/* tslint:disable */
//  This file was automatically generated and should not be edited.

export type CreateTodoInput = {
  timestamp: string,
  name: string,
  content: string,
  teamName: string,
  author: string,
};

export type CreateTodoMutationVariables = {
  input: CreateTodoInput,
};

export type CreateTodoMutation = {
  // Create a new todo item
  createTodo:  {
    // Db uuid
    id: string,
  } | null,
};

export type TeamTodoAddedSubscriptionVariables = {
  teamName: string,
};

export type TeamTodoAddedSubscription = {
  // New todo added
  teamTodoAdded:  {
    // Db uuid
    id: string,
    // Unique friendly name for todo item
    name: string,
    // Content of todo item
    content: string,
    // ISO date string
    timestamp: string,
  } | null,
};

export type TeamTodosQueryVariables = {
  teamName: string,
};

export type TeamTodosQuery = {
  // List of todos for user
  teamTodos:  Array< {
    // Db uuid
    id: string,
    // Unique friendly name for todo item
    name: string,
    // Content of todo item
    content: string,
    // ISO date string
    timestamp: string,
  } | null > | null,
};
/* tslint:enable */
