import {
    GraphQLNonNull,
    GraphQLID
} from 'graphql';

import {
    CreateTodoInput,
    UpdateTodoInput,
    DeleteTodoInput,
    Todo
} from './todo.schema';



export default {
    createTodo: {
        type: Todo,
        description: 'Create a new todo item',
        args: {
            input: {
                type: new GraphQLNonNull(CreateTodoInput),
                description: 'Create todo input'
            }
        },
        resolve(root, { input }, { documentClient, TableName }) {
            input.id = String(Date.now());
            const params = {
                TableName,
                Item: input
            };
            return documentClient.put(params).promise().then(_ => input);
        }
    },
    updateTodo: {
        type: Todo,
        description: 'Update an existing todo item',
        args: {
            input: {
                type: new GraphQLNonNull(UpdateTodoInput),
                description: 'Update todo input'
            }
        },
        resolve(root, { input }, { documentClient, TableName }) {
            const params = {
                TableName,
                Item: input
            };
            return documentClient.put(params).promise().then(_ => input);
        }
    },
    deleteTodo: {
        type: GraphQLID,
        args: {
            input: {
                type: new GraphQLNonNull(DeleteTodoInput)
            }
        },
        resolve(root, { input }, { documentClient }) {
            const params = {
                TableName: process.env.TableName,
                Key: input.id
            };
            return documentClient.deleteTodo(params).promise().then(_ => input);
        }
    }
};