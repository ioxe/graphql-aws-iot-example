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

import uuidv4 from 'uuid/v4';

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
        resolve(root, { input }, { documentClient, TableName, pubsub }) {
            input.id = uuidv4();
            input.expiration = Date.now() + 1000 * 60 * 60 * 24 * 3;
            const params = {
                TableName,
                Item: input
            };
            return documentClient.put(params).promise().then(_ => {
                // Publish with the subscription name as the triggerName
                return pubsub.publish('NEW_TODO', { teamTodoAdded: input });
            }).then(res => {
                return input;
            });
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
        resolve(root, { input }, { documentClient, TableName }) {
            const params = {
                TableName,
                Key: input.id
            };
            return documentClient.deleteTodo(params).promise().then(_ => input);
        }
    }
};