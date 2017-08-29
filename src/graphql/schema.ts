/* tslint:disable */
//  This file was automatically generated and should not be edited.

export type CreateTodoInput = {
  timestamp: string,
  name: string,
  content: string,
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

export type TodosQueryVariables = {
  firstTodos?: number | null,
};

export type TodosQuery = {
  // List of todos for user
  todos:  Array< {
    // Db uuid
    id: string,
    // Unique friendly name for todo item
    name: string,
    // content of todo item
    content: string,
    // iso date string
    timestamp: string,
  } | null > | null,
};
/* tslint:enable */
